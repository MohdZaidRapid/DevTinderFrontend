import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../lib/axios";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    image: "",
    price: "",
    condition: "",
    isFree: false,
    country: "",
    city: "",
    area: "",
  });

  const [loading, setLoading] = useState(true);

  const fetchBook = async () => {
    try {
      const res = await axios.get(`/books/${id}`);
      setForm(res.data);
    } catch (err) {
      alert("Failed to load book details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/books/${id}`, form);
      navigate("/my-books");
    } catch (err) {
      alert("Failed to update book.");
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  if (loading) return <p className="p-6">Loading book...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Edit Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 w-full rounded"
        />
        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="Author"
          className="border p-2 w-full rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 w-full rounded"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="border p-2 w-full rounded"
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="border p-2 w-full rounded"
          type="number"
        />
        <input
          name="condition"
          value={form.condition}
          onChange={handleChange}
          placeholder="Condition"
          className="border p-2 w-full rounded"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isFree"
            checked={form.isFree}
            onChange={handleChange}
          />
          <span className="text-black">Free?</span>
        </label>
        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Country"
          className="border p-2 w-full rounded"
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="border p-2 w-full rounded"
        />
        <input
          name="area"
          value={form.area}
          onChange={handleChange}
          placeholder="Area"
          className="border p-2 w-full rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditBook;
