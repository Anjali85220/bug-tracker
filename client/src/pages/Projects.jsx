import { useEffect, useState } from "react";
import axios from "axios";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", members: "" });

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
      await axios.post("http://localhost:5000/api/projects", {
        ...form,
        teamMembers: form.members.split(",").map((m) => m.trim()),
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
      <h2 className="text-3xl font-bold mb-6">Projects</h2>

      {/* New Project Form */}
      <div className="bg-white shadow-md rounded-lg p-5 mb-10 max-w-2xl">
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
          placeholder="Team Members (comma-separated emails)"
          value={form.members}
          onChange={(e) => setForm({ ...form, members: e.target.value })}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleCreate}
        >
          Create Project
        </button>
      </div>

      {/* Project Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project._id} className="bg-white p-5 rounded shadow-md">
            <h4 className="text-xl font-bold text-blue-700">{project.title}</h4>
            <p className="text-gray-600 text-sm mb-3">{project.description}</p>
            <div className="mb-3">
              {project.teamMembers.map((member, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 mr-1 mb-1 rounded-full"
                >
                  {member}
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
  );
}
