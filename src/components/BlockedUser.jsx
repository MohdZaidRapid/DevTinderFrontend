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
    const unBlockUser = await axios.post(
      BASE_URL + `/unBlock/${userId}`,
      {},
      { withCredentials: true }
    );
    fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="bg-slate-900 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl text-center text-white font-semibold mb-8">
          Blocked Users
        </h1>

        {blockedUser.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blockedUser.map((bu, index) => (
              <div
                key={index}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="card-body text-white">
                  <h2 className="card-title text-xl">
                    {bu.firstName} {bu.lastName}
                  </h2>
                  <p className="text-sm text-gray-400">{bu.emailId}</p>
                  <p className="text-sm text-gray-400">{bu.gender}</p>

                  <div className="mt-4">
                    {bu.skills && Array.isArray(bu.skills) ? (
                      <div>
                        <h3 className="text-lg">Skills:</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {bu.skills.map((skill, index) => (
                            <span key={index} className="badge badge-info">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">
                        No skills available
                      </span>
                    )}
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => unBlockedUser(bu._id)}
                    >
                      Unblock
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white text-lg">
            No blocked users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockedUser;
