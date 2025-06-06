import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Welcome to Bug Tracker</h1>
      <div className="space-x-4">
        <button onClick={() => navigate("/register")} className="bg-blue-500 px-6 py-3 rounded shadow-lg hover:bg-blue-600">
          Register
        </button>
        <button onClick={() => navigate("/login")} className="bg-green-500 px-6 py-3 rounded shadow-lg hover:bg-green-600">
          Login
        </button>
      </div>
    </div>
  );
}
