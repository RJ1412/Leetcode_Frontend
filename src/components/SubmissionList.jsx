import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

const SubmissionsList = ({ submissions, isLoading }) => {
  const safeParse = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing data:", error);
      return [];
    }
  };

  const calculateAverageMemory = (memoryData) => {
    const memoryArray = safeParse(memoryData).map((m) =>
      parseFloat(m.split(" ")[0])
    );
    if (memoryArray.length === 0) return 0;
    return (
      memoryArray.reduce((acc, curr) => acc + curr, 0) / memoryArray.length
    );
  };

  const calculateAverageTime = (timeData) => {
    const timeArray = safeParse(timeData).map((t) =>
      parseFloat(t.split(" ")[0])
    );
    if (timeArray.length === 0) return 0;
    return timeArray.reduce((acc, curr) => acc + curr, 0) / timeArray.length;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!submissions?.length) {
    return (
      <div className="text-center p-8 text-zinc-400">
        No submissions yet
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {submissions.map((submission, idx) => {
        const avgMemory = calculateAverageMemory(submission.memory);
        const avgTime = calculateAverageTime(submission.time);

        return (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.5, ease: "easeOut" }}
            className="bg-white/60 backdrop-blur-md border border-purple-100 hover:border-purple-300 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                {submission.status === "Accepted" ? (
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">Accepted</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-pink-500">
                    <XCircle className="w-5 h-5" />
                    <span className="font-semibold">{submission.status}</span>
                  </div>
                )}
                <span className="px-2 py-1 rounded bg-purple-100 text-xs text-purple-700 font-medium border border-purple-200">
                  {submission.language}
                </span>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-4 text-xs text-purple-700">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{avgTime.toFixed(3)} s</span>
                </div>
                <div className="flex items-center gap-1">
                  <Memory className="w-4 h-4" />
                  <span>{avgMemory.toFixed(0)} KB</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SubmissionsList;
