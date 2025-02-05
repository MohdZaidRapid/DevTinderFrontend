import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice.js";
import UserCard from "./UserCard.jsx";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed) || [];
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await axios.get(BASE_URL + "/feed", {
          withCredentials: true,
        });
        dispatch(addFeed(res.data)); // Update feed in Redux store
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };

    fetchFeed(); // Always fetch feed when the component mounts
  }, [dispatch, feed]); // Dependency ensures it runs once on mount

  if (!feed.length) {
    return (
      <h1 className="flex items-center justify-center">No new users found!</h1>
    );
  }

  // Ensure currentPage is within valid range
  const currentUser = feed[currentPage - 1];

  return (
    <div className="flex flex-col items-center my-10">
      {currentUser && <UserCard user={currentUser} />}

      {/* Pagination Controls */}
      <div className="mt-5 flex gap-3">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`btn btn-secondary px-4 py-2 rounded ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Previous
        </button>
        <span className="text-lg font-semibold">
          User {currentPage} of {feed.length}
        </span>
        <button
          disabled={currentPage >= feed.length}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className={`btn btn-secondary px-4 py-2 rounded ${
            currentPage >= feed.length ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Feed;
