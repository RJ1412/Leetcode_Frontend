import React, { useEffect, useMemo, useState } from "react";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Loader, Trash2, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const MyPlaylists = () => {
  const {
    playlists = [],
    getAllPlaylists,
    removeProblemFromPlaylist,
    deletePlaylist,
    isLoading,
  } = usePlaylistStore();

  // if you still want to use user for anything, read it (we assume logged in)
  const user = useAuthStore((s) => s.user);

  const [openPlaylistId, setOpenPlaylistId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getAllPlaylists();
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDropdown = (id) => setOpenPlaylistId((prev) => (prev === id ? null : id));

  // defensive search: playlist.problems might be undefined
  const searchInProblems = (problems = []) =>
    (problems || []).filter(({ problem } = {}) =>
      String(problem?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

  // filtered playlists based on search term (server returns only user's playlists)
  const filteredPlaylists = useMemo(() => {
    if (!Array.isArray(playlists)) return [];
    if (!searchTerm.trim()) return playlists;
    const q = searchTerm.toLowerCase();
    return playlists.filter((pl) =>
      (pl.problems || []).some(({ problem } = {}) =>
        String(problem?.title || "").toLowerCase().includes(q)
      )
    );
  }, [playlists, searchTerm]);

  const handleDeletePlaylist = async (e, playlistId) => {
    e.stopPropagation();
    try {
      await deletePlaylist(playlistId);
      if (openPlaylistId === playlistId) setOpenPlaylistId(null);
    } catch (err) {
      // store already toasts; optionally handle here
      console.error("delete failed", err);
    }
  };

  const handleRemoveProblem = async (e, playlistId, problemId) => {
    e.stopPropagation();
    try {
      await removeProblemFromPlaylist(playlistId, [problemId]);
      // optionally close open list or refresh UI; store refreshes current playlist/list
    } catch (err) {
      console.error("remove failed", err);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-[#FFF7FB] via-[#FFFDF6] to-[#F7FBFF] text-slate-800">
      {/* Top container */}
      <div className="max-w-6xl mx-auto px-6 pt-16">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-md bg-white/60 backdrop-blur-sm shadow-sm hover:scale-105 transition"
            title="Home"
          >
            <Home className="w-5 h-5 text-purple-600" />
          </button>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-500">
              Playlists
            </span>
          </h1>
        </div>

        <div className="w-full max-w-2xl">
          <input
            type="search"
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="mt-12 flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin text-pink-400" />
          </div>
        ) : filteredPlaylists.length === 0 ? (
          <div className="mt-16 text-center text-slate-500">
            <p className="text-lg">No matching playlists found.</p>
            <p className="mt-2 text-sm">Create a playlist from any problem to see it here.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6">
            {filteredPlaylists.map((pl) => (
              <motion.div
                key={pl.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className="rounded-2xl bg-gradient-to-r from-white via-[#fffaf0] to-[#fbfcff] border border-slate-100 shadow-md overflow-hidden"
              >
                <div
                  onClick={() => toggleDropdown(pl.id)}
                  className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-50 transition"
                >
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-slate-800">{pl.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{pl.description || "No description"}</p>
                    <div className="mt-2 text-xs text-slate-400">
                      {Array.isArray(pl.problems) ? `${pl.problems.length} problem(s)` : "0 problems"}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleDeletePlaylist(e, pl.id)}
                      className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 transition"
                      title="Delete playlist"
                    >
                      <Trash2 className="w-4 h-4 text-pink-600" />
                    </button>

                    {openPlaylistId === pl.id ? (
                      <ChevronUp className="w-6 h-6 text-slate-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-slate-600" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {openPlaylistId === pl.id && (
                    <motion.div
                      key={`dropdown-${pl.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="px-6 pb-4 bg-white/40"
                    >
                      {/* problems list */}
                      {(!pl.problems || pl.problems.length === 0) ? (
                        <div className="p-4 text-sm text-slate-500 italic">No problems in this playlist.</div>
                      ) : (
                        <ul className="space-y-3 mt-3">
                          { (pl.problems || []).map(({ problem } = {}) => (
                            <li
                              key={problem?.id ?? Math.random()}
                              className="flex items-center justify-between gap-4 bg-[#FFF8FB] border border-slate-100 rounded-lg px-4 py-3"
                            >
                              <Link
                                to={`/problem/${problem?.id}`}
                                className="block text-slate-800 font-medium hover:text-pink-600"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {problem?.title || "Untitled Problem"}
                              </Link>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400">{problem?.difficulty ?? ""}</span>
                                <button
                                  onClick={(e) => handleRemoveProblem(e, pl.id, problem?.id)}
                                  className="p-2 rounded-md bg-rose-50 hover:bg-rose-100 transition"
                                  title="Remove from playlist"
                                >
                                  <Trash2 className="w-4 h-4 text-rose-600" />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPlaylists;
