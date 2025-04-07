import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { AuthContext } from "../context/AuthContext";

const AddBook = () => {
  const { user } = useContext(AuthContext);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/books", form);
      navigate("/my-books");
    } catch (err) {
      alert("Failed to create book");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add a New Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          disabled={form.isFree}
        />
        <select
          name="condition"
          value={form.condition}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Condition</option>
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isFree"
            checked={form.isFree}
            onChange={handleChange}
          />
          <span>Is this book free?</span>
        </label>
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="area"
          placeholder="Area"
          value={form.area}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
