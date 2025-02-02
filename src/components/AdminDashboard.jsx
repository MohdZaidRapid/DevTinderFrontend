import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); // List of all users
  const [selectedUser, setSelectedUser] = useState(null); // Selected user details
  const [error, setError] = useState(""); // Error message
  const [loading, setLoading] = useState(false); // Loading state
  const user = useSelector((store) => store.user); // Current admin user

  // Fetch all users (excluding admins)
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/admin/get`, {
        withCredentials: true,
      });
      setUsers(response.data.users);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch details of a specific user
  const fetchUserDetails = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/admin/get/${userId}`, {
        withCredentials: true,
      });
      setSelectedUser(response.data.user);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  // Block a user
  const blockUser = async (userId) => {
    try {
      setLoading(true);
      await axios.post(
        `${BASE_URL}/admin/block/${userId}`,
        {},
        { withCredentials: true }
      );
      fetchAllUsers(); // Refresh the user list
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to block user");
    } finally {
      setLoading(false);
    }
  };

  // Unblock a user
  const unblockUser = async (userId) => {
    try {
      setLoading(true);
      await axios.post(
        `${BASE_URL}/admin/unblock/${userId}`,
        {},
        { withCredentials: true }
      );
      fetchAllUsers(); // Refresh the user list
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to unblock user");
    } finally {
      setLoading(false);
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/admin/delete/${userId}`, {
        withCredentials: true,
      });
      fetchAllUsers(); // Refresh the user list
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500 border border-red-700 text-white px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* User List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-white">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-white">{user.emailId}</p>
            <p className="text-sm text-gray-200">
              Status: {user.isDeactivated ? "Blocked" : "Active"}
            </p>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => fetchUserDetails(user._id)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                View Details
              </button>
              {user.isDeactivated ? (
                <button
                  onClick={() => unblockUser(user._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Unblock
                </button>
              ) : (
                <button
                  onClick={() => blockUser(user._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Block
                </button>
              )}
              <button
                onClick={() => deleteUser(user._id)}
                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-white">
              {selectedUser.firstName} {selectedUser.lastName}
            </h2>
            <p className="text-white">Email: {selectedUser.emailId}</p>
            <p className="text-white">Role: {selectedUser.role}</p>
            <p className="text-white">Age: {selectedUser.age}</p>
            <p className="text-white">Gender: {selectedUser.gender}</p>
            <p className="text-white">
              Skills: {selectedUser.skills?.join(", ")}
            </p>
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
