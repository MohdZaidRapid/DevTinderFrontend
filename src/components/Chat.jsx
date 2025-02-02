import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const messagesEndRef = useRef(null);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const fetchChatMessages = async () => {
    try {
      setIsError(false);
      setError("");
      const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });
      const chatMessages = chat?.data?.messages.map((msg) => {
        const { senderId, text } = msg;
        return {
          firstName: senderId.firstName,
          lastName: senderId.lastName,
          text,
        };
      });
      setMessages(chatMessages);
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message || "An error occurred");
      setIsError(true);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { firstName, lastName, text },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId, user?.firstName, user?.lastName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white bg-opacity-80 rounded-xl shadow-2xl flex flex-col overflow-hidden h-[80vh]">
        {/* Header */}
        <header className="p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <h1 className="text-2xl font-bold">Chat</h1>
        </header>

        {/* Error Message */}
        {isError && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mx-5 mt-5">
            {error}
          </div>
        )}

        {/* Chat Messages */}
        <main className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50 bg-opacity-60">
          {messages.map((msg, index) => {
            const isCurrentUser = user.firstName === msg.firstName;
            return (
              <div
                key={index}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs p-4 rounded-lg shadow-md ${
                    isCurrentUser
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <div className="text-sm font-semibold">
                    {`${msg.firstName} ${msg.lastName}`}
                  </div>
                  <p className="mt-1">{msg.text}</p>
                  <div className="text-xs text-right mt-2 opacity-75">
                    2 hours ago
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </main>

        {/* Input Section */}
        <footer className="p-5 bg-white bg-opacity-80 border-t border-gray-300 sticky bottom-0">
          <div className="flex items-center gap-3">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              type="text"
              placeholder="Type your message..."
              className={`flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 ${
                isError
                  ? "focus:ring-red-500 cursor-not-allowed bg-gray-100"
                  : "focus:ring-indigo-500"
              }`}
              disabled={isError} // Disable input if there's an error
            />
            <button
              onClick={sendMessage}
              className={`bg-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-lg focus:outline-none focus:ring-2 ${
                isError
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
              }`}
              disabled={isError} // Disable button if there's an error
            >
              Send
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Chat;
