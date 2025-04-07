import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Link } from "react-router-dom";

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/books/me");
      setBooks(res.data);
    } catch (err) {
      setError("Failed to fetch your books.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await axios.delete(`/books/${id}`);
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert("Failed to delete book.");
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Listed Books</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : books.length === 0 ? (
        <p>You haven't listed any books yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {books.map((book) => (
            <div key={book._id} className="border p-4 rounded shadow">
              <img
                src={book.image}
                alt={book.title}
                className="h-40 w-full object-contain mb-2"
              />
              <h2 className="text-lg font-semibold">{book.title}</h2>
              <p className="text-sm text-gray-600">by {book.author}</p>
              <p className="text-sm mt-2">
                {book.isFree ? "Free" : `$${book.price}`}
              </p>
              <div className="flex justify-between mt-3 text-sm">
                <Link
                  to={`/books/edit/${book._id}`}
                  className="text-blue-600 underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="text-red-600 underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooks;
