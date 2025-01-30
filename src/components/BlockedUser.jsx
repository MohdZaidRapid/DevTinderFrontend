import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";

const BlockedUser = () => {
  const user = useSelector((store) => store.user);
  const [blockedUser, setBlockedUser] = useState([]);

  const fetchUser = async () => {
    const res = await axios.get(BASE_URL + "/block/blocked", {
      withCredentials: true,
    });
    setBlockedUser(res?.data?.blockedUsers);
  };

  const unBlockedUser = async (userId) => {
    await axios.post(BASE_URL + `/unBlock/${userId}`, {}, { withCredentials: true });
    fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 py-12 px-6 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-10">
        Blocked Users
      </h1>

      {blockedUser.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {blockedUser.map((bu, index) => (
            <div
              key={index}
              className="bg-black bg-opacity-60 backdrop-blur-md p-6 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold text-white">
                  {bu.firstName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">{bu.firstName} {bu.lastName}</h2>
                  <p className="text-sm text-gray-400">{bu.emailId}</p>
                  <p className="text-sm text-gray-400">{bu.gender}</p>
                </div>
              </div>

              <div className="mt-4">
                {bu.skills && Array.isArray(bu.skills) ? (
                  <div>
                    <h3 className="text-lg text-purple-400">Skills:</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {bu.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 rounded-full text-sm bg-gray-800 text-purple-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">No skills available</span>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
                  onClick={() => unBlockedUser(bu._id)}
                >
                  Unblock
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-white text-xl">No blocked users found.</div>
      )}
    </div>
  );
};

export default BlockedUser;
