import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ChatRoom = () => {
  const { roomId } = useParams();
  const user = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const socket = createSocketConnection();

  // ✅ Fetch messages from API when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/chatrooms/${roomId}/messages`
        );
        setMessages(response.data); // ✅ Store messages in state
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages(); // Call API when component mounts

    socket.emit("joinRoom", { roomId, userId: user._id });

    socket.on("roomMessageReceived", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]); // ✅ Update state in real-time
    });

    return () => {
      socket.off("roomMessageReceived");
    };
  }, [roomId, user._id]);

  const sendMessage = async () => {
    if (!message.trim() && !selectedFile) return;

    let fileData = null;

    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // Remove metadata prefix
        fileData = {
          name: selectedFile.name,
          type: selectedFile.type,
          data: base64String,
        };

        socket.emit("sendRoomMessage", {
          userId: user._id,
          roomId,
          text: message,
          file: fileData,
        });

        setMessage("");
        setSelectedFile(null);
      };
    } else {
      socket.emit("sendRoomMessage", {
        userId: user._id,
        roomId,
        text: message,
        file: null,
      });

      setMessage("");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Chat Room</h2>

      {/* Messages Display */}
      <div className="border p-4 h-64 overflow-y-scroll mb-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 ${
              msg.senderId === user._id ? "text-right" : "text-left"
            }`}
          >
            <span className="bg-gray-200 p-1 rounded">{msg.text}</span>

            {/* Display Image */}
            {msg.fileUrl &&
              (msg.fileType.startsWith("image/") ? (
                <img
                  src={`${BASE_URL}${msg.fileUrl}`}
                  alt="Uploaded file"
                  className="w-40 mt-2 rounded"
                />
              ) : (
                <a
                  href={`${BASE_URL}${msg.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-500 mt-2"
                >
                  Download File
                </a>
              ))}
          </div>
        ))}
      </div>

      {/* Message Input and File Upload */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded"
        />

        {/* File Upload Input */}
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="p-2 border rounded"
        />

        {/* Preview Selected File */}
        {selectedFile && selectedFile.type.startsWith("image/") && (
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            className="w-10 h-10 object-cover rounded"
          />
        )}

        {/* Send Button */}
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
