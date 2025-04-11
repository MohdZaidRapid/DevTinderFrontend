import { useEffect, useState, useContext } from "react";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Books = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/books", {
        params: {
          search,
          page,
          limit: 10,
        },
      });
      setBooks(res.data.books);
    } catch (err) {
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async (bookId) => {
    try {
      const res = await axios.post("/chat/start", { bookId });
      const chatId = res.data._id;
      navigate(`/chat/${chatId}`);
    } catch (err) {
      console.error("Failed to start chat:", err);
      alert("Unable to start chat. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`/book/${id}`);
      setBooks((prev) => prev.filter((book) => book._id !== id));
    } catch (err) {
      alert("Failed to delete book");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search, page]);

  return (
    <div className="p-6 bg-gradient-to-br from-white via-blue-50 to-purple-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        📚 Explore Books
      </h1>

      <div className="max-w-2xl mx-auto mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search for a book..."
          className="w-full px-4 py-3 rounded-xl shadow-inner border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />
      </div>

      {loading ? (
        <p className="text-center text-lg text-gray-600 animate-pulse">
          Loading books...
        </p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-5 cursor-pointer flex flex-col justify-between"
              onClick={() => {
                if (!user) {
                  navigate(`/books/${book._id}`);
                } else if (book.listedBy !== user._id) {
                  handleChat(book._id);
                } else {
                  navigate(`/books/${book._id}`);
                }
              }}
            >
              <img
                src={book.image || "/default-book.jpg"}
                onError={(e) => (e.target.src = "/default-book.jpg")}
                alt={book.title}
                className="h-48 w-full object-cover rounded-xl mb-4 shadow-sm"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">
                  {book.title}
                </h2>
                <p className="text-sm text-gray-500">by {book.author}</p>
                <p className="mt-2 text-lg font-medium text-purple-700">
                  {book.isFree ? "Free" : `$${book.price}`}
                </p>
              </div>

              {user && book.listedBy === user._id && (
                <div
                  className="mt-4 flex gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => navigate(`/books/edit/${book._id}`)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-10 space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-5 py-2 rounded-xl border bg-white shadow hover:bg-gray-100 disabled:opacity-40"
          disabled={page === 1}
        >
          ⬅ Prev
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-5 py-2 rounded-xl border bg-white shadow hover:bg-gray-100 disabled:opacity-40"
          disabled={books.length < 10}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default Books;
