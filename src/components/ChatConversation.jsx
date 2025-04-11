import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "../lib/axios";

const ChatConversation = () => {
  const { chatId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showBookDetails, setShowBookDetails] = useState(false);
  const [bookDetails, setBookDetails] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatAndMessages = async () => {
      try {
        setLoading(true);

        // Get chat details
        const chatRes = await axios.get(`/chats/${chatId}`);
        setChat(chatRes.data);

        // Get messages
        const messagesRes = await axios.get(`/chats/${chatId}/messages`);
        setMessages(messagesRes.data);

        // Fetch complete book details
        if (chatRes.data.book && chatRes.data.book._id) {
          const bookRes = await axios.get(`/books/${chatRes.data.book._id}`);
          setBookDetails(bookRes.data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading chat:", err);
        setError(err.response?.data?.message || "Failed to load chat");
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
      // Assuming you have an endpoint to send messages
      await axios.post(`/messages`, {
        chatId,
        content: newMessage,
      });

      // Refresh messages (or add optimistic update)
      const messagesRes = await axios.get(`/chats/${chatId}/messages`);
      setMessages(messagesRes.data);

      // Clear input
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      // Handle error
    }
  };

  const handleBackToBook = () => {
    if (chat?.book?._id) {
      navigate(`/books/${chat.book._id}`);
    } else {
      navigate("/books"); // Fallback to books list
    }
  };

  const toggleBookDetails = () => {
    setShowBookDetails(!showBookDetails);
  };

  if (loading) return <div className="p-4 text-center">Loading chat...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  // Find the other user (not the current user)
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const otherUser = chat?.participants?.find((p) => p._id !== currentUser?._id);

  return (
    <div className="flex flex-col h-screen">
      {/* Chat header */}
      <div className="bg-white border-b p-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4 text-gray-600">
          ← Back
        </button>
        <div>
          <h2 className="font-semibold">{otherUser?.name || "Chat"}</h2>
          <p className="text-sm text-gray-500">
            About: {chat?.book?.title || "Book"}
          </p>
        </div>
        <button onClick={toggleBookDetails} className="ml-auto text-blue-500">
          {showBookDetails ? "Hide Book" : "View Book"}
        </button>
      </div>

      {/* Book details panel - shows when toggled */}
      {showBookDetails && bookDetails && (
        <div className="bg-gray-50 border-b p-4">
          <div className="flex">
            <div className="w-24 h-24 flex-shrink-0">
              {bookDetails.image && (
                <img
                  src={bookDetails.image}
                  alt={bookDetails.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-medium text-lg">{bookDetails.title}</h3>
              <p className="text-gray-600">By {bookDetails.author}</p>
              <p className="text-sm mt-1">
                <span className="font-semibold">Price:</span>{" "}
                {bookDetails.isFree ? "Free" : `$${bookDetails.price}`}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Condition:</span>{" "}
                {bookDetails.condition}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Location:</span>{" "}
                {bookDetails.area}, {bookDetails.city}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-700 line-clamp-2">
              {bookDetails.description}
            </p>
          </div>
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleBackToBook}
              className="text-blue-500 text-sm hover:underline"
            >
              View Full Details
            </button>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`p-3 rounded-lg max-w-xs md:max-w-md ${
                message.sender._id === currentUser?._id
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
      <form onSubmit={handleSendMessage} className="bg-white border-t p-4 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-l p-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatConversation;
