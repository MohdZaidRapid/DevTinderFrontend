import { useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { AuthContext } from "../context/AuthContext";

const ChatDetailPage = () => {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookDetails, setShowBookDetails] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchChatAndMessages = async () => {
      try {
        setLoading(true);

        // Get chat details
        const chatRes = await axios.get(`/chat/${chatId}`);
        setChat(chatRes.data);

        // Get messages
        const messagesRes = await axios.get(`/chat/${chatId}/messages`);
        setMessages(messagesRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Error loading chat:", err);
        setError("Failed to load conversation");
        setLoading(false);
      }
    };

    fetchChatAndMessages();
  }, [chatId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(`/messages`, {
        chatId,
        content: newMessage,
      });

      setNewMessage("");

      // Fetch updated messages
      const messagesRes = await axios.get(`/chat/${chatId}/messages`);
      setMessages(messagesRes.data);
    } catch (err) {
      console.error("Error sending message:", err);
      // Handle error
    }
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

  if (loading)
    return <div className="p-4 text-center">Loading conversation...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  // Find the other participant
  const otherUser = chat?.participants?.find((p) => p._id !== user?._id);

  return (
    <div className="flex flex-col h-screen">
      {/* Chat header */}
      <div className="bg-white border-b p-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4 text-gray-600">
          ← Back
        </button>
        <div>
          <h2 className="font-medium">{otherUser?.name || "Chat"}</h2>
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

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`p-3 rounded-lg max-w-xs md:max-w-md ${
                message.sender._id === user?._id
                  ? "bg-blue-100 ml-auto"
                  : "bg-white"
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="bg-white border-t p-3 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-l p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatDetailPage;
