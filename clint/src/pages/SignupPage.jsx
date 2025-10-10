import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Use Link for navigation
import TermsPopup from "../components/TermsPopup";

const SignupPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [isOpen, setisOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Your signup logic here
    const user = {
      fullName,
      bio,
      email,
      password,
      agreedToTerms,
    };
    console.log("Signing up with:", user);

    setEmail("");
    setFullName("");
    setConfirmPassword("");
    setPassword("");
    navigate("/");
  };

  const handleConditionClick = (e) => {
    e.stopPropagation();
    setisOpen(true);
  };

  if (isOpen) {
    return (
      <TermsPopup
        isOpen={true}
        setisOpen={setisOpen}
        setAgreedToTerms={setAgreedToTerms}
      />
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/30 p-8 shadow-2xl backdrop-blur-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Input */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              placeholder="Your Name"
              className="w-full rounded-lg border-none bg-zinc-800/50 p-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              required
            />
          </div>
          {/* bio */}
          <div>
            <label
              htmlFor="bio"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Bio
            </label>
            <input
              type="text"
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              autoComplete="bio"
              placeholder="Write somthing about you"
              className="w-full rounded-lg border-none bg-zinc-800/50 p-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border-none bg-zinc-800/50 p-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-lg border-none bg-zinc-800/50 p-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border-none bg-zinc-800/50 p-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              required
            />
          </div>

          {/* --- Terms & Conditions (Simple & Reliable Checkbox) --- */}
          <div className="flex items-center pt-2">
            <label
              htmlFor="terms-checkbox"
              className="flex cursor-pointer items-center text-sm"
            >
              <input
                id="terms-checkbox"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                required
                className="
        mr-3 h-5 w-5 shrink-0 cursor-pointer rounded 
        border-gray-400 bg-zinc-800/50 text-indigo-500 
        focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900
      "
              />

              {/* The label text with a clickable link */}
              <span className="text-gray-300">
                I agree to the{" "}
                <a
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-400 hover:underline"
                  onClick={handleConditionClick}
                >
                  Terms & Conditions
                </a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 !mt-6"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-400 hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
