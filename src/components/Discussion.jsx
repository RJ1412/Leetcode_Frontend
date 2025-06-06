import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";



const Discussion = ({ problemId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`/discuss/${problemId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      console.log("problemId:", problemId);
      setLoading(true);
      const res = await axiosInstance.post(`/discuss/${problemId}`, { comment: newComment });
      console.log(res);
      
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.log(err);
      console.error("Failed to post comment", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [problemId]);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Discussion</h3>

      <div className="mb-4">
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Add a comment..."
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button
          className={`btn btn-primary mt-2 ${loading ? "loading" : ""}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          Post Comment
        </button>
      </div>

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c._id} className="bg-base-200 p-4 rounded-xl">
            <div className="text-sm text-base-content/60 mb-1">
              {c.username} • {new Date(c.createdAt).toLocaleString()}
            </div>
            <div className="text-base">{c.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discussion;
