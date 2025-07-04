import { useState } from "react";
import axios from "axios";

export default function EditProfileModal({ name, email, onClose, onUpdated }) {
  const [newName, setNewName] = useState(name);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await axios.put("http://localhost:8080/api/v1/users/update-profile", { name: newName }, { withCredentials: true });
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Update error", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <label className="block mb-2">
          <span className="text-sm text-gray-600">Name</span>
          <input value={newName} onChange={(e) => setNewName(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        </label>
        <label className="block mb-4">
          <span className="text-sm text-gray-600">Email (read-only)</span>
          <input value={email} disabled className="w-full mt-1 p-2 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white" />
        </label>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700">Cancel</button>
          <button onClick={handleUpdate} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
