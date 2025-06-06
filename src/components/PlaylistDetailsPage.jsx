import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { ProblemTable } from "@/components/problem/ProblemTable";

const PlaylistDetailsPage = () => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  const { user } = useUser();

  const { data: playlistsData, isLoading } = useQuery({
    queryKey: ["playlists"],
    queryFn: async () => {
      const res = await axios.get("/api/playlist/get-playlist-details");
      return res.data.playLists;
    },
  });

  const activePlaylist = playlistsData?.find((p) => p.id === selectedPlaylistId);

  const baseProblems = activePlaylist
    ? activePlaylist.problems.map((p) => p.problem) // ✅ Unwrap the `problem` field
    : [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Your Playlists</h1>
      <div className="mb-6 space-x-2">
        {playlistsData?.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => setSelectedPlaylistId(playlist.id)}
            className={`px-4 py-2 rounded-md ${
              selectedPlaylistId === playlist.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {playlist.name}
          </button>
        ))}
      </div>

      {selectedPlaylistId && (
        <>
          <h2 className="text-xl font-medium mb-2">
            {activePlaylist?.name} - Problems
          </h2>
          <ProblemTable problems={baseProblems} /> {/* ✅ This now works correctly */}
        </>
      )}
    </div>
  );
};

export default PlaylistDetailsPage;
