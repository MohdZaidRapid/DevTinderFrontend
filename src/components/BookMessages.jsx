import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../lib/axios";

const BookMessages = () => {
  const { bookId } = useParams();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookDetails, setBookDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookAndMessages = async () => {
      try {
        setLoading(true);

        // Fetch book details
        const bookRes = await axios.get(`/books/${bookId}`);
        setBookDetails(bookRes.data);

        // Fetch all chats/messages for this book
        const messagesRes = await axios.get(`/chat/book/${bookId}`);
        setChats(messagesRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching book messages:", err);
        setError(err.response?.data?.message || "Failed to load messages");
        setLoading(false);
      }
    };

    fetchBookAndMessages();
  }, [bookId]);

  // Function to handle redirecting to chat with a specific user
  const handleChatRedirect = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  if (loading)
    return <div className="p-4 text-center">Loading messages...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (chats.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">
          Messages for {bookDetails?.title}
        </h1>
        <p className="text-gray-500">No messages about this book yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Messages for {bookDetails?.title}
      </h1>

      <div className="space-y-6">
        {chats.map((chat) => (
          <div key={chat.chatId} className="border rounded-lg p-4 shadow-sm">
            <div
              className="flex items-center mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
              onClick={() => handleChatRedirect(chat.chatId)}
            >
              <div>
                <h2 className="font-semibold">{chat.user.name}</h2>
                <p className="text-sm text-gray-500">{chat.user.email}</p>
              </div>
              <div className="ml-auto text-blue-500">
                <span>Reply →</span>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              {chat.messages.map((message) => (
                <div
                  key={message._id}
                  className={`p-2 rounded-lg ${
                    message.sender._id === chat.user._id
                      ? "bg-gray-100"
                      : "bg-blue-100 ml-auto"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                onClick={() => handleChatRedirect(chat.chatId)}
              >
                Continue Conversation
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookMessages;
