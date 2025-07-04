// import React, { useState } from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import {
//   Plus,
//   Trash2,
//   CheckCircle2,
//   X
// } from "lucide-react";
// import { axiosInstance } from "../lib/axios";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const problemSchema = z.object({
//   title: z.string().min(3, "Title must be at least 3 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   difficuilty: z.enum(["EASY", "MEDIUM", "HARD"]),
//   tags: z.array(z.string()).min(1, "At least one tag is required"),
//   constraints: z.string().min(1, "Constraints are required"),
//   hints: z.string().optional(),
//   editorial: z.string().optional(),
//   testcases: z
//     .array(
//       z.object({
//         input: z.string().min(1, "Input is required"),
//         output: z.string().min(1, "Output is required"),
//       })
//     )
//     .min(1, "At least one test case is required"),
//   examples: z
//     .array(
//       z.object({
//         input: z.string().min(1, "Input is required"),
//         output: z.string().min(1, "Output is required"),
//         explanation: z.string().optional(),
//       })
//     )
//     .min(1, "At least one example is required"),
//   codeSnippets: z.object({
//     JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
//     PYTHON: z.string().min(1, "Python code snippet is required"),
//     JAVA: z.string().min(1, "Java solution is required"),
//   }),
//   referenceSolutions: z.object({
//     JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
//     PYTHON: z.string().min(1, "Python solution is required"),
//     JAVA: z.string().min(1, "Java solution is required"),
//   }),
// });

// const defaultValues = {
//   title: "",
//   description: "",
//   difficuilty: "EASY",
//   tags: [""],
//   constraints: "",
//   hints: "",
//   editorial: "",
//   testcases: [{ input: "", output: "" }],
//   examples: [{ input: "", output: "", explanation: "" }],
//   codeSnippets: {
//     JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
//     PYTHON: "def solution():\n    # Write your code here\n    pass",
//     JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
//   },
//   referenceSolutions: {
//     JAVASCRIPT: "// Add your reference solution here",
//     PYTHON: "# Add your reference solution here",
//     JAVA: "// Add your reference solution here",
//   },
// };


// const CreateProblemForm = ({ onClose }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const navigation = useNavigate();

//   const {
//     register,
//     control,
//     handleSubmit,
//     reset,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(problemSchema),
//     defaultValues,
//   });

//   const {
//     fields: exampleFields,
//     append: appendExample,
//     remove: removeExample,
//   } = useFieldArray({ control, name: "examples" });

//   const {
//     fields: tagFields,
//     append: appendTag,
//     remove: removeTag,
//   } = useFieldArray({
//     control,
//     name: "tags",
//   });

//   const {
//     fields: testCaseFields,
//     append: appendTestcase,
//     remove: removeTestcase,
//   } = useFieldArray({
//     control,
//     name: "testcases",
//   });

//   const examples = watch("examples");
//   const codeSnippets = watch("codeSnippets");
//   const referenceSolutions = watch("referenceSolutions");

//   const handleCodeSnippetChange = (lang, value) => {
//     setValue(`codeSnippets.${lang}`, value, { shouldValidate: true });
//   };
//   const handleReferenceSolutionChange = (lang, value) => {
//     setValue(`referenceSolutions.${lang}`, value, { shouldValidate: true });
//   };

//   const addTag = () => appendTag("");
//   const addExample = () => appendExample({ input: "", output: "", explanation: "" });
//   const addTestcase = () => appendTestcase({ input: "", output: "" });

