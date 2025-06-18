import { useNavigate } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-gray-100 via-white to-gray-200 font-sans">
      {/* Sidebar with glassmorphism effect */}
      <aside className="w-64 bg-[#1e1e2f]/80 backdrop-blur-md text-white p-6 shadow-lg border-r border-white/10 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-extrabold mb-8 text-cyan-400 tracking-wide">
            🐞 Bug Tracker
          </h2>

          <nav className="flex flex-col space-y-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-left px-3 py-2 rounded-lg bg-white/10 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all font-medium"
            >
              🏠 Dashboard
            </button>
            <button
              onClick={() => navigate("/projects")}
              className="text-left px-3 py-2 rounded-lg bg-white/10 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all font-medium"
            >
              📁 Projects
            </button>
            <button
              onClick={() => navigate("/tickets")}
              className="text-left px-3 py-2 rounded-lg bg-white/10 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all font-medium"
            >
              🎟️ Tickets
            </button>
          </nav>
        </div>

        {/* Log Out Button */}
        <div className="mt-10">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-600/30 hover:text-red-200 transition-all font-medium text-red-300"
          >
            🚪 Log Out
          </button>

          <div className="mt-6 text-sm text-gray-300">
            <p className="mb-1">Manage your bug tracking projects efficiently.</p>
            <p className="text-xs text-gray-500 mt-2 italic">Crafted with 💻</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-white/70 rounded-l-3xl shadow-inner backdrop-blur-xl overflow-auto">
        {children}
      </main>
    </div>
  );
}
