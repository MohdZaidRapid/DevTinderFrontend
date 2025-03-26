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
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomPassword, setNewRoomPassword] = useState("");

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

  const handleCreateRoom = async () => {
    if (!newRoomName.trim() || !newRoomPassword.trim()) {
      alert("Room name and password are required!");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/chatrooms/create`,
        { name: newRoomName, password: newRoomPassword },
        { withCredentials: true }
      );

      alert(response.data.message);
      setNewRoomName("");
      setNewRoomPassword("");
      fetchChatRooms(); // Refresh the list
    } catch (error) {
      alert(error.response?.data?.error || "Failed to create chat room.");
    }
  };

  /** Handle Join Room */
  const handleJoinRoom = (room) => {
    if (!user || !user._id) {
      alert("User not authenticated!");
      return;
    }

    const isMember = (room.users || []).includes(user._id);

    if (isMember) {
      navigate(`/chatroom/${room._id}`);
    } else {
      setSelectedRoom(room._id);
      setPasswords((prev) => ({ ...prev, [room._id]: "" }));
    }
  };

  /** Submit Join Room */
  const submitJoinRoom = async (roomId) => {
    if (!user || !user._id) {
      alert("User not authenticated!");
      return;
    }

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

      {/* Show Create Room form for Admins */}
      {user.role === "admin" && (
        <div className="mb-4 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">Create a New Room</h3>
          <input
            type="text"
            placeholder="Room Name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="p-2 border rounded w-full mb-2"
          />
          <input
            type="password"
            placeholder="Room Password"
            value={newRoomPassword}
            onChange={(e) => setNewRoomPassword(e.target.value)}
            className="p-2 border rounded w-full mb-2"
          />
          <button
            onClick={handleCreateRoom}
            className="p-2 bg-blue-500 text-white rounded w-full"
          >
            Create Room
          </button>
        </div>
      )}

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