//   const onSubmit = async (value) => {
//     try {
//       setIsLoading(true);
//       const res = await axiosInstance.post("/problems/create-problem", value);
//       console.log(res.data);
//       toast.success(res.data.message || "Problem Created successfully⚡");
//       navigation("/");
//     } catch (error) {
//       console.log(error);
//       toast.error("Error creating problem");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-tr from-[#fdfbff] to-[#e0f7fa] font-inter">
//       <div className="min-h-screen flex items-start justify-center py-10">
//         <div className="bg-white/90 backdrop-blur-md text-gray-800 rounded-xl shadow-xl w-full max-w-5xl border border-purple-300">
//           <div className="flex justify-between items-center px-6 py-4 border-b border-purple-300 bg-gradient-to-r from-purple-100 to-purple-200">
//             <h2 className="text-2xl font-bold text-purple-800">Create Problem</h2>
//             <button onClick={() => navigation("/")} className="text-white bg-red-500 hover:bg-red-600 rounded px-3 py-1 font-semibold">
//               <X className="inline-block mr-1" /> Cancel
//             </button>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
//             {/* Title & Difficulty */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block mb-1 font-semibold">Title</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white"
//                   {...register("title")}
//                 />
//                 {errors.title && (
//                   <p className="text-red-500 text-sm">{errors.title.message}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block mb-1 font-semibold">Difficulty</label>
//                 <select
//                   className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white"
//                   {...register("difficuilty")}
//                 >
//                   <option value="EASY">EASY</option>
//                   <option value="MEDIUM">MEDIUM</option>
//                   <option value="HARD">HARD</option>
//                 </select>
//               </div>
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block mb-1 font-semibold">Description</label>
//               <textarea
//                 className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white min-h-[100px]"
//                 {...register("description")}
//               />
//               {errors.description && (
//                 <p className="text-red-500 text-sm">{errors.description.message}</p>
//               )}
//             </div>

//             {/* Tags */}
//             <div>
//               <label className="block mb-1 font-semibold">Tags</label>
//               <div className="flex flex-wrap gap-2">
//                 {tagFields.map((tag, index) => (
//                   <div key={tag.id} className="flex items-center gap-2">
//                     <input
//                       type="text"
//                       className="p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white"
//                       {...register(`tags.${index}`)}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeTag(index)}
//                       className="text-red-500 hover:text-red-700"
//                       aria-label={`Remove tag ${index + 1}`}
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={addTag}
//                   className="btn bg-[#9333ea] hover:bg-purple-700 text-white flex items-center gap-1 px-3 py-1 rounded"
//                 >
//                   <Plus size={16} /> Add Tag
//                 </button>
//               </div>
//               {errors.tags && (
//                 <p className="text-red-500 text-sm">{errors.tags.message}</p>
//               )}
//             </div>

//             {/* Constraints */}
//             <div>
//               <label className="block mb-1 font-semibold">Constraints</label>
//               <textarea
//                 className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white min-h-[60px]"
//                 {...register("constraints")}
//               />
//               {errors.constraints && (
//                 <p className="text-red-500 text-sm">{errors.constraints.message}</p>
//               )}
//             </div>

//             {/* Hints */}
//             <div>
//               <label className="block mb-1 font-semibold">Hints (optional)</label>
//               <textarea
//                 className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white min-h-[60px]"
//                 {...register("hints")}
//               />
//             </div>

//             {/* Editorial */}
//             <div>
//               <label className="block mb-1 font-semibold">Editorial (optional)</label>
//               <textarea
//                 className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white min-h-[60px]"
//                 {...register("editorial")}
//               />
//             </div>

//             {/* Testcases */}
//             <div>
//               <label className="block mb-2 font-semibold">Testcases</label>
//               {testCaseFields.map((tc, i) => (
//                 <div
//                   key={tc.id}
//                   className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
//                 >
//                   <div>
//                     <input
//                       placeholder="Input"
//                       className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white"
//                       {...register(`testcases.${i}.input`)}
//                     />
//                     {errors.testcases?.[i]?.input && (
//                       <p className="text-red-500 text-xs">
//                         {errors.testcases[i].input.message}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <input
//                       placeholder="Expected Output"
//                       className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white"
//                       {...register(`testcases.${i}.output`)}
//                     />
//                     {errors.testcases?.[i]?.output && (
//                       <p className="text-red-500 text-xs">
//                         {errors.testcases[i].output.message}
//                       </p>
//                     )}
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => removeTestcase(i)}
//                     className="text-red-500 hover:text-red-700 col-span-full self-center"
//                     aria-label={`Remove testcase ${i + 1}`}
//                   >
//                     <Trash2 size={20} />
//                   </button>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={addTestcase}
//                 className="btn bg-[#9333ea] hover:bg-purple-700 text-white flex items-center gap-1 px-3 py-1 rounded"
//               >
//                 <Plus size={16} /> Add Testcase
//               </button>
//               {errors.testcases && typeof errors.testcases.message === "string" && (
//                 <p className="text-red-500 text-sm">{errors.testcases.message}</p>
//               )}
//             </div>

