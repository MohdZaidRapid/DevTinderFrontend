import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/books");
        setBooks(res.data.books || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching books:", err);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <div className="p-6">Loading books...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Browse Books</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="border rounded-lg p-4 hover:shadow-md cursor-pointer"
            onClick={() => navigate(`/books/${book._id}`)}
          >
            {book.image && (
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-48 object-contain mb-3"
              />
            )}
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-gray-600">By {book.author}</p>
            <p className="mt-2">{book.isFree ? "Free" : `$${book.price}`}</p>
            <p className="text-sm text-gray-500 mt-1">
              {book.city}, {book.area}
            </p>
          </div>
        ))}
      </div>

      {books.length === 0 && (
        <p className="text-center text-gray-500">No books available</p>
      )}
    </div>
  );
};

export default BooksList;
