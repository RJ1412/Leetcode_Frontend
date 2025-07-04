import React, { useEffect, useState } from 'react';
import { X, Plus, Loader } from 'lucide-react';
import { usePlaylistStore } from '../store/usePlaylistStore';

const AddToPlaylistModal = ({ isOpen, onClose, problemId }) => {
  const { playlists, getAllPlaylists, addProblemToPlaylist, isLoading } = usePlaylistStore();
  const [selectedPlaylist, setSelectedPlaylist] = useState('');

  useEffect(() => {
    if (isOpen) {
      getAllPlaylists();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlaylist) return;

    await addProblemToPlaylist(selectedPlaylist, [problemId]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Pastel background blobs */}
      <div className="absolute top-12 left-12 w-60 h-60 bg-pink-300 opacity-30 blur-3xl rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-60 h-60 bg-blue-300 opacity-30 blur-3xl rounded-full animate-pulse pointer-events-none" />

      <div className="relative bg-white/30 backdrop-blur-2xl border border-purple-200 rounded-3xl shadow-2xl w-full max-w-md p-6 text-zinc-800">
        <div className="flex justify-between items-center mb-4 border-b border-zinc-200 pb-2">
          <h3 className="text-xl font-bold">Add to Playlist</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle text-zinc-700 hover:bg-zinc-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-control">
            <label className="label font-medium text-zinc-700">Select Playlist</label>
            <select
              className="select select-bordered w-full bg-white/50 border-zinc-300 text-zinc-800 placeholder-zinc-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 transition rounded-xl"
              value={selectedPlaylist}
              onChange={(e) => setSelectedPlaylist(e.target.value)}
              disabled={isLoading}
            >
              <option value="" className="bg-white text-zinc-500">Select a playlist</option>
              {playlists.map((playlist) => (
                <option
                  key={playlist.id}
                  value={playlist.id}
                  className="bg-white text-zinc-700"
                >
                  {playlist.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn bg-white/30 hover:bg-white/50 text-zinc-800 font-semibold rounded-xl px-5 py-2 shadow transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-purple-400 hover:bg-purple-300 text-white font-semibold rounded-xl px-5 py-2 shadow flex items-center gap-2 transition"
              disabled={!selectedPlaylist || isLoading}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Plus className="w-4 h-4 text-white" />
              )}
              Add to Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
