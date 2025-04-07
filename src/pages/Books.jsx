import { useEffect, useState, useContext } from "react";
import axios from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Book Listings</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search books..."
        className="border p-2 rounded mb-4 w-full"
      />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="border rounded p-4 shadow hover:shadow-lg transition"
            >
              <Link to={`/books/${book._id}`}>
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-40 w-full object-contain rounded mb-2"
                />
                <h2 className="text-xl font-semibold">{book.title}</h2>
                <p className="text-sm text-gray-600">by {book.author}</p>
                <p className="mt-2">
                  {book.isFree ? "Free" : `$${book.price}`}
                </p>
              </Link>

              {/* Edit/Delete Buttons */}
              {user && book.listedBy === user._id && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/books/edit/${book._id}`)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 border rounded"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Books;
