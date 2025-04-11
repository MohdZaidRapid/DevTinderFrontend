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
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white dark:bg-neutral-900 shadow-xl rounded-2xl transition-all duration-300">
      <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6 text-center">
        📚 Add a New Book
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <Input
            label="Author"
            name="author"
            value={form.author}
            onChange={handleChange}
            required
          />
        </div>

        <Textarea
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <Input
          label="Image URL"
          name="image"
          value={form.image}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            disabled={form.isFree}
          />

          <Select
            label="Condition"
            name="condition"
            value={form.condition}
            onChange={handleChange}
            required
            options={[
              { value: "", label: "Select Condition" },
              { value: "new", label: "New" },
              { value: "used", label: "Used" },
            ]}
          />
        </div>

        <Checkbox
          label="Is this book free?"
          name="isFree"
          checked={form.isFree}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Country"
            name="country"
            value={form.country}
            onChange={handleChange}
          />
          <Input
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
          />
          <Input
            label="Area"
            name="area"
            value={form.area}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-all duration-200"
        >
          ➕ Add Book
        </button>
      </form>
    </div>
  );
};

// Reusable Input Component
const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <input
      {...props}
      className="bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                 border border-gray-300 dark:border-neutral-700 p-2 rounded-lg shadow-sm 
                 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-200"
    />
  </div>
);

// Reusable Textarea Component
const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <textarea
      {...props}
      rows={4}
      className="bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                 border border-gray-300 dark:border-neutral-700 p-2 rounded-lg shadow-sm 
                 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-200"
    />
  </div>
);

// Reusable Select Component
const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col">
    <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <select
      {...props}
      className="bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-100 
                 border border-gray-300 dark:border-neutral-700 p-2 rounded-lg shadow-sm 
                 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-200"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// Reusable Checkbox Component
const Checkbox = ({ label, ...props }) => (
  <label className="flex items-center space-x-3 font-medium text-gray-700 dark:text-gray-300">
    <input type="checkbox" className="accent-green-600" {...props} />
    <span>{label}</span>
  </label>
);

export default AddBook;
