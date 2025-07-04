import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Bookmark,
  Share2,
  Clock,
  Users,
  ThumbsUp,
  Home,
  Terminal,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import SubmissionsList from "../components/SubmissionList";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  const {
    getSubmissionForProblem,
    submissions,
    isLoading: isSubmissionsLoading,
    submissionCount,
    getSubmissionCountForProblem,
    getSuccessRateForProblem,
    successRate,
  } = useSubmissionStore();
  const { executeCode, isExecuting, submission } = useExecutionStore();
  const { getAllPlaylists } = usePlaylistStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [editorReady, setEditorReady] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [showVerdict, setShowVerdict] = useState(false);

  useEffect(() => {
    getProblemById(id);
    getAllPlaylists();
    getSubmissionCountForProblem(id);
    getSuccessRateForProblem(id);
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(problem.codeSnippets[selectedLanguage] || "");
      setEditorReady(false);
    }
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions") {
      getSubmissionForProblem(id);
    }
  }, [activeTab]);

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleRunCode = async () => {
    setHasRun(true);
    setShowVerdict(false); // 💥 Hide verdict while running

    const stdin = problem.testcases.map((tc) => tc.input);
    const expected = problem.testcases.map((tc) => tc.output);

    await executeCode(code, getLanguageId(selectedLanguage), stdin, expected, id);

    setShowVerdict(true); // 💥 Show verdict only after execution finishes
  };

  const renderExamples = () => {
    let examplesArray = [];
    if (Array.isArray(problem.examples)) {
      examplesArray = problem.examples;
    } else if (typeof problem.examples === "object") {
      examplesArray = Object.entries(problem.examples).map(([key, val]) => ({
        input: val.input,
        output: val.output,
        explanation: val.explanation,
      }));
    }
    if (!examplesArray.length) return null;

    return (
      <table className="w-full text-xs md:text-sm border border-purple-200 rounded mb-4">
        <thead className="bg-purple-50 text-purple-700">
          <tr>
            <th className="p-2 text-left">Input</th>
            <th className="p-2 text-left">Output</th>
            <th className="p-2 text-left">Explanation</th>
          </tr>
        </thead>
        <tbody>
          {examplesArray.map((ex, idx) => (
            <tr key={idx} className="even:bg-white odd:bg-purple-50">
              <td className="p-2 font-mono whitespace-pre-wrap">{ex.input}</td>
              <td className="p-2 font-mono whitespace-pre-wrap">{ex.output}</td>
              <td className="p-2">{ex.explanation || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderVerdict = () => {
    if (!showVerdict || !submission) return null;

    return (
      <div
        className={`p-3 text-sm rounded overflow-y-auto ${
          submission.status === "Accepted"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {submission.status === "Accepted" ? (
          <>
            <p className="text-lg font-bold">Accepted ✅</p>
            <p className="mt-2 font-semibold">Congratulations 🎉 Your solution passed all test cases!</p>
          </>
        ) : (
          <>
            {submission.testCases.some((tc) => tc.compileOutput || tc.stderr) ? (
              <div>
                <p className="font-bold">Error ❌</p>
                <pre className="whitespace-pre-wrap">
                  {submission.testCases.find((tc) => tc.compileOutput || tc.stderr)?.compileOutput ||
                    submission.testCases.find((tc) => tc.compileOutput || tc.stderr)?.stderr}
                </pre>
              </div>
            ) : (
              <>
                {(() => {
                  const firstFail = submission.testCases.find((tc) => !tc.passed);
                  if (!firstFail) return null;
                  return (
                    <>
                      <p className="font-bold">Failed ❌</p>
                      <div>
                        <p><strong>Testcase {firstFail.testCase}</strong></p>
                        <strong>Input:{" "}</strong>
                        <pre className="inline">{problem.testcases[firstFail.testCase - 1].input}</pre>
                      </div>
                      <div>
                        <strong>Expected:</strong>{" "}
                        <pre className="inline">{firstFail.expected}</pre>
                      </div>
                      <div>
                        <strong>Your Output:</strong>{" "}
                        <pre className="inline">{firstFail.stdout}</pre>
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    if (!problem) return null;
    return (
      <>
        <div className="space-y-4 text-gray-800">
          <h2 className="text-base md:text-lg font-bold">{problem.question}</h2>
          <p className="text-sm md:text-base">{problem.description}</p>
          {renderExamples()}
          {problem.constraints && (
            <div className="bg-purple-50 border border-purple-200 p-3 rounded text-xs md:text-sm">
              <strong>Constraints:</strong>
              <p>{problem.constraints}</p>
            </div>
          )}
          {/* 💥 Verdict moved below constraints */}
          {renderVerdict()}
        </div>
      </>
    );
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-tr from-[#fdfbff] to-[#e0f7ea]">
        <div className="animate-pulse text-purple-600">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="h-screen w-screen flex font-inter overflow-hidden p-6 pb-3"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Left Column */}
      <div className="w-1/2 bg-white p-6 overflow-y-auto flex flex-col space-y-6 border-r border-purple-100">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <Link to="/" className="flex items-center gap-1 text-purple-700 text-sm">
            <Home /> Back
          </Link>
          <h1 className="text-lg md:text-xl font-extrabold text-gray-800">
            {problem.title}
          </h1>
          <div className="flex gap-3 text-gray-600 text-xs md:text-sm">
            <Clock /> {new Date(problem.createdAt).toLocaleDateString()}
            <Users /> {submissionCount}
            <ThumbsUp /> {successRate}%
          </div>
        </div>

        <div className="flex gap-3">
          {["description", "submissions", "hints"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 rounded text-xs md:text-sm ${
                activeTab === tab
                  ? "bg-purple-200 text-purple-800"
                  : "text-gray-600 hover:bg-purple-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "description" && renderTabContent()}
        {activeTab === "submissions" && (
          <SubmissionsList submissions={submissions} isLoading={isSubmissionsLoading} />
        )}
        {activeTab === "hints" && (
          <div className="bg-purple-50 border border-purple-200 p-3 rounded text-gray-800 text-sm">
            {problem.hints || "No hints available."}
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="w-1/2 flex flex-col bg-white border border-purple-100">
        <div className="flex justify-between items-center px-4 py-3 bg-purple-50 border-b border-purple-200">
          <div className="flex items-center gap-2 text-purple-700 text-sm">
            <Terminal /> Code Editor
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="p-1 border border-purple-200 rounded text-xs md:text-sm bg-white"
            >
              {Object.keys(problem.codeSnippets).map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <Bookmark className="text-purple-600 cursor-pointer" size={18} />
            <Share2 className="text-purple-600 cursor-pointer" size={18} />
          </div>
        </div>
        <div className="flex-1 relative">
          {!editorReady && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-white animate-pulse z-10" />
          )}
          <Editor
            height="500px"
            theme="vs-light"
            language={selectedLanguage.toLowerCase()}
            value={code}
            onMount={() => setEditorReady(true)}
            onChange={(v) => setCode(v || "")}
            options={{
              fontSize: 14,
            }}
          />
        </div>
        <div className="flex flex-col px-4 py-3 bg-purple-50 border-t border-purple-200">
          <button
            onClick={handleRunCode}
            disabled={isExecuting}
            className="self-end px-5 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs md:text-sm mb-4"
          >
            {isExecuting ? "Running..." : "Run"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProblemPage;