//             {/* Examples (Dynamic not language-fixed) */}
//             <div>
//               <label className="block mb-2 font-semibold">Examples</label>
//               {exampleFields.map((field, index) => (
//                 <div
//                   key={field.id}
//                   className="mb-6 border p-4 rounded border-[#9333ea] relative"
//                 >
//                   <div className="mb-2">
//                     <label className="block mb-1">Input</label>
//                     <textarea
//                       className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white min-h-[60px]"
//                       {...register(`examples.${index}.input`)}
//                     />
//                   </div>
//                   <div className="mb-2">
//                     <label className="block mb-1">Output</label>
//                     <textarea
//                       className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white min-h-[60px]"
//                       {...register(`examples.${index}.output`)}
//                     />
//                   </div>
//                   <div>
//                     <label className="block mb-1">Explanation (optional)</label>
//                     <textarea
//                       className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white min-h-[40px]"
//                       {...register(`examples.${index}.explanation`)}
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => removeExample(index)}
//                     className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={addExample}
//                 className="btn bg-[#9333ea] hover:bg-purple-700 text-white flex items-center gap-1 px-3 py-1 rounded"
//               >
//                 <Plus size={16} /> Add Example
//               </button>
//               {errors.examples && (
//                 <p className="text-red-500 text-sm">{errors.examples.message}</p>
//               )}
//             </div>

//             {/* Code Snippets */}
//             <div>
//               <label className="block mb-2 font-semibold">Code Snippets</label>
//               {["JAVASCRIPT", "PYTHON", "JAVA"].map((lang) => (
//                 <div key={lang} className="mb-6 border p-4 rounded border-[#9333ea]">
//                   <h3 className="font-semibold mb-2">{lang}</h3>
//                   <textarea
//                     className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white min-h-[80px] font-mono"
//                     value={codeSnippets[lang] || ""}
//                     onChange={(e) => handleCodeSnippetChange(lang, e.target.value)}
//                   />
//                   {errors.codeSnippets?.[lang] && (
//                     <p className="text-red-500 text-xs">{errors.codeSnippets[lang].message}</p>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Reference Solutions */}
//             <div>
//               <label className="block mb-2 font-semibold">Reference Solutions</label>
//               {["JAVASCRIPT", "PYTHON", "JAVA"].map((lang) => (
//                 <div key={lang} className="mb-6 border p-4 rounded border-[#9333ea]">
//                   <h3 className="font-semibold mb-2">{lang}</h3>
//                   <textarea
//                     className="w-full p-2 bg-[#0f172a] border border-[#9333ea] rounded text-white min-h-[80px] font-mono"
//                     value={referenceSolutions[lang] || ""}
//                     onChange={(e) => handleReferenceSolutionChange(lang, e.target.value)}
//                   />
//                   {errors.referenceSolutions?.[lang] && (
//                     <p className="text-red-500 text-xs">
//                       {errors.referenceSolutions[lang].message}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Submit */}
//             <div className="card-actions justify-end pt-4 border-t">
//               <button
//                 type="submit"
//                 className="btn btn-primary btn-lg gap-2 flex items-center justify-center"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <span className="loading loading-spinner text-white"></span>
//                 ) : (
//                   <>
//                     <CheckCircle2 className="w-5 h-5" />
//                     Create Problem
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateProblemForm;

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, CheckCircle2, X } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Schema validation using Zod
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
      z.object({ input: z.string().min(1, "Input is required"), output: z.string().min(1, "Output is required") })
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

