import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const BuyPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/posts/${postId}`, {
          withCredentials: true,
        });
        console.log(response.data)
        setPost(response.data?.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) return <p className="text-gray-500">Loading post...</p>;
  if (!post) return <p className="text-red-500">Post not found!</p>;

  const handleBuy = async () => {
    try {
      // const token = localStorage.getItem("token");
      // if (!token) {
      //   alert("You must be logged in to buy a post.");
      //   return;
      // }
      await axios.post(`${BASE_URL}/posts/${postId}/buy`, {}, { withCredentials: true });
      alert("Purchase successful!");
      navigate("/");
    } catch (err) {
      console.error("Error buying post:", err);
      alert("Purchase failed.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Buy Post</h2>
      <p className="text-lg text-gray-600">Price: ${post.price || "N/A"}</p>
      <p className="text-gray-700 mt-2">{post.content}</p>
      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post" className="mt-3 w-32 rounded-lg shadow-sm" />
      )}
      <button
        onClick={handleBuy}
        className="mt-3 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Confirm Purchase
      </button>
    </div>
  );
};

export default BuyPost;
