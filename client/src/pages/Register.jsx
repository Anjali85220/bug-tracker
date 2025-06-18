import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("https://bug-tracker-nb3y.onrender.com/api/auth/register", form);
      alert("Registered successfully! Please login.");
      navigate("/login");  // redirect to login page after registration
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-slate-800 to-slate-900 text-white">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-white/10 text-white placeholder-white"
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-white/10 text-white placeholder-white"
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-white/10 text-white placeholder-white"
          />
          <button
            type="submit"
            className="bg-blue-600 w-full py-3 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
