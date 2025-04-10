import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "../lib/axios";
import { AuthContext } from "../context/AuthContext";

const InboxPage = () => {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get("/chat");
        setChats(res.data);
      } catch (err) {
        console.error("Failed to load chats:", err);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Chats</h2>
      {chats.map((chat) => {
        const other = chat.participants.find((p) => p._id !== user._id);
        return (
          <Link
            to={`/chat/${chat._id}`}
            key={chat._id}
            className="block p-4 border rounded mb-2 hover:bg-gray-50"
          >
            <p className="font-semibold">{other?.name}</p>
            {chat.book && (
              <p className="text-sm text-gray-500">Book: {chat.book.title}</p>
            )}
            {chat.lastMessage && (
              <p className="text-gray-600">{chat.lastMessage}</p>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default InboxPage;
