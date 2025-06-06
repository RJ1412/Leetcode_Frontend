// ProblemPage.jsx
import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play, FileText, Lightbulb, Bookmark, Share2, Clock, ChevronRight,
  Code2, Users, ThumbsUp, Home, Terminal,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  const {
    submissions, isLoading: isSubmissionsLoading,
    getSubmissionForProblem, getSubmissionCountForProblem,
    submissionCount, getSuccessRateForProblem, successRate,
  } = useSubmissionStore();
  const { executeCode, submission, isExecuting } = useExecutionStore();
  const { playlists, getAllPlaylists } = usePlaylistStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testcases, setTestCases] = useState([]);

  useEffect(() => { getProblemById(id); }, [id]);
  useEffect(() => { if (playlists.length === 0) getAllPlaylists(); }, []);
  useEffect(() => { if (id) { getSubmissionCountForProblem(id); getSuccessRateForProblem(id); } }, [id]);
  useEffect(() => {
    if (problem && selectedLanguage) {
      setCode(problem.codeSnippets?.[selectedLanguage] || "");
      setTestCases(problem.testcases?.map(tc => ({ input: tc.input, output: tc.output })) || []);
    }
  }, [problem, selectedLanguage]);
  useEffect(() => { if (activeTab === "submissions" && id) getSubmissionForProblem(id); }, [activeTab, id]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem?.codeSnippets?.[lang] || "");
  };

  const handleRunCode = (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map(tc => tc.input);
      const expected_outputs = problem.testcases.map(tc => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.error("Error executing code", error);
    }
  };

  const renderTabButton = (key, label, Icon) => (
    <button
      key={key}
      className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all text-sm font-medium
        ${activeTab === key
          ? "bg-white/10 text-white shadow"
          : "text-white/60 hover:text-white hover:bg-white/5"}`}
      onClick={() => setActiveTab(key)}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  const renderTabContent = () => {
    if (!problem) return null;
    return (
      <motion.div variants={fadeIn} initial="hidden" animate="visible">
        {activeTab === "description" && (
          <div className="prose prose-invert max-w-none text-white">
            <p className="text-lg mb-6">{problem.description}</p>
            {problem.examples && (
              <>
                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                {Object.entries(problem.examples).map(([lang, example]) => (
                  <div key={lang} className="bg-[#1e293b] p-4 rounded-lg mb-4 border border-white/10">
                    <p><span className="text-indigo-400 font-semibold">Input:</span> {example.input}</p>
                    <p><span className="text-indigo-400 font-semibold">Output:</span> {example.output}</p>
                    {example.explanation && (
                      <p><span className="text-emerald-400 font-semibold">Explanation:</span> {example.explanation}</p>
                    )}
                  </div>
                ))}
              </>
            )}
            {problem.constraints && (
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">Constraints:</h3>
                <div className="bg-[#1e293b] p-4 rounded-lg border border-white/10 text-sm">
                  {problem.constraints}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "submissions" && (
          <SubmissionsList submissions={submissions} isLoading={isSubmissionsLoading} />
        )}

        {activeTab === "hints" && (
          <div className="p-4 text-white">
            {problem.hints ? (
              <div className="bg-[#1e293b] p-4 rounded-lg border border-white/10 text-sm">{problem.hints}</div>
            ) : (
              <div className="text-center text-white/60">No hints available</div>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f172a] text-white">
        <div className="p-8 text-center">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-t-purple-400 border-white/10 mx-auto" />
          <p className="mt-4 text-white/60">Loading problem...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="min-h-screen bg-gradient-to-tr from-[#0f172a] to-[#1e293b] text-white px-4 py-8" initial="hidden" animate="visible" variants={fadeIn}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link to="/" className="flex items-center gap-2 text-purple-400 mb-2">
            <Home className="w-5 h-5" />
            <ChevronRight className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <div className="flex items-center gap-4 text-sm mt-2 text-white/70">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(problem.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {submissionCount} Submissions</span>
            <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> {successRate}% Success</span>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={() => setIsBookmarked(!isBookmarked)} className={`rounded-full p-2 hover:bg-white/10 transition ${isBookmarked ? "text-purple-400" : "text-white"}`}>
            <Bookmark className="w-5 h-5" />
          </button>
          <button className="rounded-full p-2 hover:bg-white/10 transition">
            <Share2 className="w-5 h-5" />
          </button>
          <select
            className="bg-[#0f172a] border border-white/20 text-white text-sm px-3 py-2 rounded-lg outline-none"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {problem.codeSnippets && Object.keys(problem.codeSnippets).map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1e293b] p-4 rounded-2xl shadow-xl border border-white/10">
          <div className="flex gap-4 mb-4">
            {renderTabButton("description", "Description", FileText)}
            {renderTabButton("submissions", "Submissions", Code2)}
            {renderTabButton("hints", "Hints", Lightbulb)}
          </div>
          {renderTabContent()}
        </div>

        <div className="bg-[#1e293b] rounded-2xl shadow-xl border border-white/10 overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10">
            <Terminal className="w-4 h-4" />
            <span className="text-white">Code Editor</span>
          </div>
          <div className="h-[600px] w-full">
            <Editor
              height="100%"
              language={selectedLanguage.toLowerCase()}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
          <div className="px-4 py-3 border-t border-white/10 bg-[#0f172a] flex justify-between items-center">
            <button
              className={`px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition ${isExecuting ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleRunCode}
              disabled={isExecuting}
            >
              {isExecuting ? "Running..." : "Run Code"}
            </button>
            <button className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">
              Submit Solution
            </button>
          </div>
        </div>
      </div>

      {/* Test case table */}
      <motion.div className="bg-[#1e293b] rounded-2xl border border-white/10 shadow-xl mt-6 p-6" variants={fadeIn} initial="hidden" animate="visible">
        {submission ? (
          <Submission submission={submission} />
        ) : (
          <>
            <h3 className="text-xl font-bold mb-4">Test Cases</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-white/60 text-left">
                    <th className="p-2">Input</th>
                    <th className="p-2">Expected Output</th>
                  </tr>
                </thead>
                <tbody>
                  {testcases.map((tc, i) => {
                    const blurClass = !submission ? "blurred" : "";
                    return (

                      <tr key={i} className="bg-[#0f172a] hover:bg-white/5 transition rounded-lg">
                        <td className={`p-2 font-mono text-white ${blurClass}`}>
                          {tc.input}
                        </td>
                        <td className={`p-2 font-mono text-white ${blurClass}`}>
                          {tc.output}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProblemPage;
