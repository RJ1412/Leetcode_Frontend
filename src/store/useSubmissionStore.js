import toast from 'react-hot-toast';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useSubmissionStore = create((set) => ({
  isLoading: false,
  submissions: [],
  submissionCount: 0,
  successRate: 0,

  getAllSubmissions: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/submission/get-all-submissions");
      set({ submissions: res.data.submissions });
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error getting all submissions", error);
      toast.error("Error getting all submissions");
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionForProblem: async (problemId) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/submission/get-submission/${problemId}`);
      set({ submissions: res.data.submissions });
    } catch (error) {
      console.error("Error getting submissions for problem", error);
      toast.error("Error getting submissions for problem");
    } finally {
      set({ isLoading: false });
    }
  },

  getSuccessRateForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(`/submission/get-submission/${problemId}`);
      const submissions = res.data.submissions;
      const total = submissions.length;
      const accepted = submissions.filter((s) => s.status === "Accepted").length;
      const rate = total ? Math.round((accepted / total) * 100) : 0;
      set({ successRate: rate });
    } catch (error) {
      console.error("Error getting success rate", error);
    }
  },

  getSubmissionCountForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(`/submission/get-submissions-count/${problemId}`);
      set({ submissionCount: res.data.count });
    } catch (error) {
      console.error("Error getting submission count", error);
      toast.error("Error getting submission count for problem");
    }
  },
}));
