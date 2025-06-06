import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useProfileStore = create((set) => ({
  profile: null,
  solvedProblems: [],
  loading: false,

  fetchProfile: async () => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get("/users/my-profile");

      const { user, solvedProblems } = res.data;
      set({ profile: user, solvedProblems });
    } catch (error) {
      toast.error("Failed to fetch profile");
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (profileData) => {
    try {
      const res = await axiosInstance.put("/users/update-profile", profileData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated");
      set({ profile: res.data.user });
    } catch (err) {
      toast.error("Failed to update profile");
    }
  },
}));
