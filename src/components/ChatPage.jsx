import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "../lib/axios";
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";

const socket = io(import.meta.env.VITE_SOCKET_URL); // Your Socket.IO server URL

const ChatPage = () => {
  const { chatId } = useParams();
  const { user } = useContext(AuthContext);

  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const chatRes = await axios.get(`/chat/${chatId}`);
        setChat(chatRes.data);

        const messagesRes = await axios.get(`/chat/${chatId}/messages`);
        setMessages(messagesRes.data);

        socket.emit("join", user._id);
        socket.emit("joinRoom", chatId);
      } catch (err) {
        console.error("Failed to load chat:", err);
      }
    };

    fetchChat();
  }, [chatId, user]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const receiver = chat.participants.find((p) => p._id !== user._id);

    socket.emit("sendMessage", {
      chatId: chat._id,
      senderId: user._id,
      receiverId: receiver?._id,
      content: message,
      senderName: user.name || "You",
    });

    setMessage("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      <div className="border rounded p-4 h-96 overflow-y-scroll bg-gray-50 mb-4">
        {messages.map((m, i) => (
          <p key={i} className="mb-2">
            <strong>{m.sender.name}:</strong> {m.content}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
