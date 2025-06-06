import React, { useState, useMemo, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  Bookmark,
  PencilIcon,
  TrashIcon,
  Plus,
  ChevronDown,
} from "lucide-react";
import { useActions } from "../store/useAction";
import AddToPlaylistModal from "./AddToPlaylist";
import CreatePlaylistModal from "./CreatePlaylistModal";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { useProblemStore } from "../store/useProblemStore";
import EditProblemModal from "./EditProblemModal";

const ProblemsTable = ({ problems }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const { authUser } = useAuthStore();
  const { onDeleteProblem } = useActions();
  const { playlists, createPlaylist, getAllPlaylists } = usePlaylistStore();
  const { getSolvedProblemByUser, solvedProblems } = useProblemStore();

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [isLoadingSolved, setIsLoadingSolved] = useState(true);

  useEffect(() => {
    if (playlists.length === 0) {
      getAllPlaylists();
    }
  }, [getAllPlaylists, playlists.length]);

  useEffect(() => {
    const fetchSolved = async () => {
      if (authUser) {
        setIsLoadingSolved(true);
        await getSolvedProblemByUser();
        setIsLoadingSolved(false);
      }
    };
    fetchSolved();
  }, [authUser, getSolvedProblemByUser]);

  const solvedProblemIds = useMemo(() => {
    if (!Array.isArray(solvedProblems)) return new Set();
    return new Set(solvedProblems.map((p) => p.id));
  }, [solvedProblems]);

  const allTags = useMemo(() => {
    const tagsSet = new Set();
    problems?.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [problems]);

  const difficulties = ["EASY", "MEDIUM", "HARD"];
  const baseProblems = useMemo(() => {
    return Array.isArray(activePlaylist?.problems)
      ? activePlaylist.problems.map((p) => p.problem)
      : problems;
  }, [activePlaylist, problems]);

  const filteredProblems = useMemo(() => {
    return (baseProblems || [])
      .filter((p) => p.title?.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => (difficulty === "ALL" ? true : p.difficuilty === difficulty))
      .filter((p) => (selectedTag === "ALL" ? true : p.tags?.includes(selectedTag)));
  }, [baseProblems, search, difficulty, selectedTag]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);

  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredProblems, currentPage]);

  const handleDelete = (id) => onDeleteProblem(id);
  const handleCreatePlaylist = async (data) => await createPlaylist(data);
  const handleAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in-up">
      <div className="bg-[#1e293b]/60 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-white/10 text-white">

        {/* Header and Playlist Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold tracking-tight">🔥 Problems</h2>
          <div className="flex items-center gap-2">
            <div className="dropdown dropdown-hover">
              <label tabIndex={0} className="btn btn-sm bg-[#0f172a] text-white border border-white/20 hover:bg-[#1e293b]">
                <ChevronDown className="w-4 h-4 mr-1" />
                Playlists
              </label>

              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-[#0f172a] border border-white/10 rounded-box w-52 text-sm">
                {playlists.length === 0 ? (
                  <li><span>No playlists</span></li>
                ) : (
                  playlists.map((playlist) => (
                    <li key={playlist.id}>
                      <button
                        onClick={() => {
                          setActivePlaylist(playlist);
                          setCurrentPage(1);
                        }}
                        className="hover:text-purple-400"
                      >
                        {playlist.name}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-sm bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg shadow">
              
              <Plus className="w-4 h-4 mr-1" />
              Create Playlist
            </button>

          </div>
        </div>

        {/* Active Playlist Info */}
        {activePlaylist && (
          <div className="mb-4 bg-[#0f172a]/50 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">📁 Viewing Playlist: {activePlaylist.name}</p>
                <p className="text-xs text-gray-400">
                  Created by: {activePlaylist.user?.name || "Unknown"}
                </p>
              </div>
              <button className="btn btn-sm btn-outline" onClick={() => setActivePlaylist(null)}>
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by title"
            className="input input-bordered w-full md:w-1/3 bg-[#1e293b] text-white border-white/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="select select-bordered bg-[#1e293b] text-white border-white/10"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="ALL">All Difficulties</option>
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
          <select
            className="select select-bordered bg-[#1e293b] text-white border-white/10"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="ALL">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* Problems Table */}
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="table table-lg bg-[#0f172a]/50 text-white border border-white/10">
            <thead className="bg-[#1e293b] text-white">
              <tr>
                <th>Solved</th>
                <th>Title</th>
                <th>Tags</th>
                <th>Difficulty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProblems.length > 0 ? (
                paginatedProblems.map((problem) => {
                  const isSolved = solvedProblemIds.has(problem.id);

                  return (
                    <tr
                      key={problem.id}
                      className={`transition duration-150 ease-in-out hover:bg-[#172334]/80 ${isSolved ? "bg-gradient-to-r from-green-900/30 to-green-800/20" : "bg-[#0f172a]/50"
                        }`}
                    >
                      <td>
                        {isLoadingSolved ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          <input
                            type="checkbox"
                            checked={isSolved}
                            readOnly
                            className="checkbox checkbox-sm border-green-400 bg-transparent checked:bg-green-500 checked:border-green-500"
                          />
                        )}
                      </td>
                      <td>
                        <Link
                          to={`/problem/${problem.id}`}
                          className="font-semibold hover:text-purple-400 transition"
                        >
                          {problem.title}
                        </Link>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {problem.tags?.map((tag, idx) => (
                            <span
                              key={idx}
                              className="badge badge-outline badge-warning text-xs font-bold"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge font-bold text-xs ${problem.difficuilty === "EASY"
                            ? "bg-green-600"
                            : problem.difficuilty === "MEDIUM"
                              ? "bg-yellow-400 text-black"
                              : "bg-red-600"
                            }`}
                        >
                          {problem.difficuilty}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          {authUser?.role === "ADMIN" && (
                            <>
                              <button
                                onClick={() => handleDelete(problem.id)}
                                className="btn btn-sm btn-error"
                              >
                                <TrashIcon className="w-4 h-4 text-white" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingProblem(problem);
                                  setIsEditModalOpen(true);
                                }}
                                className="btn btn-sm btn-warning"
                              >
                                <PencilIcon className="w-4 h-4 text-white" />
                              </button>
                            </>
                          )}
                          <button
                            className="btn btn-sm btn-outline hover:text-purple-400"
                            onClick={() => handleAddToPlaylist(problem.id)}
                          >
                            <Bookmark className="w-4 h-4" />
                            <span className="hidden sm:inline">Save</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-white/60">
                    No problems found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
          <button
            className="btn btn-sm btn-outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span className="text-white">{currentPage} / {totalPages}</span>
          <button
            className="btn btn-sm btn-outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

            <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />
      <EditProblemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        problem={editingProblem}
      />
    </div>
  );
};

export default ProblemsTable;
