// 1. We only need these imports. 'axios' is no longer needed here.
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

// Custom hook for easy consumption
export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [unseenMsg, setUnseenMsg] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);

  // 2. THE RIGHT WAY: Get the 'apiClient' and 'socket' from AuthContext.
  // The apiClient already has the auth token, which is required for these routes.
  const { socket, apiClient, authUser } = useContext(AuthContext);

  // 3. OPTIMIZATION: Wrap data-fetching functions in 'useCallback'.
  // This prevents them from being redefined on every render,
  // which is essential for use in 'useEffect' hooks.
  const getUsers = useCallback(async () => {
    // Don't try to fetch if the client isn't ready
    if (!apiClient) return;

    try {
      const { data } = await apiClient.get("/api/messages/users");

      if (data.success) {
        setUsers(data.users);
        setUnseenMsg(data.unseenMsg);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to get users.";
      toast.error(message);
    }
  }, [apiClient]); // Dependency: Re-run only if apiClient changes

  const getMessages = useCallback(
    async (userId) => {
      if (!apiClient) return;

      try {
        const { data } = await apiClient.get(`/api/messages/${userId}`);
        if (data.success) {
          setMessages(data.messages);
        }
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to get messages.";
        toast.error(message);
      }
    },
    [apiClient]
  ); // Dependency: Re-run only if apiClient changes

  const sendMsg = async (messageData) => {
    try {
      const { data } = await apiClient.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        // The API returns the newly created message, so we add it to our local state
        setMessages((prevMsg) => [...prevMsg, data.message]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to send message.";
      toast.error(message);
    }
  };

  // 5. NEW: Fetch initial user data when the app loads
  useEffect(() => {
    // Only run if the user is authenticated and the client is ready
    if (authUser && apiClient) {
      getUsers();
    }
  }, [authUser, apiClient, getUsers]);

  useEffect(() => {
    // If a user is selected, fetch their message history
    if (selectedUser) {
      getMessages(selectedUser._id);
    } else {
      // If deselected, clear the message window
      setMessages([]);
    }
  }, [selectedUser, getMessages]);

  // 6. IMPROVEMENT: This effect is now cleaner and more robust
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        // If chat is open, mark as seen and add to visible messages
        newMessage.seen = true;
        setMessages((prevMsg) => [...prevMsg, newMessage]);
        // Also tell the backend to mark it as seen
        apiClient.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        // If chat is not open, add to unseen messages
        toast.success(`New message from ${newMessage.senderId}`); // (Better: look up sender name)
        setUnseenMsg((prevUnseenMsg) => ({
          ...prevUnseenMsg,
          [newMessage.senderId]: (prevUnseenMsg[newMessage.senderId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    // The cleanup function is now inline and simpler
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser, apiClient]); // Add apiClient as a dependency

  const value = {
    messages,
    users,
    selectedUser,
    unseenMsg,
    getMessages, // Expose getMessages to be called when a user is selected
    sendMsg,
    setSelectedUser,
    setUnseenMsg,
    getUsers,
    // We don't need to expose setMessages or getUsers directly
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
