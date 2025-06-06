import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });
      const res = await axiosInstance.post("/problems/get-all-problem");

      set({ problems: res.data.problems });
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.post(`/problems/get-problem/${id}`);

      set({ problem: res.data.problem });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  updateProblem: async (id, updatedData) => {
    try {
      const res = await axiosInstance.post(`/problems/update-problem/${id}`, updatedData); // assuming RESTful PATCH
      toast.success(res.data.message);

      set((state) => ({
        problems: state.problems.map((p) => (p.id === id ? res.data.problem : p)),
        problem: res.data.problem,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error updating problem", error);
      toast.error(error.response?.data?.error || "Error updating problem");
      return { success: false };
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problem");

      set({ solvedProblems: res.data.problems });
    } catch (error) {
      console.log("Error getting solved problems", error);
      toast.error("Error getting solved problems");
    }
  }


}));