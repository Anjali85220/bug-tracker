import { useState } from "react";
import API from "../api/api"; // ✅ Make sure path is correct
import { useNavigate } from "react-router-dom";

export default function Login({ setIsLoggedIn }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/auth/login", form); // or your login API
    localStorage.setItem("token", res.data.token);   // ✅ Save token
    setIsLoggedIn(true);
    navigate("/dashboard"); // or wherever you redirect
  } catch (err) {
    alert("Login failed");
  }
};


  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-slate-800 to-slate-900 text-white">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-white/10 text-white placeholder-white"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-white/10 text-white placeholder-white"
          />
          <button
            type="submit"
            className="bg-green-600 w-full py-3 rounded hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
