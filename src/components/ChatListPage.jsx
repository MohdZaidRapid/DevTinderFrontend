import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { AuthContext } from "../context/AuthContext";

const ChatListPage = () => {
  const [chats, setChats] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get("/chat");
        setChats(res.data);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Chats</h2>
      {chats.map((chat) => {
        const receiver = chat.participants.find((p) => p._id !== user._id);
        return (
          <div
            key={chat._id}
            onClick={() => navigate(`/chat/${chat._id}`)}
            className="border p-4 rounded mb-2 hover:bg-gray-100 cursor-pointer"
          >
            <p>
              <strong>{receiver?.name || "Unknown"}</strong>
            </p>
            <p className="text-gray-600 text-sm">{chat.lastMessage}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ChatListPage;
