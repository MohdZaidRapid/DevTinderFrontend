import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../lib/axios";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        setError("Failed to fetch book");
      }
    };

    fetchBook();
  }, [id]);

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
    </div>
  );
};

export default BookDetails;
