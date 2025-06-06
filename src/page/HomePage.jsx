import React, { useEffect } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { Loader, PlusCircle } from "lucide-react";
import ProblemTable from "../components/ProblemTable";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";

const HomePage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-tr from-[#0f172a] to-[#1e293b]">
        <Loader className="w-10 h-10 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-[#0f172a] to-[#1e293b] px-6 py-20 flex flex-col items-center text-white overflow-hidden">
      {/* Glowing Backgrounds */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600 opacity-20 blur-3xl rounded-full animate-pulse z-0" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-500 opacity-20 blur-3xl rounded-full animate-pulse z-0" />

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 text-center mb-8"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Welcome to <span className="text-purple-400">LogiCode</span>
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-white/70 max-w-3xl mx-auto">
         LogiCode – Decode logic, master DSA, and elevate your problem-solving skills with curated coding challenges</p>
      </motion.div>

      {/* Add Problem Button for Admin */}
      {authUser?.role === "ADMIN" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="z-10"
        >
          <Link
            to="/add-problem"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg shadow-lg transition duration-300"
          >
            <PlusCircle className="w-5 h-5" />
            Add Problem
          </Link>
        </motion.div>
      )}

      {/* Problem Table or Empty Message */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="w-full max-w-6xl mt-10 z-10"
      >
        {problems.length > 0 ? (
          <ProblemTable problems={problems} />
        ) : (
          <p className="text-lg font-semibold text-white/70 text-center border border-purple-600 border-dashed px-6 py-4 rounded-xl">
            No problems found
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default HomePage;
