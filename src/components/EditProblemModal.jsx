import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useProblemStore } from "../store/useProblemStore";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

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

    if (res.success) {
      // 🎉 Confetti animation
      confetti({
        particleCount: 150,
        spread: 60,
        origin: { y: 0.6 },
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      {/* Pastel blobs */}
      <div className="absolute top-10 left-10 w-60 h-60 bg-pink-300 opacity-30 blur-3xl rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-purple-300 opacity-30 blur-3xl rounded-full animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300 opacity-20 blur-3xl rounded-full animate-pulse pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.4 }}
        className="relative bg-white/30 backdrop-blur-2xl border border-purple-200 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 text-zinc-800"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-extrabold tracking-tight text-zinc-800">Edit Problem</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle text-zinc-800 hover:bg-zinc-200 transition"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="form-control">
            <label className="label font-semibold text-zinc-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered w-full bg-white/50 border-zinc-300 text-zinc-800 placeholder-zinc-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 transition rounded-xl"
              placeholder="Problem title"
              required
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label font-semibold text-zinc-700">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full bg-white/50 border-zinc-300 text-zinc-800 placeholder-zinc-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 transition rounded-xl"
              placeholder="Describe the problem"
              required
            />
          </div>

          {/* Difficulty */}
          <div className="form-control">
            <label className="label font-semibold text-zinc-700">Difficulty</label>
            <select
              name="difficuilty"
              value={formData.difficuilty}
              onChange={handleChange}
              className="select select-bordered w-full bg-white/50 border-zinc-300 text-zinc-800 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 transition rounded-xl"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="form-control">
            <label className="label font-semibold text-zinc-700">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags.join(", ")}
              onChange={(e) => handleArrayChange(e, "tags")}
              className="input input-bordered w-full bg-white/50 border-zinc-300 text-zinc-800 placeholder-zinc-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 transition rounded-xl"
              placeholder="e.g. array, sorting, dp"
            />
          </div>

          {/* Constraints */}
          <div className="form-control">
            <label className="label font-semibold text-zinc-700">Constraints</label>
            <input
              type="text"
              name="constraints"
              value={formData.constraints}
              onChange={handleChange}
              className="input input-bordered w-full bg-white/50 border-zinc-300 text-zinc-800 placeholder-zinc-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 transition rounded-xl"
              placeholder="Constraints like time, memory limits"
            />
          </div>

          {/* Examples */}
          <div className="form-control">
            <label className="label font-semibold text-zinc-700">Examples</label>
            {formData.examples.map((example, idx) => (
              <div
                key={idx}
                className="border border-zinc-300 bg-white/40 backdrop-blur rounded-xl p-4 mb-4 shadow transition"
              >
                <div className="flex flex-col gap-2 mb-2">
                  <input
                    type="text"
                    value={example.input}
                    onChange={(e) => {
                      const updated = [...formData.examples];
                      updated[idx].input = e.target.value;
                      setFormData((prev) => ({ ...prev, examples: updated }));
                    }}
                    className="input input-bordered w-full bg-white/60 border-zinc-300 text-zinc-800"
                    placeholder="Example input"
                  />
                  <input
                    type="text"
                    value={example.output}
                    onChange={(e) => {
                      const updated = [...formData.examples];
                      updated[idx].output = e.target.value;
                      setFormData((prev) => ({ ...prev, examples: updated }));
                    }}
                    className="input input-bordered w-full bg-white/60 border-zinc-300 text-zinc-800"
                    placeholder="Example output"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.examples.filter((_, i) => i !== idx);
                      setFormData((prev) => ({ ...prev, examples: updated }));
                    }}
                    className="btn btn-error btn-xs mt-2"
                  >
                    Remove
                  </button>
                </div>
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
              className="btn bg-pink-300 hover:bg-pink-200 text-zinc-800 font-semibold rounded-xl shadow transition"
            >
              + Add Example
            </button>
          </div>

          {/* Testcases */}
          <div className="form-control">
            <label className="label font-semibold text-zinc-700">Testcases</label>
            {formData.testcases.map((testcase, idx) => (
              <div
                key={idx}
                className="border border-zinc-300 bg-white/40 backdrop-blur rounded-xl p-4 mb-4 shadow transition"
              >
                <div className="flex flex-col gap-2 mb-2">
                  <input
                    type="text"
                    value={testcase.input}
                    onChange={(e) => {
                      const updated = [...formData.testcases];
                      updated[idx].input = e.target.value;
                      setFormData((prev) => ({ ...prev, testcases: updated }));
                    }}
                    className="input input-bordered w-full bg-white/60 border-zinc-300 text-zinc-800"
                    placeholder="Testcase input"
                  />
                  <input
                    type="text"
                    value={testcase.output}
                    onChange={(e) => {
                      const updated = [...formData.testcases];
                      updated[idx].output = e.target.value;
                      setFormData((prev) => ({ ...prev, testcases: updated }));
                    }}
                    className="input input-bordered w-full bg-white/60 border-zinc-300 text-zinc-800"
                    placeholder="Testcase output"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.testcases.filter((_, i) => i !== idx);
                      setFormData((prev) => ({ ...prev, testcases: updated }));
                    }}
                    className="btn btn-error btn-xs mt-2"
                  >
                    Remove
                  </button>
                </div>
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
              className="btn bg-pink-300 hover:bg-pink-200 text-zinc-800 font-semibold rounded-xl shadow transition"
            >
              + Add Testcase
            </button>
          </div>

          {/* Code snippets */}
          {[{ label: "JavaScript", value: jsCode, setter: setJsCode },
            { label: "Python", value: pyCode, setter: setPyCode },
            { label: "Java", value: javaCode, setter: setJavaCode }
          ].map(({ label, value, setter }) => (
            <div className="form-control" key={label}>
              <label className="label font-semibold text-zinc-700">{label} Solution</label>
              <textarea
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="textarea textarea-bordered w-full font-mono bg-white/50 border-zinc-300 text-zinc-800 placeholder-zinc-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 transition rounded-xl"
                rows={5}
                placeholder={`// ${label} solution...`}
              />
            </div>
          ))}

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="btn bg-white/30 hover:bg-white/50 text-zinc-800 font-semibold rounded-xl px-6 py-2 shadow transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-purple-400 hover:bg-purple-300 text-white font-semibold rounded-xl px-6 py-2 shadow transition"
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
