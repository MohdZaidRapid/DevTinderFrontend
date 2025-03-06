import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null); // Track which comment is being replied to

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/posts/${postId}/comment`, {
        withCredentials: true,
      });
      setComments(response.data?.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `${BASE_URL}/posts/${postId}/comment`,
        { text: newComment },
        { withCredentials: true }
      );
      setNewComment(""); // Clear input
      fetchComments(); // Refresh UI
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const addReply = async (commentId) => {
    if (!replyText[commentId]?.trim()) return;
    try {
      await axios.post(
        `${BASE_URL}/posts/${postId}/comment/${commentId}/reply`,
        { text: replyText[commentId] },
        { withCredentials: true }
      );
      setReplyText({ ...replyText, [commentId]: "" }); // Clear input for this comment
      setReplyingTo(null); // Hide reply input after sending
      fetchComments(); // Refresh UI
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-md font-bold text-gray-700">Comments</h4>

      {/* Display Comments */}
      <div className="mt-2">
        {comments.map((comment) => (
          <div key={comment._id} className="p-2 border-b border-gray-200">
            <p className="text-gray-600">
              <strong>
                {comment.user?.firstName} {comment.user?.lastName}:
              </strong>{" "}
              {comment.text}
            </p>

            {/* Replies */}
            <div className="ml-4 mt-2">
              {comment.replies.map((reply) => (
                <p key={reply._id} className="text-gray-500 text-sm">
                  <strong>
                    {reply.user?.firstName} {reply.user?.lastName}:
                  </strong>{" "}
                  {reply.text}
                </p>
              ))}
            </div>

            {/* Reply Input */}
            {replyingTo === comment._id ? (
              <div className="mt-2 ml-4">
                <input
                  type="text"
                  value={replyText[comment._id] || ""}
                  onChange={(e) =>
                    setReplyText({
                      ...replyText,
                      [comment._id]: e.target.value,
                    })
                  }
                  placeholder="Write a reply..."
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => addReply(comment._id)}
                  className="mt-2 bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Reply
                </button>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="mt-2 ml-2 bg-gray-400 text-white px-4 py-1 rounded-lg hover:bg-gray-500 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setReplyingTo(comment._id)}
                className="mt-2 text-blue-500 hover:underline text-sm"
              >
                Reply
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Comment Input */}
      <div className="mt-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addComment}
          className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default Comments;
