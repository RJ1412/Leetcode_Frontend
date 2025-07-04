import React from "react";
import { User, Code, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { authUser } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 w-full px-4 py-3 bg-white/60 backdrop-blur-lg border-b border-pink-200 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/leetlab.svg"
            alt="Leetlab Logo"
            className="h-10 w-10 bg-pink-100 p-2 rounded-full shadow"
          />
          <span className="text-xl font-extrabold text-pink-600 group-hover:text-purple-500 transition hidden md:block">
            LogiCode
          </span>
        </Link>

        {/* User Dropdown */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 h-10 rounded-full ring ring-pink-400 ring-offset-2">
              <img
                src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
                alt="User Avatar"
                className="rounded-full object-cover w-full h-full"
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[50] p-3 shadow-lg border border-pink-200 bg-white text-gray-800 rounded-xl w-56 space-y-2"
          >
            <li>
              <p className="text-base font-semibold text-purple-700">{authUser?.name}</p>
              <hr className="border-pink-200 my-1" />
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:bg-pink-100 px-2 py-1 rounded-md transition"
              >
                <User className="w-4 h-4 text-pink-500" />
                My Profile
              </Link>
            </li>
            {authUser?.role === "ADMIN" && (
              <li>
                <Link
                  to="/add-problem"
                  className="flex items-center gap-2 hover:bg-pink-100 px-2 py-1 rounded-md transition"
                >
                  <Code className="w-4 h-4 text-pink-500" />
                  Add Problem
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/my-playlist"
                className="flex items-center gap-2 hover:bg-pink-100 px-2 py-1 rounded-md transition"
              >
                📂 My Playlists
              </Link>
            </li>
            <li>
              <LogoutButton className="flex items-center gap-2 hover:bg-pink-100 px-2 py-1 rounded-md transition text-red-500">
                <LogOut className="w-4 h-4" />
                Logout
              </LogoutButton>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
