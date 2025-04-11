import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../lib/axios";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`/books/${id}`);
        setBook(res.data);

        // Check if the current user is the book owner
        // This assumes you have the user info stored somewhere (e.g., in context or local storage)
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser && currentUser._id === res.data.listedBy._id) {
          setIsOwner(true);
        }
      } catch (err) {
        setError("Failed to fetch book");
      }
    };

    fetchBook();
  }, [id]);

  const handleViewMessages = () => {
    navigate(`/books/${id}/messages`);
  };

  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (!book) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <img
        src={book.image}
        alt={book.title}
        className="h-60 object-contain mb-4"
      />
      <h1 className="text-3xl font-bold">{book.title}</h1>
      <p className="text-gray-600">By {book.author}</p>
      <p className="mt-4">{book.description}</p>
      <p className="mt-4">{book.isFree ? "Free" : `$${book.price}`}</p>

      {isOwner && (
        <div className="mt-6">
          <button
            onClick={handleViewMessages}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View All Messages
          </button>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
