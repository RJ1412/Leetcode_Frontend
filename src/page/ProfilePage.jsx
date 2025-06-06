import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import {
  PieChart,
  Pie,
  Cell as PieCell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Home, Edit, X, Save } from "lucide-react";

const CHART_PALETTE = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#f43f5e"];
const HEATMAP_COLORS = ["#1e293b", "#334155", "#475569", "#64748b", "#c084fc"];
const HEATMAP_THRESHOLDS = [1, 3, 5, 8];
const heatmapStartDate = new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate());

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState({ name: "" });
  const [editing, setEditing] = useState(false);
  const [solvedQuestions, setSolvedQuestions] = useState([]);
  const [difficultyData, setDifficultyData] = useState([]);
  const [topicData, setTopicData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, diffRes, topicRes] = await Promise.all([
          axiosInstance.get("/users/my-profile"),
          axiosInstance.get("/users/solved-problems-stats"),
          axiosInstance.get("/users/solved-problems-topics"),
        ]);
        setProfile(profileRes.data.user || {});
        setSolvedQuestions(profileRes.data.solvedProblems || []);
        setDifficultyData(diffRes.data.pieChartData || []);
        setTopicData(topicRes.data.topicChartData || []);
        const heatmapRes = await axiosInstance.get("/users/solved-heatmap");
        setHeatmapData(heatmapRes.data.heatmapData || []);
      } catch (error) {
        console.error("Error fetching profile or stats data:", error);
      }
    };
    fetchData();
  }, []);

  const handleEditToggle = () => {
    if (!editing && profile) setEditedProfile({ name: profile.name || "" });
    setEditing((prev) => !prev);
  };

  const handleInputChange = (e) => {
    setEditedProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileUpdate = async () => {
    try {
      const { data } = await axiosInstance.put("/users/update-profile", editedProfile);
      setProfile(data.user || {});
      setEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const styleForValue = (value) => {
    if (!value || value.count === 0) return { fill: HEATMAP_COLORS[0] };
    const idx = HEATMAP_THRESHOLDS.reduce((acc, t, i) => (value.count >= t ? i + 1 : acc), 0);
    return { fill: HEATMAP_COLORS[idx] };
  };

  const totalSubs = heatmapData.reduce((sum, d) => sum + d.count, 0);
  const activeDays = heatmapData.filter((d) => d.count > 0).length;
  const activeSet = new Set(heatmapData.filter((d) => d.count > 0).map((d) => d.date));
  let maxStreak = 0,
    curStreak = 0;
  for (let d = new Date(heatmapStartDate); d <= new Date(); d.setDate(d.getDate() + 1)) {
    const iso = d.toISOString().split("T")[0];
    if (activeSet.has(iso)) {
      curStreak++;
      maxStreak = Math.max(maxStreak, curStreak);
    } else curStreak = 0;
  }

  // Replace your return statement with the one below
return (
  <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white px-4 sm:px-8 py-16">
    {/* Glowing Backgrounds */}
    <div className="absolute top-0 left-0 w-80 h-80 bg-purple-700 opacity-20 blur-3xl rounded-full animate-pulse" />
    <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500 opacity-20 blur-3xl rounded-full animate-pulse" />

    <motion.div
      className="relative max-w-7xl mx-auto space-y-14 z-10"
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 text-indigo-300 text-lg">
        <Link to={"/"}>
          <Home className="w-6 h-6" />
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span>Profile</span>
      </div>

      {/* Profile Card */}
      <motion.div
        className="bg-[#111827] rounded-xl shadow-xl p-8 text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold mb-6">{profile?.name}</h1>
        {!editing ? (
          <>
            <p className="mb-2"><span className="font-semibold text-purple-400">Name:</span> {profile?.name}</p>
            <p className="mb-6"><span className="font-semibold text-purple-400">Email:</span> {profile?.email}</p>
            <button
              onClick={handleEditToggle}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded-md font-semibold flex items-center gap-2 transition"
            >
              <Edit className="w-5 h-5" />
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-purple-300">Name</label>
              <input
                type="text"
                name="name"
                value={editedProfile.name}
                onChange={handleInputChange}
                className="w-full rounded-md px-4 py-2 bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleProfileUpdate}
                className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-500 rounded-md font-semibold transition"
              >
                <Save className="w-5 h-5" />
                Save
              </button>
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-500 rounded-md font-semibold transition"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </>
        )}
      </motion.div>

      {/* Heatmap */}
      <motion.div
        className="bg-[#111827] rounded-xl shadow-xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between flex-wrap gap-4 items-center mb-6">
          <h2 className="text-2xl font-bold">{totalSubs} submissions this year</h2>
          <div className="text-base flex gap-8 text-gray-400">
            <span>Active Days: {activeDays}</span>
            <span>Max Streak: {maxStreak}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <CalendarHeatmap
            startDate={heatmapStartDate}
            endDate={new Date()}
            values={heatmapData}
            styleForValue={styleForValue}
            boxSize={25}
            gutterSize={6}
            showMonthLabels={true}
            showWeekdayLabels={false}
          />
        </div>
        <div className="mt-4 flex gap-2 items-center text-sm text-gray-400">
          <span>Less</span>
          {HEATMAP_COLORS.map((color, i) => (
            <span key={i} className="w-5 h-5 rounded border" style={{ backgroundColor: color }} />
          ))}
          <span>More</span>
        </div>
      </motion.div>

      {/* Pie Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        {[{ title: "By Difficulty", data: difficultyData }, { title: "By Topic", data: topicData }].map(
          ({ title, data }, i) => (
            <motion.div
              key={i}
              className="bg-[#111827] rounded-xl shadow-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <h2 className="text-2xl font-bold mb-6">{title}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {data.map((entry, index) => (
                      <PieCell
                        key={`cell-${index}`}
                        fill={CHART_PALETTE[index % CHART_PALETTE.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          )
        )}
      </div>

      {/* Solved Questions */}
      <motion.div
        className="bg-[#111827] rounded-xl shadow-xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-6">Solved Questions</h2>
        <ul className="list-disc list-inside space-y-2 max-h-64 overflow-y-auto text-purple-300 text-base">
          {solvedQuestions.map((q) => (
            <li key={q.id}>
              <a href={`/problem/${q.id}`} className="hover:underline">
                {q.title}
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  </div>
);

};

export default ProfilePage;
