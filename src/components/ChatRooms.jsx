import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ChatRooms = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
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

  const handleJoinRoom = async (roomId) => {
    const storedPassword = localStorage.getItem(`roomPassword_${roomId}`);

    if (storedPassword) {
      // If password is stored, try joining directly
      await submitJoinRoom(roomId, storedPassword);
    } else {
      // If no password is stored, prompt user for input
      setSelectedRoom(roomId);
    }
  };

  const submitJoinRoom = async (roomId, passwordInput) => {
    const roomPassword = passwordInput || passwords[roomId] || "";

    if (!roomPassword) {
      alert("Please enter a password!");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/chatrooms/join/${roomId}`,
        { password: roomPassword },
        { withCredentials: true }
      );

      if (
        response.data.success ||
        response.data.message === "Already joined the room"
      ) {
        // Store password only if joining was successful
        localStorage.setItem(`roomPassword_${roomId}`, roomPassword);
        navigate(`/chatroom/${roomId}`); // ✅ Redirect to the chat room
      } else {
        throw new Error("Invalid password.");
      }
    } catch (error) {
      console.error("Error joining chat room:", error);
      alert(
        error.response?.data?.message ||
          "Incorrect password or error joining room."
      );
      setPasswords((prev) => ({ ...prev, [roomId]: "" }));
      localStorage.removeItem(`roomPassword_${roomId}`);
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim() || !password.trim()) return;

    try {
      await axios.post(
        `${BASE_URL}/api/chatrooms/create`,
        { name: roomName, password },
        { withCredentials: true }
      );
      setRoomName("");
      setPassword("");
      fetchChatRooms();
    } catch (error) {
      console.error("Error creating chat room:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chat Rooms</h2>

      {user?.role === "admin" && (
        <div className="mb-4">
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            className="p-2 border rounded mr-2"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter room password"
            className="p-2 border rounded mr-2"
          />
          <button
            onClick={handleCreateRoom}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Create Room
          </button>
        </div>
      )}

      <ul>
        {chatRooms.map((room) => (
          <li key={room._id} className="mb-2 p-2 border rounded flex flex-col">
            <div className="flex justify-between items-center">
              <span>{room.name}</span>
              <button
                onClick={() => handleJoinRoom(room._id)}
                className="p-2 bg-green-500 text-white rounded"
              >
                Join
              </button>
            </div>

            {selectedRoom === room._id && (
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
        ))}
      </ul>
    </div>
  );
};

export default ChatRooms;
