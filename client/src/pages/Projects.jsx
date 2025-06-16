import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", members: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  const handleCreate = async () => {
    try {
      const teamMembers = form.members.split(",").map((entry) => {
        const [name, email] = entry.split(":").map((v) => v.trim());
        return { name, email };
      });

      await axios.post("http://localhost:5000/api/projects", {
        title: form.title,
        description: form.description,
        teamMembers,
      });

      setForm({ title: "", description: "", members: "" });
      fetchProjects();
    } catch (err) {
      console.error("Failed to create project", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Projects</h2>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={() => navigate("/dashboard")}
        >
          ⬅ Back to Dashboard
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Project Form on the Left */}
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-5">
          <h3 className="text-xl font-semibold mb-4">Create New Project</h3>
          <input
            className="w-full mb-3 p-2 border rounded"
            placeholder="Project Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="w-full mb-3 p-2 border rounded"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="w-full mb-3 p-2 border rounded"
            placeholder="Team Members (e.g. Alice:alice@example.com, Bob:bob@example.com)"
            value={form.members}
            onChange={(e) => setForm({ ...form, members: e.target.value })}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
            onClick={handleCreate}
          >
            Create Project
          </button>
        </div>

        {/* Project List on the Right */}
        <div className="flex-1 grid gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white p-5 rounded shadow-md">
              <h4 className="text-xl font-bold text-blue-700">{project.title}</h4>
              <p className="text-gray-600 text-sm mb-3">{project.description}</p>
              <div className="mb-3">
                {project.teamMembers?.map((member, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 mr-1 mb-1 rounded-full"
                  >
                    {member.name}
                  </span>
                ))}
              </div>
              <button
                className="text-sm text-red-600 hover:underline"
                onClick={() => handleDelete(project._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
