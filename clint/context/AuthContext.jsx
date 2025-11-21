import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// --- 1. SETUP ---
// Get the backend URL from environment variables
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Create a dedicated Axios instance. This is a best practice.
// It avoids polluting the global 'axios' and makes auth headers easy to manage.
const apiClient = axios.create({
  baseURL: backendUrl,
});

export const AuthContext = createContext();

// Custom hook for easy consumption of the context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // --- 2. STATE MANAGEMENT ---
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  // Add a loading state for the initial auth check
  const [isLoading, setIsLoading] = useState(true);

  // Socket.io state
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // --- 3. HELPER FUNCTIONS ---

  // Centralized function to set the authenticated state
  const setAuthenticatedState = (data) => {
    setAuthUser(data.userData);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    // Set the token on our dedicated API client for all future requests
    apiClient.defaults.headers.common["token"] = data.token;
  };

  // Centralized error handler
  const handleError = (error, defaultMessage = "An error occurred.") => {
    // Show the specific error message from the server if it exists
    const message = error.response?.data?.message || defaultMessage;
    toast.error(message);
    console.error(error);
  };

  // --- 4. CORE AUTH FUNCTIONS ---

  // Check user's auth status on app load
  const checkAuth = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      apiClient.defaults.headers.common["token"] = token;
      const { data } = await apiClient.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
      } else {
        // If the check fails (e.g., token expired), log out
        logout();
      }
    } catch (error) {
      handleError(error, "Session expired. Please log in again.");
      logout(); // Force logout on auth check failure
    } finally {
      setIsLoading(false);
    }
  }, [token]); // 'logout' is not needed as a dependency

  // Signup function
  const signup = async (credentials) => {
    try {
      const { data } = await apiClient.post("/api/auth/signup", credentials);
      if (data.success) {
        setAuthenticatedState(data);
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      handleError(error, "Signup failed.");
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const { data } = await apiClient.post("/api/auth/login", credentials);
      if (data.success) {
        setAuthenticatedState(data);
        toast.success(data.message);
      }
    } catch (error) {
      handleError(error, "Login failed.");
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setAuthUser(null);
    setToken(null);
    setOnlineUsers([]);
    // Remove the auth header from our API client
    delete apiClient.defaults.headers.common["token"];
    // Disconnect the socket
    socket?.disconnect();
    setSocket(null);
    toast.success("Logged out successfully.");
  };

  // Update profile function
  const updateProfile = async (body) => {
    try {
      const { data } = await apiClient.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully.");
      }
    } catch (error) {
      handleError(error, "Profile update failed.");
    }
  };

  // --- 5. EFFECTS ---

  // Run the auth check once on initial application load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Manage Socket.io connection lifecycle
  useEffect(() => {
    if (authUser && !socket) {
      // User is authenticated, create and connect the socket
      const newSocket = io(backendUrl, {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(newSocket);

      // Setup listeners
      newSocket.on("getOnlineUsers", (userIds) => {
        setOnlineUsers(userIds);
      });

      // Cleanup function to run when component unmounts or authUser changes
      return () => {
        newSocket.disconnect();
        newSocket.off("getOnlineUsers");
      };
    } else if (!authUser && socket) {
      // User logged out, disconnect socket
      socket.disconnect();
      setSocket(null);
    }
  }, [authUser]); // Dependency array is correct

  // --- 6. CONTEXT VALUE ---
  // Only expose the state and functions that components need.

  const value = {
    authUser,
    token,
    socket,
    onlineUsers,
    login,
    signup,
    logout,
    updateProfile,
    isLoading,
    apiClient,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
