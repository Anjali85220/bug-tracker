import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow p-4">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">BugTracker</h2>

        <nav className="space-y-4">
          <button
            onClick={() => navigate("/projects")}
            className="w-full text-left text-blue-600 font-semibold hover:underline"
          >
            Projects
          </button>
        </nav>

        <hr className="my-6" />

        <p className="text-sm text-gray-500">Manage your bug tracking projects efficiently.</p>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Dashboard</h1>
        <p className="text-gray-600">
          Use the sidebar to navigate to your projects and start managing bugs effectively.
        </p>
      </main>
    </div>
  );
}
