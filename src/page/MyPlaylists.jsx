import React, { useEffect, useState } from "react";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Loader, Trash2, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
const MyPlaylists = () => {
  const {
    playlists,
    getAllPlaylists,
    removeProblemFromPlaylist,
    deletePlaylist,
    isLoading,
  } = usePlaylistStore();
    const { user } = useAuthStore();  
  const [openPlaylistId, setOpenPlaylistId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getAllPlaylists();
  }, [getAllPlaylists]);

  const toggleDropdown = (id) => {
    setOpenPlaylistId(openPlaylistId === id ? null : id);
  };

  const handleSearch = (problems) =>
    problems.filter(({ problem }) =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

      const myPlaylists = playlists.filter(
    (playlist) => playlist.user?.id === user?.id
  );
  const filteredPlaylists = myPlaylists.filter((playlist) =>
    searchTerm.trim() === ""
      ? true
      : playlist.problems.some(({ problem }) =>
          problem.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-[#0f172a] to-[#1e293b] text-white px-6 py-20 flex flex-col items-center overflow-hidden">
      {/* Glowing Backgrounds */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600 opacity-20 blur-3xl rounded-full animate-pulse z-0" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-500 opacity-20 blur-3xl rounded-full animate-pulse z-0" />

      {/* Home Icon */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-20 text-white hover:text-purple-400 transition"
      >
        <Home className="w-6 h-6" />
      </button>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-center z-10"
      >
        Your <span className="text-purple-400">Playlists</span>
      </motion.h1>

      {/* Search Bar */}
      <div className="mt-6 z-10 w-full max-w-xl">
        <input
          type="text"
          placeholder="Search problems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
        />
      </div>

      {/* Playlists */}
      {isLoading ? (
        <div className="flex items-center justify-center mt-10">
          <Loader className="w-6 h-6 animate-spin text-white" />
        </div>
      ) : filteredPlaylists.length === 0 ? (
        <p className="mt-10 text-center text-gray-400">No matching playlists found.</p>
      ) : (
        <div className="mt-10 w-full max-w-5xl z-10 space-y-6">
          {filteredPlaylists.map((playlist) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 border border-gray-700 rounded-lg"
            >
              <div
                onClick={() => toggleDropdown(playlist.id)}
                className="cursor-pointer px-6 py-5 flex justify-between items-center hover:bg-gray-800 transition duration-300"
              >
                <div>
                  <h2 className="text-xl font-semibold">{playlist.name}</h2>
                  <p className="text-sm text-gray-400">{playlist.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylist(playlist.id);
                    }}
                    className="text-red-400 hover:text-red-300"
                    title="Delete Playlist"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {openPlaylistId === playlist.id ? (
                    <ChevronUp className="w-5 h-5 text-white" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {openPlaylistId === playlist.id && (
                  <motion.div
                    key="dropdown"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    {handleSearch(playlist.problems).length === 0 ? (
                      <p className="text-gray-500 text-sm italic">
                        No matching problems.
                      </p>
                    ) : (
                      <ul className="space-y-2 mt-4">
                        {handleSearch(playlist.problems).map(({ problem }) => (
                          <li
                            key={problem.id}
                            className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded-md w-full"
                          >
                            <Link
                              to={`/problem/${problem.id}`}
                              className="text-purple-300 hover:text-purple-200 transition w-full"
                            >
                              {problem.title}
                            </Link>
                            <button
                              onClick={() =>
                                removeProblemFromPlaylist(playlist.id, [problem.id])
                              }
                              className="text-red-400 hover:text-red-300 ml-4"
                              title="Remove from Playlist"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
  );
};

export default MyPlaylists;
