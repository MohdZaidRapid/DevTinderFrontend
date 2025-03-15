import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

// const socket = io("http://localhost:5000");

const ChatRoom = () => {
  const { roomId } = useParams();
  const user = useSelector((state) => state.user);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const socket = createSocketConnection();
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/chatrooms/${roomId}/messages`,
          { withCredentials: true }
        );
        console.log(response?.data);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages(); // Fetch chat history when joining the room

    socket.emit("joinRoom", { roomId, userId: user._id });

    socket.on("roomMessageReceived", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("roomMessageReceived");
    };
  }, [roomId, user._id]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      userId: user._id,
      text: message,
      roomId,
    };

    socket.emit("sendRoomMessage", newMessage);
    setMessage("");

    try {
      await axios.post(
        `${BASE_URL}/api/chatrooms/${roomId}/message`,
        { text: message, userId: user._id },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Chat Room</h2>
      <div className="border p-4 h-64 overflow-y-scroll mb-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 ${
              msg.senderId === user._id ? "text-right" : "text-left"
            }`}
          >
            <span className="bg-gray-200 p-1 rounded">{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