// Default form values
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
    JAVASCRIPT: "function solution() {\n  // Write your code here\n}\n",
    PYTHON: "def solution():\n    # Write your code here\n    pass\n",
    JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}\n",
  },
  referenceSolutions: {
    JAVASCRIPT: "// Add your reference solution here\n",
    PYTHON: "# Add your reference solution here\n",
    JAVA: "// Add your reference solution here\n",
  },
};

const CreateProblemForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues,
  });

  // Dynamic field arrays
  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control, name: "tags" });
  const { fields: testCaseFields, append: appendTestcase, remove: removeTestcase } = useFieldArray({
    control,
    name: "testcases",
  });
  const { fields: exampleFields, append: appendExample, remove: removeExample } = useFieldArray({
    control,
    name: "examples",
  });

  const codeSnippets = watch("codeSnippets");
  const referenceSolutions = watch("referenceSolutions");

  // Handlers
  const handleCodeSnippetChange = (lang, value) => {
    setValue(`codeSnippets.${lang}`, value, { shouldValidate: true });
  };
  const handleReferenceSolutionChange = (lang, value) => {
    setValue(`referenceSolutions.${lang}`, value, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/problems/create-problem", data);
      toast.success(res.data.message || "Problem created successfully⚡");
      navigate("/");
    } catch {
      toast.error("Error creating problem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-tr from-[#fdfbff] to-[#e0f7ea] p-6 font-inter">
      <div className="min-h-screen flex items-start justify-center py-10">
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-5xl border border-purple-300">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-100 to-purple-200 border-b border-purple-300">
            <h2 className="text-2xl font-bold text-purple-800">Create Problem</h2>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-[calc(100vh-112px)] overflow-y-auto">
            {/* Title & Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-700">Title</label>
                <input
                  type="text"
                  {...register("title")}
                  className="mt-1 w-full p-2 border border-purple-300 rounded bg-purple-50 focus:ring-2 focus:ring-purple-400"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700">Difficulty</label>
                <select
                  {...register("difficuilty")}
                  className="mt-1 w-full p-2 border border-purple-300 rounded bg-purple-50 focus:ring-2 focus:ring-purple-400"
                >
                  <option value="EASY">EASY</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HARD">HARD</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-purple-700">Description</label>
              <textarea
                {...register("description")}
                className="mt-1 w-full p-2 border border-purple-300 rounded bg-purple-50 focus:ring-2 focus:ring-purple-400 min-h-[100px]"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-purple-700">Tags</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {tagFields.map((tag, idx) => (
                  <div key={tag.id} className="flex items-center gap-2">
                    <input
                      {...register(`tags.${idx}`)}
                      className="p-2 border border-purple-300 rounded bg-purple-50 focus:ring-2 focus:ring-purple-400"
                    />
                    <button type="button" onClick={() => removeTag(idx)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => appendTag("")} className="flex items-center gap-1 px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded">
                  <Plus className="w-4 h-4" /> Add Tag
                </button>
              </div>
              {errors.tags && <p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>}
            </div>

            {/* Constraints */}
            <div>
              <label className="block text-sm font-medium text-purple-700">Constraints</label>
              <textarea
                {...register("constraints")}
                className="mt-1 w-full p-2 border border-purple-300 rounded bg-purple-50 focus:ring-2 focus:ring-purple-400 min-h-[60px]"
              />
              {errors.constraints && <p className="text-red-500 text-xs mt-1">{errors.constraints.message}</p>}
            </div>

            {/* Hints & Editorial */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-700">Hints (optional)</label>
                <textarea
                  {...register("hints")}
                  className="mt-1 w-full p-2 border border-purple-300 rounded bg-purple-50 focus:ring-2 focus:ring-purple-400 min-h-[60px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700">Editorial (optional)</label>
                <textarea
                  {...register("editorial")}
                  className="mt-1 w-full p-2 border border-purple-300 rounded bg-purple-50 focus:ring-2 focus:ring-purple-400 min-h-[60px]"
                />
              </div>
            </div>

            {/* Testcases */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">Testcases</label>
              {testCaseFields.map((tc, i) => (
                <div key={tc.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-center">
                  <input
                    placeholder="Input"
                    {...register(`testcases.${i}.input`)}
                    className="p-2 border border-purple-300 rounded bg-purple-50 focus:ring-2 focus:ring-purple-400"
                  />
                  <input
                    placeholder="Expected Output"
                    {...register(`testcases.${i}.output`)}
                    className="p-2 border border-purple-300 rounded bg-purple-50 focus:ring-2 focus:ring-purple-400"
                  />
                  <button type="button" onClick={() => removeTestcase(i)} className="col-span-full text-red-500 hover:text-red-700 self-center">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => appendTestcase({ input: "", output: "" })} className="flex items-center gap-1 px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded">
                <Plus className="w-4 h-4" /> Add Testcase
              </button>
              {errors.testcases && <p className="text-red-500 text-xs mt-1">{errors.testcases.message}</p>}
            </div>

            {/* Examples */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">Examples</label>
              {exampleFields.map((ex, idx) => (
                <div key={ex.id} className="border border-purple-300 rounded p-4 mb-4 relative">
                  <textarea
                    placeholder="Input"
                    {...register(`examples.${idx}.input`)}
                    className="w-full p-2 mb-2 border border-purple-300 rounded bg-purple-50 focus:ring-2 focus:ring-purple-400 min-h-[60px]"
                  />
                  <textarea
                    placeholder="Output"
                    {...register(`examples.${idx}.output`)}
                    className="w-full p-2 mb-2 border border-purple-300 rounded bg-purple-50 focus:ring-2 focus:ring-purple-400 min-h-[60px]"
                  />
                  <textarea
                    placeholder="Explanation (optional)"
                    {...register(`examples.${idx}.explanation`)}
                    className="w-full p-2 border border-purple-300 rounded bg-purple-50 focus:ring-2 focus:ring-purple-400 min-h-[40px]"
                  />
                  <button type="button" onClick={() => removeExample(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => appendExample({ input: "", output: "", explanation: "" })} className="flex items-center gap-1 px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded">
                <Plus className="w-4 h-4" /> Add Example
              </button>
              {errors.examples && <p className="text-red-500 text-xs mt-1">{errors.examples.message}</p>}
            </div>

            {/* Code Snippets */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">Code Snippets</label>
              {Object.entries(codeSnippets).map(([lang, snippet]) => (
                <div key={lang} className="border border-purple-300 rounded p-4 mb-4">
                  <h3 className="text-sm font-semibold text-purple-700 mb-2">{lang}</h3>
                  <textarea
                    value={snippet}
                    onChange={(e) => handleCodeSnippetChange(lang, e.target.value)}
                    className="w-full p-2 border border-purple-300 rounded bg-purple-50 focus:ring-2 focus:ring-purple-400 font-mono min-h-[80px]"
                  />
                  {errors.codeSnippets?.[lang] && <p className="text-red-500 text-xs mt-1">{errors.codeSnippets[lang].message}</p>}
                </div>
              ))}
            </div>

            {/* Reference Solutions */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">Reference Solutions</label>
              {Object.entries(referenceSolutions).map(([lang, sol]) => (
                <div key={lang} className="border border-purple-300 rounded p-4 mb-4">
                  <h3 className="text-sm font-semibold text-purple-700 mb-2">{lang}</h3>
                  <textarea
                    value={sol}
                    onChange={(e) => handleReferenceSolutionChange(lang, e.target.value)}
                    className="w-full p-2 border border-purple-300 rounded bg-purple-50 focus:ring-2 focus:ring-purple-400 font-mono min-h-[80px]"
                  />
                  {errors.referenceSolutions?.[lang] && <p className="text-red-500 text-xs mt-1">{errors.referenceSolutions[lang].message}</p>}
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4 border-t border-purple-200">
              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:brightness-110 text-white px-6 py-2 rounded-lg shadow-md"
                disabled={isLoading}
              >
                {isLoading ? <span className="loading loading-spinner"></span> : <><CheckCircle2 className="w-5 h-5" /> Create Problem</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProblemForm;
