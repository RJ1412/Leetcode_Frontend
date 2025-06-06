import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useProblemStore } from "../store/useProblemStore";
import { motion } from "framer-motion";

const difficulties = ["EASY", "MEDIUM", "HARD"];

const EditProblemModal = ({ isOpen, onClose, problem }) => {
  const { updateProblem } = useProblemStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficuilty: "EASY",
    tags: [],
    examples: [],
    constraints: "",
    testcases: [],
  });

  const [jsCode, setJsCode] = useState("");
  const [pyCode, setPyCode] = useState("");
  const [javaCode, setJavaCode] = useState("");

  useEffect(() => {
    if (!problem) return;

    const ensureArray = (val) => (Array.isArray(val) ? val : []);

    setFormData({
      title: problem.title || "",
      description: problem.description || "",
      difficuilty: problem.difficuilty || "EASY",
      tags: ensureArray(problem.tags),
      examples: ensureArray(problem.examples),
      constraints: problem.constraints || "",
      testcases: ensureArray(problem.testcases),
    });

    const codeSources = {
      ...problem.codeSnippets,
      ...(problem.referenceSolutions || {}),
    };

    setJsCode(codeSources.JAVASCRIPT || codeSources.javascript || "");
    setPyCode(codeSources.PYTHON || codeSources.python || "");
    setJavaCode(codeSources.JAVA || codeSources.java || "");
  }, [problem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    const arr = e.target.value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, [field]: arr }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!problem) return;

    const codeSnippets = {};
    const referenceSolutions = {};

    if (jsCode.trim()) {
      codeSnippets.JAVASCRIPT = jsCode.trim();
      referenceSolutions.JAVASCRIPT = jsCode.trim();
    }
    if (pyCode.trim()) {
      const sanitized = pyCode
        .replace(/\t/g, "    ")
        .split("\n")
        .map((line) => line.replace(/\s+$/, ""))
        .join("\n");

      codeSnippets.PYTHON = sanitized;
      referenceSolutions.PYTHON = sanitized;
    }
    if (javaCode.trim()) {
      codeSnippets.JAVA = javaCode.trim();
      referenceSolutions.JAVA = javaCode.trim();
    }

    const res = await updateProblem(problem.id, {
      ...formData,
      codeSnippets,
      referenceSolutions,
    });

    if (res.success) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
      <div className="absolute top-12 left-12 w-64 h-64 bg-purple-600 opacity-20 blur-3xl rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-64 h-64 bg-indigo-500 opacity-20 blur-3xl rounded-full animate-pulse pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.4 }}
        className="relative bg-gradient-to-tr from-[#0f172a] to-[#1e293b] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 text-white"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-extrabold tracking-tight">Edit Problem</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/20 transition"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="form-control">
            <label className="label font-semibold text-purple-400">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered w-full bg-[#111827] border-purple-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
              placeholder="Problem title"
              required
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label font-semibold text-purple-400">Description</label>
            <textarea
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full bg-[#111827] border-purple-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
              placeholder="Describe the problem"
              required
            />
          </div>

          {/* Difficulty */}
          <div className="form-control">
            <label className="label font-semibold text-purple-400">Difficulty</label>
            <select
              name="difficuilty"
              value={formData.difficuilty}
              onChange={handleChange}
              className="select select-bordered w-full bg-[#111827] border-purple-600 text-white focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="form-control">
            <label className="label font-semibold text-purple-400">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags.join(", ")}
              onChange={(e) => handleArrayChange(e, "tags")}
              className="input input-bordered w-full bg-[#111827] border-purple-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
              placeholder="e.g. array, sorting, dp"
            />
          </div>

          {/* Constraints */}
          <div className="form-control">
            <label className="label font-semibold text-purple-400">Constraints</label>
            <input
              type="text"
              name="constraints"
              value={formData.constraints}
              onChange={handleChange}
              className="input input-bordered w-full bg-[#111827] border-purple-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
              placeholder="Constraints like time, memory limits"
            />
          </div>

          {/* Examples */}
          <div className="form-control">
            <label className="label font-semibold text-purple-400">Examples</label>
            {formData.examples.map((example, idx) => (
              <div
                key={idx}
                className="border border-purple-600 p-4 rounded-lg mb-4 bg-[#17203a] shadow-sm"
              >
                <div className="flex gap-3 mb-2">
                  <label className="w-20 font-semibold text-purple-300">Input:</label>
                  <input
                    type="text"
                    value={example.input}
                    onChange={(e) => {
                      const updated = [...formData.examples];
                      updated[idx].input = e.target.value;
                      setFormData((prev) => ({ ...prev, examples: updated }));
                    }}
                    className="input input-bordered w-full bg-[#111827] border-purple-600 text-white"
                    placeholder="Example input"
                  />
                </div>
                <div className="flex gap-3">
                  <label className="w-20 font-semibold text-purple-300">Output:</label>
                  <input
                    type="text"
                    value={example.output}
                    onChange={(e) => {
                      const updated = [...formData.examples];
                      updated[idx].output = e.target.value;
                      setFormData((prev) => ({ ...prev, examples: updated }));
                    }}
                    className="input input-bordered w-full bg-[#111827] border-purple-600 text-white"
                    placeholder="Example output"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = formData.examples.filter((_, i) => i !== idx);
                    setFormData((prev) => ({ ...prev, examples: updated }));
                  }}
                  className="btn btn-error btn-sm mt-3 shadow-lg"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  examples: [...prev.examples, { input: "", output: "" }],
                }))
              }
              className="btn bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg shadow-lg px-4 py-2 transition"
            >
              + Add Example
            </button>
          </div>

          {/* Testcases */}
          <div className="form-control">
            <label className="label font-semibold text-purple-400">Testcases</label>
            {formData.testcases.map((testcase, idx) => (
              <div
                key={idx}
                className="border border-purple-600 p-4 rounded-lg mb-4 bg-[#17203a] shadow-sm"
              >
                <div className="flex gap-3 mb-2">
                  <label className="w-20 font-semibold text-purple-300">Input:</label>
                  <input
                    type="text"
                    value={testcase.input}
                    onChange={(e) => {
                      const updated = [...formData.testcases];
                      updated[idx].input = e.target.value;
                      setFormData((prev) => ({ ...prev, testcases: updated }));
                    }}
                    className="input input-bordered w-full bg-[#111827] border-purple-600 text-white"
                    placeholder="Testcase input"
                  />
                </div>
                <div className="flex gap-3">
                  <label className="w-20 font-semibold text-purple-300">Output:</label>
                  <input
                    type="text"
                    value={testcase.output}
                    onChange={(e) => {
                      const updated = [...formData.testcases];
                      updated[idx].output = e.target.value;
                      setFormData((prev) => ({ ...prev, testcases: updated }));
                    }}
                    className="input input-bordered w-full bg-[#111827] border-purple-600 text-white"
                    placeholder="Testcase output"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = formData.testcases.filter((_, i) => i !== idx);
                    setFormData((prev) => ({ ...prev, testcases: updated }));
                  }}
                  className="btn btn-error btn-sm mt-3 shadow-lg"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  testcases: [...prev.testcases, { input: "", output: "" }],
                }))
              }
              className="btn bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg shadow-lg px-4 py-2 transition"
            >
              + Add Testcase
            </button>
          </div>

          {/* Code Snippets */}
          {[
            { label: "JavaScript", value: jsCode, setter: setJsCode },
            { label: "Python", value: pyCode, setter: setPyCode },
            { label: "Java", value: javaCode, setter: setJavaCode },
          ].map(({ label, value, setter }) => (
            <div className="form-control" key={label}>
              <label className="label font-semibold text-purple-400">{label} Solution</label>
              <textarea
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="textarea textarea-bordered w-full font-mono bg-[#111827] border-purple-600 text-white"
                rows={6}
                placeholder={`// ${label} solution...`}
              />
            </div>
          ))}

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost text-white hover:bg-white/20 px-6 py-2 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProblemModal;
