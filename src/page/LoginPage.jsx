// LoginPage.jsx (Enhanced Animated Landing Page)
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import {
  Code,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { z } from "zod";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const { isLoggingIn, login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login({ ...data, role: isAdmin ? "admin" : "user" });
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-[#fdfbff] to-[#e0f7fa] flex items-center justify-center overflow-hidden font-inter">
      {/* Background Glows */}
      <div className="bg-glow bg-glow-1 animate-pulse delay-100"></div>
      <div className="bg-glow bg-glow-2 animate-pulse delay-300"></div>
      <div className="bg-glow bg-glow-3 animate-pulse delay-500"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-6 sm:px-10 lg:px-20 xl:px-32 z-10 py-12">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 sm:p-10 border border-purple-100 flex flex-col justify-center"
        >
          <div className="w-full max-w-md mx-auto space-y-8">
            <div className="text-center">
              <motion.div
                whileHover={{ rotate: 5 }}
                className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white rounded-xl shadow-lg"
              >
                <Code className="w-6 h-6" />
              </motion.div>
              <h1 className="text-3xl font-bold mt-4 text-purple-700">Welcome to LogiCode</h1>
              <p className="text-gray-600 text-sm mt-1 italic">Logic Meets Code. Elevate Your Skills.</p>
            </div>

            {/* Role Toggle */}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                className={`btn btn-sm px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                  isAdmin
                    ? "bg-purple-600 text-white"
                    : "bg-transparent text-gray-500 border-gray-300"
                }`}
                onClick={() => setIsAdmin(true)}
              >
                <ShieldCheck className="inline w-4 h-4 mr-1" /> Admin
              </button>
              <button
                type="button"
                className={`btn btn-sm px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                  !isAdmin
                    ? "bg-green-500 text-white"
                    : "bg-transparent text-gray-500 border-gray-300"
                }`}
                onClick={() => setIsAdmin(false)}
              >
                <User className="inline w-4 h-4 mr-1" /> User
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">Email</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    {...register("email")}
                    className={`input input-bordered w-full pl-10 ${errors.email ? "input-error" : ""}`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">Password</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`input input-bordered w-full pl-10 ${errors.password ? "input-error" : ""}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="btn bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:brightness-110 transition-all duration-300 w-full text-white shadow-md"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? <><Loader2 className="h-5 w-5 animate-spin" /> Logging in...</> : "Sign in"}
              </motion.button>
            </form>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Don't have an account? <Link to="/signup" className="text-fuchsia-600 font-semibold hover:underline">Sign up</Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col items-center justify-center p-8 sm:p-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-purple-100"
        >
          <motion.div
            className="w-full max-w-md p-6 bg-[#fdfbff] rounded-xl shadow-inner border border-purple-200"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <pre className="text-green-600 text-sm font-mono whitespace-pre-wrap">
{`function isValid(s) {
  const stack = [];
  const map = { '(': ')', '{': '}', '[': ']' };
  for (let i = 0; i < s.length; i++) {
    if (s[i] in map) stack.push(s[i]);
    else if (map[stack.pop()] !== s[i]) return false;
  }
  return stack.length === 0;
}`}
            </pre>
          </motion.div>

          <h2 className="text-xl font-semibold text-purple-700 mt-6 animate-pulse">Practice. Debug. Master.</h2>
          <p className="text-center text-gray-600 text-sm max-w-xs mt-2">
            Sharpen your coding skills with logic-driven challenges, curated for learners and pros.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;