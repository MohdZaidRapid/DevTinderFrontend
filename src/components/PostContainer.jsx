import React, { useState, useEffect } from "react";
import axios from "axios";
import Posts from "./Posts";
import { BASE_URL } from "../utils/constants";

const PostContainer = () => {
  const [posts, setPosts] = useState([]);
  const [fetchConnectionsOnly, setFetchConnectionsOnly] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [fetchConnectionsOnly]);

  const fetchPosts = async () => {
    try {
      const endpoint = fetchConnectionsOnly ? "/posts/connections" : "/posts";
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        withCredentials: true,
      });
      setPosts(response.data?.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const createPost = async (content, imageUrl, price) => {
    if (!content) return;
    try {
      await axios.post(
        BASE_URL + "/posts",
        {
          content,
          imageUrl,
          price,
          isForSale: !!price, // Set isForSale to true if price exists
        },
        { withCredentials: true }
      );
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const likePost = async (postId) => {
    try {
      await axios.post(
        `${BASE_URL}/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );
      fetchPosts(); // Re-fetch posts to update UI instantly
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <div>
      <button
        onClick={() => setFetchConnectionsOnly(!fetchConnectionsOnly)}
        style={{
          display: "block",
          margin: "20px auto",
          padding: "10px 20px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "background 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
      >
        {fetchConnectionsOnly ? "Show All Posts" : "Show Connections Posts"}
      </button>

      <Posts posts={posts} likePost={likePost} createPost={createPost} />
    </div>
  );
};

export default PostContainer;
