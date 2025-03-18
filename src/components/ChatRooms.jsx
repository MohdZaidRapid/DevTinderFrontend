import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ChatRooms = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]);
  const [passwords, setPasswords] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/chatrooms`, {
        withCredentials: true,
      });
      setChatRooms(response.data);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  };

  const handleJoinRoom = (room) => {
    // Use an empty array if room.users is undefined.
    const usersInRoom = room.users || [];
    const isMember = usersInRoom.includes(user._id);

    if (isMember) {
      // If user is already a member, redirect immediately.
      navigate(`/chatroom/${room._id}`);
    } else {
      // Otherwise, show password input.
      setSelectedRoom(room._id);
      setPasswords((prev) => ({ ...prev, [room._id]: "" }));
    }
  };

  const submitJoinRoom = async (roomId) => {
    const roomPassword = passwords[roomId] || "";
    if (!roomPassword.trim()) {
      alert("Please enter a password!");
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/api/chatrooms/join/${roomId}`,
        { password: roomPassword },
        { withCredentials: true }
      );
      if (response.data.chatRoom) {
        // On successful join, clear the selected room and redirect.
        setSelectedRoom(null);
        setPasswords((prev) => ({ ...prev, [roomId]: "" }));
        navigate(`/chatroom/${roomId}`);
      } else {
        throw new Error("Invalid password.");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Incorrect password.");
      setPasswords((prev) => ({ ...prev, [roomId]: "" }));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chat Rooms</h2>
      <ul>
        {chatRooms.map((room) => {
          const isMember = (room.users || []).includes(user._id);
          return (
            <li
              key={room._id}
              className="mb-2 p-2 border rounded flex flex-col"
            >
              <div className="flex justify-between items-center">
                <span>{room.name}</span>
                <button
                  onClick={() => handleJoinRoom(room)}
                  className="p-2 bg-green-500 text-white rounded"
                >
                  {isMember ? "Open Chat Room" : "Join"}
                </button>
              </div>
              {/* Only show password input if user is not a member */}
              {selectedRoom === room._id && !isMember && (
                <div className="mt-2">
                  <input
                    type="password"
                    value={passwords[room._id] || ""}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        [room._id]: e.target.value,
                      }))
                    }
                    placeholder="Enter room password"
                    className="p-2 border rounded w-full"
                  />
                  <button
                    onClick={() => submitJoinRoom(room._id)}
                    className="p-2 bg-blue-500 text-white rounded mt-2 w-full"
                  >
                    Enter Room
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatRooms;
