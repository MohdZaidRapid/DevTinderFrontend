import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";

const socket = io(import.meta.env.VITE_SOCKET_URL); // Your Socket.IO server URL

const ChatPage = () => {
  const { chatId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showBookDetails, setShowBookDetails] = useState(false);
  const messagesEndRef = useRef(null);

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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const toggleBookDetails = () => {
    setShowBookDetails(!showBookDetails);
  };

  const handleViewBook = (e) => {
    e.stopPropagation();
    if (chat?.book?._id) {
      navigate(`/books/${chat.book._id}`);
    }
  };

  // Find the other participant
  const otherUser = chat?.participants?.find((p) => p._id !== user?._id);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      {/* Chat header */}
      <div className="bg-white border-b p-4 flex items-center">
        <div>
          <h2 className="text-xl font-bold">{otherUser?.name || "Chat"}</h2>
          {chat?.book && (
            <p className="text-sm text-gray-600">About: {chat.book.title}</p>
          )}
        </div>
        {chat?.book && (
          <button
            onClick={toggleBookDetails}
            className="ml-auto text-blue-600 text-sm"
          >
            {showBookDetails ? "Hide Book" : "Show Book"}
          </button>
        )}
      </div>

      {/* Book details panel */}
      {showBookDetails && chat?.book && (
        <div className="bg-gray-50 border-b p-3">
          <div className="flex">
            {chat.book.image && (
              <div className="w-20 h-20 flex-shrink-0">
                <img
                  src={chat.book.image}
                  alt={chat.book.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
            <div className="ml-3 flex-1">
              <h3 className="font-medium">{chat.book.title}</h3>
              {chat.book.author && (
                <p className="text-sm text-gray-600">By {chat.book.author}</p>
              )}
              <p className="text-sm">
                <span className="font-medium">Price:</span>{" "}
                {chat.book.isFree ? "Free" : `$${chat.book.price}`}
              </p>
              {chat.book.condition && (
                <p className="text-sm">
                  <span className="font-medium">Condition:</span>{" "}
                  {chat.book.condition}
                </p>
              )}
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleViewBook}
              className="text-blue-600 text-sm hover:underline"
            >
              View Full Details
            </button>
          </div>
        </div>
      )}

      {/* Book Quick Info Bar - Always visible when not showing details */}
      {chat?.book && !showBookDetails && (
        <div className="bg-blue-50 border-b p-2 flex items-center">
          {chat.book.image && (
            <div className="w-10 h-10 flex-shrink-0 mr-3">
              <img
                src={chat.book.image}
                alt={chat.book.title}
                className="w-full h-full object-cover rounded"
              />
            </div>
          )}
          <div className="flex-1 text-sm truncate">
            <span className="font-medium">{chat.book.title}</span>
            <span className="mx-2">•</span>
            <span>{chat.book.isFree ? "Free" : `$${chat.book.price}`}</span>
          </div>
          <button
            onClick={handleViewBook}
            className="text-blue-600 text-xs px-2 py-1 border border-blue-300 rounded ml-2"
          >
            View
          </button>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-xs md:max-w-md mb-3 ${
              m.sender._id === user?._id ? "bg-blue-100 ml-auto" : "bg-white"
            }`}
          >
            <p>
              <strong>{m.sender.name}:</strong> {m.content}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(m.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="bg-white border-t p-3 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          className="flex-1 border p-2 rounded"
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
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
