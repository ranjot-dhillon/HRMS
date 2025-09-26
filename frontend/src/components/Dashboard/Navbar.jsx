// Navbar.jsx
import { useAuth } from "../../../context/authContext";
import { FaBell } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-md z-10 flex items-center justify-between px-6">
      {/* Welcome Text */}
      <h2 className="text-lg font-semibold tracking-wide">
        Welcome, <span className="font-bold">{user?.name || "User"}</span>
      </h2>
        {/* Logout Button */}
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-1.5 rounded-lg shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
    </header>
  );
}
