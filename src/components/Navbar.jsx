import React from "react";
import { User, Code, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { authUser } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 w-full px-4 py-3 bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/10 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/leetlab.svg"
            alt="Leetlab Logo"
            className="h-10 w-10 bg-primary/20 p-2 rounded-full shadow-lg"
          />
          <span className="text-xl font-extrabold text-white group-hover:text-primary transition hidden md:block">
            LogiCode
          </span>
        </Link>

        {/* User Dropdown */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-1">
              <img
                src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
                alt="User Avatar"
                className="rounded-full object-cover w-full h-full"
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[50] p-3 shadow-xl border border-white/10 bg-[#1e293b] text-white rounded-xl w-56 space-y-2"
          >
            <li>
              <p className="text-base font-semibold">{authUser?.name}</p>
              <hr className="border-white/10 my-1" />
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:bg-primary hover:text-white px-2 py-1 rounded-md transition"
              >
                <User className="w-4 h-4" />
                My Profile
              </Link>
            </li>
            {authUser?.role === "ADMIN" && (
              <li>
                <Link
                  to="/add-problem"
                  className="flex items-center gap-2 hover:bg-primary hover:text-white px-2 py-1 rounded-md transition"
                >
                  <Code className="w-4 h-4" />
                  Add Problem
                </Link>
              </li>
            )}
            <l1><Link
    to="/my-playlist"
    className="flex items-center gap-2 hover:bg-primary hover:text-white px-2 py-1 rounded-md transition"
  >
    📂 My Playlists
  </Link></l1>
            <li>
              <LogoutButton className="flex items-center gap-2 hover:bg-primary hover:text-white px-2 py-1 rounded-md transition">
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
