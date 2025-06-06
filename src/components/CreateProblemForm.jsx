import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  CheckCircle2,
  X
} from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficuilty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one test case is required"),
  examples: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().optional(),
      })
    )
    .min(1, "At least one example is required"),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
});

const defaultValues = {
  title: "",
  description: "",
  difficuilty: "EASY",
  tags: [""],
  constraints: "",
  hints: "",
  editorial: "",
  testcases: [{ input: "", output: "" }],
  examples: [{ input: "", output: "", explanation: "" }],
  codeSnippets: {
    JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
    PYTHON: "def solution():\n    # Write your code here\n    pass",
    JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
  },
  referenceSolutions: {
    JAVASCRIPT: "// Add your reference solution here",
    PYTHON: "# Add your reference solution here",
    JAVA: "// Add your reference solution here",
  },
};


const CreateProblemForm = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues,
  });

  const {
    fields: exampleFields,
    append: appendExample,
    remove: removeExample,
  } = useFieldArray({ control, name: "examples" });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const {
    fields: testCaseFields,
    append: appendTestcase,
    remove: removeTestcase,
  } = useFieldArray({
    control,
    name: "testcases",
  });

  const examples = watch("examples");
  const codeSnippets = watch("codeSnippets");
  const referenceSolutions = watch("referenceSolutions");

  const handleCodeSnippetChange = (lang, value) => {
    setValue(`codeSnippets.${lang}`, value, { shouldValidate: true });
  };
  const handleReferenceSolutionChange = (lang, value) => {
    setValue(`referenceSolutions.${lang}`, value, { shouldValidate: true });
  };

  const addTag = () => appendTag("");
  const addExample = () => appendExample({ input: "", output: "", explanation: "" });
  const addTestcase = () => appendTestcase({ input: "", output: "" });

  const onSubmit = async (value) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/problems/create-problem", value);
      console.log(res.data);
      toast.success(res.data.message || "Problem Created successfully⚡");
      navigation("/");
    } catch (error) {
      console.log(error);
      toast.error("Error creating problem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70">
      <div className="min-h-screen flex items-start justify-center py-10">
        <div className="bg-[#0b0f19] text-white rounded-lg shadow-2xl w-full max-w-4xl border border-[#9333ea]">
          <div className="flex justify-between items-center p-5 border-b border-[#9333ea]">
            <h2 className="text-2xl font-bold">Create Problem</h2>
            <button
              onClick={() => navigation("/")}
              className="text-white bg-red-500 hover:bg-red-600 rounded px-3 py-1 font-semibold"
              aria-label="Cancel form"
            >
              <X className="inline-block mr-1" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Title & Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-semibold">Title</label>
                <input
                  type="text"
                  className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-semibold">Difficulty</label>
                <select
                  className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white"
                  {...register("difficuilty")}
                >
                  <option value="EASY">EASY</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HARD">HARD</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-semibold">Description</label>
              <textarea
                className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white min-h-[100px]"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block mb-1 font-semibold">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tagFields.map((tag, index) => (
                  <div key={tag.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white"
                      {...register(`tags.${index}`)}
                    />
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Remove tag ${index + 1}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTag}
                  className="btn bg-[#9333ea] hover:bg-purple-700 text-white flex items-center gap-1 px-3 py-1 rounded"
                >
                  <Plus size={16} /> Add Tag
                </button>
              </div>
              {errors.tags && (
                <p className="text-red-500 text-sm">{errors.tags.message}</p>
              )}
            </div>

            {/* Constraints */}
            <div>
              <label className="block mb-1 font-semibold">Constraints</label>
              <textarea
                className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white min-h-[60px]"
                {...register("constraints")}
              />
              {errors.constraints && (
                <p className="text-red-500 text-sm">{errors.constraints.message}</p>
              )}
            </div>

            {/* Hints */}
            <div>
              <label className="block mb-1 font-semibold">Hints (optional)</label>
              <textarea
                className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white min-h-[60px]"
                {...register("hints")}
              />
            </div>

            {/* Editorial */}
            <div>
              <label className="block mb-1 font-semibold">Editorial (optional)</label>
              <textarea
                className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white min-h-[60px]"
                {...register("editorial")}
              />
            </div>

            {/* Testcases */}
            <div>
              <label className="block mb-2 font-semibold">Testcases</label>
              {testCaseFields.map((tc, i) => (
                <div
                  key={tc.id}
                  className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
                >
                  <div>
                    <input
                      placeholder="Input"
                      className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white"
                      {...register(`testcases.${i}.input`)}
                    />
                    {errors.testcases?.[i]?.input && (
                      <p className="text-red-500 text-xs">
                        {errors.testcases[i].input.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      placeholder="Expected Output"
                      className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white"
                      {...register(`testcases.${i}.output`)}
                    />
                    {errors.testcases?.[i]?.output && (
                      <p className="text-red-500 text-xs">
                        {errors.testcases[i].output.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeTestcase(i)}
                    className="text-red-500 hover:text-red-700 col-span-full self-center"
                    aria-label={`Remove testcase ${i + 1}`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTestcase}
                className="btn bg-[#9333ea] hover:bg-purple-700 text-white flex items-center gap-1 px-3 py-1 rounded"
              >
                <Plus size={16} /> Add Testcase
              </button>
              {errors.testcases && typeof errors.testcases.message === "string" && (
                <p className="text-red-500 text-sm">{errors.testcases.message}</p>
              )}
            </div>

            {/* Examples (Dynamic not language-fixed) */}
            <div>
              <label className="block mb-2 font-semibold">Examples</label>
              {exampleFields.map((field, index) => (
                <div
                  key={field.id}
                  className="mb-6 border p-4 rounded border-[#9333ea] relative"
                >
                  <div className="mb-2">
                    <label className="block mb-1">Input</label>
                    <textarea
                      className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white min-h-[60px]"
                      {...register(`examples.${index}.input`)}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Output</label>
                    <textarea
                      className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white min-h-[60px]"
                      {...register(`examples.${index}.output`)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Explanation (optional)</label>
                    <textarea
                      className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white min-h-[40px]"
                      {...register(`examples.${index}.explanation`)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExample(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addExample}
                className="btn bg-[#9333ea] hover:bg-purple-700 text-white flex items-center gap-1 px-3 py-1 rounded"
              >
                <Plus size={16} /> Add Example
              </button>
              {errors.examples && (
                <p className="text-red-500 text-sm">{errors.examples.message}</p>
              )}
            </div>

            {/* Code Snippets */}
            <div>
              <label className="block mb-2 font-semibold">Code Snippets</label>
              {["JAVASCRIPT", "PYTHON", "JAVA"].map((lang) => (
                <div key={lang} className="mb-6 border p-4 rounded border-[#9333ea]">
                  <h3 className="font-semibold mb-2">{lang}</h3>
                  <textarea
                    className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white min-h-[80px] font-mono"
                    value={codeSnippets[lang] || ""}
                    onChange={(e) => handleCodeSnippetChange(lang, e.target.value)}
                  />
                  {errors.codeSnippets?.[lang] && (
                    <p className="text-red-500 text-xs">{errors.codeSnippets[lang].message}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Reference Solutions */}
            <div>
              <label className="block mb-2 font-semibold">Reference Solutions</label>
              {["JAVASCRIPT", "PYTHON", "JAVA"].map((lang) => (
                <div key={lang} className="mb-6 border p-4 rounded border-[#9333ea]">
                  <h3 className="font-semibold mb-2">{lang}</h3>
                  <textarea
                    className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white min-h-[80px] font-mono"
                    value={referenceSolutions[lang] || ""}
                    onChange={(e) => handleReferenceSolutionChange(lang, e.target.value)}
                  />
                  {errors.referenceSolutions?.[lang] && (
                    <p className="text-red-500 text-xs">
                      {errors.referenceSolutions[lang].message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="card-actions justify-end pt-4 border-t">
              <button
                type="submit"
                className="btn btn-primary btn-lg gap-2 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner text-white"></span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Create Problem
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProblemForm;
