// LoginPage.jsx (Enhanced for LogiCode with Optional Animations)
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
  password: z.string().min(6, "Password must be atleast of 6 characters"),
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
    <div className="relative min-h-screen bg-gradient-to-tr from-[#0f172a] to-[#1e293b] flex items-center justify-center overflow-hidden px-6">
      {/* Floating glow background */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl space-y-10 md:space-y-0 md:space-x-10 z-10">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center items-center p-6 sm:p-12 w-full md:w-1/2 bg-[#0f172a]/80 backdrop-blur-md rounded-2xl shadow-lg"
        >
          <div className="w-full max-w-md space-y-8">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 rounded-xl bg-purple-700 flex items-center justify-center shadow-lg"
                >
                  <Code className="w-6 h-6 text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold mt-2">Welcome to LogiCode</h1>
                <p className="text-white/70 text-sm italic">Logic Meets Code. Elevate Your Skills.</p>
              </div>
            </div>

            {/* Admin/User Toggle */}
            <div className="flex justify-center gap-4 mb-4">
              <button
                type="button"
                className={`btn btn-sm px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                  isAdmin ? "bg-purple-600 text-white" : "bg-transparent text-white/70 border-white/30"
                }`}
                onClick={() => setIsAdmin(true)}
              >
                <ShieldCheck className="inline w-4 h-4 mr-1" /> Admin
              </button>
              <button
                type="button"
                className={`btn btn-sm px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                  !isAdmin ? "bg-green-500 text-white" : "bg-transparent text-white/70 border-white/30"
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
                  <span className="label-text text-white font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/40" />
                  </div>
                  <input
                    type="email"
                    {...register("email")}
                    className={`input input-bordered w-full pl-10 text-black ${
                      errors.email ? "input-error" : ""
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white font-medium">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/40" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`input input-bordered w-full pl-10 text-black ${
                      errors.password ? "input-error" : ""
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-white/40" />
                    ) : (
                      <Eye className="h-5 w-5 text-white/40" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="btn bg-violet-600 hover:bg-violet-500 transition-all duration-300 w-full rounded-lg shadow-lg hover:shadow-violet-400/50"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Logging in...
                  </>
                ) : (
                  "Sign in"
                )}
              </motion.button>
            </form>

            <div className="text-center">
              <p className="text-white/70">
                Don't have an account? <Link to="/signup" className="link link-accent">Sign up</Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center justify-center space-y-6 w-full md:w-1/2"
        >
          <div className="w-full max-w-md bg-[#1e293b] p-6 rounded-xl shadow-lg animate-float">
            <pre className="text-green-400 text-sm whitespace-pre-wrap">
{`function isValid(s) {
  const stack = [];
  const map = {
    '(': ')',
    '{': '}',
    '[': ']'
  };
  for (let i = 0; i < s.length; i++) {
    if (s[i] in map) {
      stack.push(s[i]);
    } else {
      const last = stack.pop();
      if (map[last] !== s[i]) return false;
    }
  }
  return stack.length === 0;
}`}
            </pre>
          </div>
          <h2 className="text-xl font-semibold text-center animate-pulse">
            Practice. Debug. Master.
          </h2>
          <p className="text-center text-white/70 max-w-xs text-sm">
            LogiCode is your destination to sharpen problem-solving with logic-driven challenges and competitive programming.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;