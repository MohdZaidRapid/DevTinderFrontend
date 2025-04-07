import { useState } from "react";
import axios from "../lib/axios";

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
      const res = await axios.post("api/auth/register", formData);
      setSuccess(res.data.msg || "Registered successfully!");
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Register</h2>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        name="country"
        value={formData.country}
        onChange={handleChange}
        placeholder="Country"
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        name="city"
        value={formData.city}
        onChange={handleChange}
        placeholder="City"
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        name="area"
        value={formData.area}
        onChange={handleChange}
        placeholder="Area"
        className="w-full p-2 border rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Register
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </form>
  );
};

export default Register;
