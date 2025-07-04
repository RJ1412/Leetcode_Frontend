import React from 'react'
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const CreatePlaylistModal = ({ isOpen, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Soft pastel background blobs */}
      <div className="absolute top-10 left-10 w-60 h-60 bg-pink-300 opacity-30 blur-3xl rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-blue-300 opacity-30 blur-3xl rounded-full animate-pulse pointer-events-none" />

      <div className="relative bg-white/30 backdrop-blur-2xl border border-purple-200 rounded-3xl shadow-2xl w-full max-w-md p-6 text-zinc-800">
        <div className="flex justify-between items-center mb-4 border-b border-zinc-200 pb-2">
          <h3 className="text-xl font-bold">Create New Playlist</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle text-zinc-700 hover:bg-zinc-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <div className="form-control">
            <label className="label font-medium text-zinc-700">Playlist Name</label>
            <input
              type="text"
              className="input input-bordered w-full bg-white/50 border-zinc-300 text-zinc-800 placeholder-zinc-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 transition rounded-xl"
              placeholder="Enter playlist name"
              {...register('name', { required: 'Playlist name is required' })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="form-control">
            <label className="label font-medium text-zinc-700">Description</label>
            <textarea
              className="textarea textarea-bordered w-full bg-white/50 border-zinc-300 text-zinc-800 placeholder-zinc-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-300 transition rounded-xl"
              placeholder="Enter playlist description"
              {...register('description')}
              rows={4}
            />
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
              className="btn bg-purple-400 hover:bg-purple-300 text-white font-semibold rounded-xl px-5 py-2 shadow transition"
            >
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
