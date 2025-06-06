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
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion } from "framer-motion";

const SignUpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
});

const particlesOptions = {
  background: { color: { value: "#0f172a" } },
  fpsLimit: 60,
  interactivity: {
    events: { onHover: { enable: true, mode: "repulse" } },
    modes: { repulse: { distance: 80, duration: 0.4 } },
  },
  particles: {
    color: { value: "#ffffff" },
    links: { enable: true, color: "#ffffff", distance: 120, opacity: 0.2, width: 1 },
    move: { enable: true, speed: 1, direction: "none", outMode: "bounce" },
    number: { value: 50 },
    size: { value: { min: 1, max: 3 } },
  },
  detectRetina: true,
};

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
    <div className="relative h-screen w-full bg-gradient-to-tr from-[#0f172a] to-[#1e293b] flex items-center justify-center overflow-hidden px-6">
      <Particles id="tsparticles" init={loadFull} options={particlesOptions} className="absolute inset-0 z-0" />

      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl z-10">
        {/* Left Panel - Form */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center items-center p-6 sm:p-10 w-full md:w-1/2 bg-[#0f172a]/80 backdrop-blur-md rounded-2xl shadow-lg"
        >
          <div className="w-full max-w-md space-y-8">
            {/* Branding */}
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-extrabold text-white"
              >
                LogiCode
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-white/60 font-light"
              >
                Practice. Learn. Grow.
              </motion.p>
            </div>

            <div className="text-center mb-6">
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 rounded-xl bg-purple-700 flex items-center justify-center shadow-lg"
                >
                  <Code className="w-6 h-6 text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold text-white mt-2">Create Your LogiCode Account</h1>
                <p className="text-white/70">Join the coding community</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white font-medium">Name</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="John Doe"
                    className={`input input-bordered w-full pl-10 text-black ${errors.name ? "input-error" : ""}`}
                  />
                </div>
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white font-medium">Email</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="you@example.com"
                    className={`input input-bordered w-full pl-10 text-black ${errors.email ? "input-error" : ""}`}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white font-medium">Password</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className={`input input-bordered w-full pl-10 text-black ${errors.password ? "input-error" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
              </div>

              {/* Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="btn bg-violet-600 hover:bg-violet-500 text-white w-full border-0 focus:outline-none rounded-lg shadow-lg hover:shadow-violet-400/40 transition-all"
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

            {/* Redirect */}
            <p className="text-white/70 text-center">
              Already have an account?{" "}
              <Link to="/login" className="link link-accent">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Right Panel - Code Box */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center justify-center space-y-6 w-full md:w-1/2 mt-10 md:mt-0"
        >
          <div className="w-full max-w-md bg-[#1e293b] p-6 rounded-xl shadow-lg animate-float">
            <pre className="text-green-400 text-sm whitespace-pre-wrap">
{`const solve = () => {
  let solved = [];
  for (let i = 0; i < 100; i++) {
    if (i % 2 === 0) solved.push(i);
  }
  return solved;
};`}
            </pre>
          </div>
          <h2 className="text-xl font-semibold text-center animate-pulse text-white">
            Empower Your Logic, Join LogiCode 💡
          </h2>
          <p className="text-center text-white/70 max-w-xs">
            Build, learn, and become a better developer every day.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;
