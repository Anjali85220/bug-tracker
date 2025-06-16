import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome to the Dashboard
      </h1>
      <p className="text-gray-600 mb-8">
        Use the sidebar to navigate to your projects and tickets.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate("/projects")}
        >
          <h2 className="text-xl font-semibold text-blue-600 mb-2">Projects</h2>
          <p className="text-gray-600">View and manage all your projects</p>
        </div>

        <div
          className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate("/tickets")}
        >
          <h2 className="text-xl font-semibold text-blue-600 mb-2">Tickets</h2>
          <p className="text-gray-600">Manage all bug tickets</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
