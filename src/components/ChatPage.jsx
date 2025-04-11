import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

const socket = io(import.meta.env.VITE_SOCKET_URL);

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

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

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

  const toggleBookDetails = () => setShowBookDetails((prev) => !prev);

  const handleViewBook = (e) => {
    e.stopPropagation();
    if (chat?.book?._id) navigate(`/books/${chat.book._id}`);
  };

  const otherUser = chat?.participants?.find((p) => p._id !== user?._id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-800 dark:via-gray-900 dark:to-black p-4">
      <div className="max-w-3xl mx-auto rounded-xl shadow-xl overflow-hidden bg-white/30 backdrop-blur-md dark:bg-black/30">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {otherUser?.name || "Chat"}
            </h2>
            {chat?.book && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                About: {chat.book.title}
              </p>
            )}
          </div>
          {chat?.book && (
            <button
              onClick={toggleBookDetails}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showBookDetails ? "Hide Book" : "Show Book"}
            </button>
          )}
        </div>

        {/* Book details */}
        {showBookDetails && chat?.book && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/40 dark:bg-white/10 border-b px-4 py-3"
          >
            <div className="flex gap-3 items-start">
              <img
                src={chat.book.image}
                alt={chat.book.title}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {chat.book.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  By {chat.book.author}
                </p>
                {chat.book.isFree ? (
                  <p className="text-green-600 font-medium">Free</p>
                ) : (
                  <p className="text-sm">
                    <span className="font-medium">Price:</span> $
                    {chat.book.price}
                  </p>
                )}
                {chat.book.condition && (
                  <p className="text-sm">
                    <span className="font-medium">Condition:</span>{" "}
                    {chat.book.condition}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-2 text-right">
              <button
                onClick={handleViewBook}
                className="text-blue-500 text-sm hover:underline"
              >
                View Full Details
              </button>
            </div>
          </motion.div>
        )}

        {/* Messages */}
        <div className="h-[450px] overflow-y-auto px-4 py-2 space-y-3 bg-gradient-to-br from-white/20 to-white/10 dark:from-gray-800/30 dark:to-gray-700/20">
          {messages.map((m, i) => {
            const isMe = m.sender._id === user._id;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[75%] p-3 rounded-xl shadow-sm ${
                  isMe
                    ? "ml-auto bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                }`}
              >
                <p className="break-words">{m.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(m.createdAt).toLocaleTimeString()}
                </p>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 p-4 border-t dark:border-gray-700 bg-white/30 dark:bg-white/10 backdrop-blur-sm">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 dark:text-white"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
