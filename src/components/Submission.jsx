import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory
} from 'lucide-react';

const SubmissionResults = ({ submission }) => {
  const memoryArr = JSON.parse(submission.memory || '[]');
  const timeArr = JSON.parse(submission.time || '[]');

  const avgMemory =
    memoryArr.map((m) => parseFloat(m)).reduce((a, b) => a + b, 0) /
    memoryArr.length;

  const avgTime =
    timeArr.map((t) => parseFloat(t)).reduce((a, b) => a + b, 0) /
    timeArr.length;

  const passedTests = submission.testCases.filter((tc) => tc.passed).length;
  const totalTests = submission.testCases.length;
  const successRate = (passedTests / totalTests) * 100;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Overall Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: 'Status',
            content: submission.status,
            iconColor:
              submission.status === 'Accepted' ? 'text-green-400' : 'text-red-400',
            extraClass:
              submission.status === 'Accepted' ? 'text-success' : 'text-error'
          },
          {
            title: 'Success Rate',
            content: `${successRate.toFixed(1)}%`
          },
          {
            title: 'Avg. Runtime',
            content: `${avgTime.toFixed(3)} s`,
            icon: <Clock className="w-4 h-4" />
          },
          {
            title: 'Avg. Memory',
            content: `${avgMemory.toFixed(0)} KB`,
            icon: <Memory className="w-4 h-4" />
          }
        ].map((item, i) => (
          <motion.div
            key={i}
            className="rounded-2xl bg-[#111827]/70 backdrop-blur border border-zinc-700 hover:border-zinc-500 shadow-md hover:shadow-xl transition-all p-4"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-sm text-zinc-400 flex items-center gap-2 mb-1">
              {item.icon}
              {item.title}
            </h3>
            <div className={`text-lg font-bold ${item.extraClass || ''}`}>
              {item.content}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Test Case Results Table */}
      <motion.div
        className="rounded-xl bg-[#0f172a]/80 backdrop-blur border border-zinc-700 shadow-xl transition-all"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Test Cases Results</h2>
          <div className="overflow-x-auto rounded-md">
            <table className="table w-full text-sm">
              <thead className="text-zinc-400 border-b border-zinc-600">
                <tr>
                  <th>Status</th>
                  <th>Expected Output</th>
                  <th>Your Output</th>
                  <th>Memory</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
  {submission.testCases.map((testCase) => {
    const isFailed = !testCase.passed;
    const blurStyle = {
      filter: isFailed ? 'none' : 'blur(8px)',
      userSelect: isFailed ? 'auto' : 'none', // optional: prevent selecting blurred text
    };

    return (
      <motion.tr
        key={testCase.id}
        className="hover:bg-white/5 transition-colors"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.05 * testCase.id }}
      >
        <td>
          <div
            className={`flex items-center gap-2 ${
              testCase.passed ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {testCase.passed ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            {testCase.passed ? 'Passed' : 'Failed'}
          </div>
        </td>
        <td className="font-mono text-white" style={blurStyle}>
          {testCase.expected}
        </td>
        <td className="font-mono text-white" style={blurStyle}>
          {testCase.stdout || 'null'}
        </td>
        <td className="text-zinc-300">{testCase.memory}</td>
        <td className="text-zinc-300">{testCase.time}</td>
      </motion.tr>
    );
  })}
</tbody>

            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SubmissionResults;
