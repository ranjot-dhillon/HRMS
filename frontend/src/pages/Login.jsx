import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const Login = () => {
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  function generateCaptcha() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return captcha;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password }
      );

      if (response.data.success && response.data.token) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);

        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error);
      } else {
        setError("Server error");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-600">
      <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white">
          Human Resource Management System
        </h2>
        <p className="text-center text-gray-200 mb-6">Welcome Back 👋</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Captcha */}
          <div className="flex items-center gap-3">
            <div className="bg-black text-cyan-400 font-mono font-bold px-4 py-2 rounded-lg tracking-widest">
              {captcha}
            </div>
            <input
              type="text"
              placeholder="Enter CAPTCHA"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              required
              className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold shadow-md transform transition hover:scale-105"
          >
            Login
          </button>
        </form>

        {/* Links */}
        <div className="mt-4 text-center text-sm text-gray-200">
          <a href="#" className="hover:underline hover:text-white">
            Forgot Password?
          </a>
        </div>
        <div className="mt-2 text-center text-sm text-gray-200">
          Don’t have an account?{" "}
          <a href="#" className="text-cyan-400 hover:underline">
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
