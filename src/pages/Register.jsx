import { useState } from "react";
import axios from "../lib/axios";

// Reusable Input Component
const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required = false,
}) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
    className="w-full p-3 bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-100 
               placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 
               dark:border-neutral-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 
               focus:outline-none transition-all duration-200"
  />
);

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
    city: "",
    area: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/auth/register", formData);
      setSuccess(res.data.msg || "Registered successfully!");
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-neutral-900 shadow-xl rounded-2xl transition-all duration-300">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6">
        📝 Register
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Input
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          required
        />
        <Input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <Input
          name="area"
          placeholder="Area"
          value={formData.area}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
        >
          Register
        </button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm text-center">{success}</p>
        )}
      </form>
    </div>
  );
};

export default Register;
