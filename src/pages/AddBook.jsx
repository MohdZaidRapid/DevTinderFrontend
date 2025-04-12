import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { AuthContext } from "../context/AuthContext";

const AddBook = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    condition: "",
    isFree: false,
    country: "",
    city: "",
    area: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // If price is set to 0 or empty and isFree is checked, update isFree
    if (name === "price" && (value === "0" || value === "") && !form.isFree) {
      setForm((prev) => ({ ...prev, isFree: true }));
    }
    // If isFree is checked, set price to 0
    if (name === "isFree" && checked) {
      setForm((prev) => ({ ...prev, price: "0" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();

      // Append all form fields to FormData
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      // Append the image file if exists
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.post("/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/my-books");
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to create book");
    } finally {
      setIsLoading(false);
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

        {/* Image Upload Section */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">
            Book Image
          </label>

          <div className="mt-1 flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              id="book-image"
            />

            <label
              htmlFor="book-image"
              className="cursor-pointer bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700
                        text-gray-800 dark:text-gray-100 py-2 px-4 rounded-lg border border-gray-300 
                        dark:border-neutral-700 transition-all duration-200"
            >
              Select Image
            </label>

            {imagePreview && (
              <button
                type="button"
                onClick={removeImage}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>

          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Book preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>

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
          disabled={isLoading}
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 
                   transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Adding..." : "➕ Add Book"}
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
