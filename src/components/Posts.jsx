import React, { useState } from "react";
import Comments from "../components/Comments";
import { useNavigate } from "react-router-dom";

const Posts = ({ posts, likePost, createPost }) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");

  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create a Post</h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL (optional)"
          className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Set Price (optional)"
          className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => createPost(content, imageUrl, price)}
          className="mt-3 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Post
        </button>
      </div>
      <div>
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white p-4 shadow-md rounded-lg mb-4"
          >
            <h4 className="text-lg font-semibold text-gray-700">
              Owned by: {post.currentOwner?.firstName}{" "}
              {post.currentOwner?.lastName}
            </h4>
            <p className="text-sm text-gray-500">
              Created by: {post.createdBy.firstName} {post.createdBy.lastName}
            </p>
            <p className="text-gray-600 mt-2">{post.content}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-28 mt-3 rounded-lg shadow-sm"
              />
            )}
            <p className="text-gray-700 mt-2">Price: ${post.price || "N/A"}</p>
            <button
              onClick={() => likePost(post._id)}
              className="mt-3 bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition duration-200"
            >
              ❤️ Like ({post.likes?.length})
            </button>
            <button
              onClick={() => navigate(`/buy-post/${post._id}`)}
              disabled={!post.isForSale}
              className={`mt-3 ml-3 ${
                post.isForSale
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-400"
              } text-white px-4 py-1 rounded-lg transition duration-200`}
            >
              💰 {post.isForSale ? `Buy for $${post.price}` : "Not for Sale"}
            </button>
            <Comments postId={post._id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
