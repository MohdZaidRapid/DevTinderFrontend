import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, photoUrl, age, gender, about },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setError(error?.response?.data);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-600 to-pink-500 py-12">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8 transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-600">
          Edit Profile
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={firstName}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={lastName}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="text"
              value={age}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <input
              type="text"
              value={gender}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              onChange={(e) => setGender(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">About</label>
            <textarea
              value={about}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Photo URL</label>
            <input
              type="text"
              value={photoUrl}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="flex justify-center">
          <button
            className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white py-3 px-8 rounded-lg shadow-lg hover:from-teal-600 hover:to-indigo-700 transition-all"
            onClick={saveProfile}
          >
            Save Profile
          </button>
        </div>

        {showToast && (
          <div className="toast toast-top toast-center mt-6">
            <div className="alert alert-success bg-gradient-to-r from-green-400 to-blue-500">
              <span className="text-white">Profile saved successfully!</span>
            </div>
          </div>
        )}
      </div>

      <UserCard user={user} showActions={{ interested: false, ignore: false, block: false }} />
    </div>
  );
};

export default EditProfile;