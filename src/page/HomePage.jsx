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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#fdfbff] to-[#fefae0]">
        <Loader className="w-10 h-10 animate-spin text-pink-400" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fdfbff] to-[#fefae0] text-gray-800 overflow-hidden">
      {/* Pastel Glowing Backgrounds */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#d8b4fe] opacity-30 blur-3xl rounded-full animate-pulse z-0" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#a5f3fc] opacity-30 blur-3xl rounded-full animate-pulse z-0" />
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#fcd5ce] opacity-30 blur-3xl rounded-full animate-pulse z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-purple-600">
            Welcome to <span className="text-pink-500">LogiCode</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
            LogiCode – Decode logic, master DSA, and elevate your problem-solving skills with curated coding challenges.
          </p>
        </motion.div>

        {/* Add Problem Button for Admin */}
        {authUser?.role === "ADMIN" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-center mb-8"
          >
            <Link
              to="/add-problem"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-400 hover:bg-pink-300 text-white font-semibold rounded-lg shadow-lg transition duration-300"
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
          className="mt-4"
        >
          {problems.length > 0 ? (
            <ProblemTable problems={problems} />
          ) : (
            <p className="text-lg font-semibold text-gray-600 text-center border border-dashed border-pink-400 px-6 py-4 rounded-xl">
              No problems found
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
