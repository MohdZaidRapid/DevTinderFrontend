import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { AuthContext } from "../context/AuthContext";

const ChatListPage = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/chat");
        setChats(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  const handleBookClick = (e, bookId) => {
    e.stopPropagation(); // Prevent triggering the chat click
    navigate(`/books/${bookId}`);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Chats</h2>
        <p className="text-gray-500">Loading conversations...</p>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Chats</h2>
        <p className="text-gray-500">You don't have any conversations yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Chats</h2>
      {chats.map((chat) => {
        const receiver = chat.participants.find((p) => p._id !== user._id);
        return (
          <div
            key={chat._id}
            onClick={() => handleChatClick(chat._id)}
            className="border p-4 rounded mb-3 hover:bg-gray-50 cursor-pointer flex"
          >
            {chat.book?.image && (
              <div className="w-16 h-16 mr-4 flex-shrink-0">
                <img
                  src={chat.book.image}
                  alt={chat.book.title || "Book"}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="font-semibold">{receiver?.name || "Unknown"}</p>
                <span className="text-xs text-gray-500">
                  {new Date(chat.updatedAt).toLocaleDateString()}
                </span>
              </div>

              {chat.book && (
                <div
                  className="text-sm text-blue-600 hover:underline mt-1"
                  onClick={(e) => handleBookClick(e, chat.book._id)}
                >
                  Book: {chat.book.title || "Untitled"}
                  {chat.book.isFree ? " (Free)" : ` ($${chat.book.price})`}
                </div>
              )}

              <p className="text-gray-600 text-sm mt-1 truncate">
                {chat.lastMessage}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatListPage;
