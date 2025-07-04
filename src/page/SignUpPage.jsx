// SignUpPage.jsx (Enhanced Animated Landing Page)
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
  User,
} from "lucide-react";
import { z } from "zod";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";

const SignUpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
});

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isSigninUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(SignUpSchema) });

  const onSubmit = async (data) => {
    try {
      await signup(data);
      console.log("signup data", data);
    } catch (error) {
      console.error("SignUp failed:", error);
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
              <h1 className="text-3xl font-bold mt-4 text-purple-700">Create Your LogiCode Account</h1>
              <p className="text-gray-600 text-sm mt-1 italic">Join the coding community</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">Name</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="John Doe"
                    className={`input input-bordered w-full pl-10 ${errors.name ? "input-error" : ""}`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">Email</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="you@example.com"
                    className={`input input-bordered w-full pl-10 ${errors.email ? "input-error" : ""}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">Password</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className={`input input-bordered w-full pl-10 ${errors.password ? "input-error" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              {/* Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="btn bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:brightness-110 transition-all duration-300 w-full text-white shadow-md"
                disabled={isSigninUp}
              >
                {isSigninUp ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Signing up...
                  </>
                ) : (
                  "Create account"
                )}
              </motion.button>
            </form>

            <p className="text-center text-sm text-gray-600 pt-4">
              Already have an account? <Link to="/login" className="text-fuchsia-600 font-semibold hover:underline">Sign in</Link>
            </p>
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
{`const solve = () => {
  let solved = [];
  for (let i = 0; i < 100; i++) {
    if (i % 2 === 0) solved.push(i);
  }
  return solved;
};`}
            </pre>
          </motion.div>

          <h2 className="text-xl font-semibold text-purple-700 mt-6 animate-pulse">Empower Your Logic, Join LogiCode 💡</h2>
          <p className="text-center text-gray-600 text-sm max-w-xs mt-2">
            Build, learn, and become a better developer every day.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;
