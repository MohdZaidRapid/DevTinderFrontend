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
    price: "",
    condition: "",
    isFree: false,
    country: "",
    city: "",
    area: "",
    image: "", // still used for preview
  });

  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const res = await axios.get(`/books/${id}`);
      setForm(res.data);
      setPreview(res.data.image);
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append all fields to FormData
    for (let key in form) {
      if (key !== "image") {
        formData.append(key, form[key]);
      }
    }

    // Append the new image if selected
    if (file) {
      formData.append("image", file);
    }

    try {
      await axios.put(`/books/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/my-books");
    } catch (err) {
      alert("Failed to update book.");
    }
  };

  if (loading)
    return <p className="p-6 text-center text-slate-500">Loading book...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-10">
        <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">
          Edit Book
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6"
          encType="multipart/form-data"
        >
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="input-box"
          />
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="Author"
            className="input-box"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="input-box h-32 resize-none"
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="input-box"
            type="number"
          />
          <input
            name="condition"
            value={form.condition}
            onChange={handleChange}
            placeholder="Condition"
            className="input-box"
          />

          <label className="flex items-center space-x-3 text-green-700">
            <input
              type="checkbox"
              name="isFree"
              checked={form.isFree}
              onChange={handleChange}
              className="h-5 w-5 text-green-500 accent-green-500"
            />
            <span>Is this book free?</span>
          </label>

          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Country"
            className="input-box"
          />
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className="input-box"
          />
          <input
            name="area"
            value={form.area}
            onChange={handleChange}
            placeholder="Area"
            className="input-box"
          />

          {/* File input for image */}
          <div>
            <label className="block mb-1 text-green-700 font-medium">
              Change Book Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="input-box bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-green-700 file:bg-green-100 hover:file:bg-green-200"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 rounded-lg w-40 h-40 object-cover border border-green-300"
              />
            )}
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition duration-200"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBook;
