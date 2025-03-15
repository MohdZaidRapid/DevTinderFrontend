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
    try {
      await axios.post(
        `${BASE_URL}/api/chatrooms/join/${roomId}`,
        {},
        { withCredentials: true }
      );
      navigate(`/chatroom/${roomId}`);
    } catch (error) {
      console.error("Error joining chat room:", error);
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;

    try {
      await axios.post(
        `${BASE_URL}/api/chatrooms/create`,
        { name: roomName },
        { withCredentials: true }
      );
      setRoomName("");
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
          <li key={room._id} className="mb-2 p-2 border rounded">
            <span>{room.name}</span>
            <button
              onClick={() => handleJoinRoom(room._id)}
              className="ml-4 p-2 bg-green-500 text-white rounded"
            >
              Join
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRooms;
