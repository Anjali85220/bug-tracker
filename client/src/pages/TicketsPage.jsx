import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignee: "",
    projectId: ""
  });
  const [editModal, setEditModal] = useState(null);
  const navigate = useNavigate();

  const fetchComments = async (ticketId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`https://bug-tracker-nb3y.onrender.com/api/comments/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(prev => ({ ...prev, [ticketId]: res.data }));
    } catch (err) {
      console.error("❌ Failed to fetch comments", err.response?.data?.msg || err.message);
    }
  };

  const postComment = async (ticketId) => {
    const text = newComment[ticketId]?.trim();
    if (!text) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://bug-tracker-nb3y.onrender.com/api/comments",
        { ticketId, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment(prev => ({ ...prev, [ticketId]: "" }));
      fetchComments(ticketId);
    } catch (err) {
      console.error("❌ Failed to add comment", err.response?.data?.msg || err.message);
    }
  };

  const fetchTickets = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const allTickets = [];
      for (const proj of projects) {
        const res = await axios.get(`https://bug-tracker-nb3y.onrender.com/api/tickets/project/${proj._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        allTickets.push(...res.data);
      }
      setTickets(allTickets);
    } catch (err) {
      console.error("❌ Failed to fetch tickets", err.response?.data?.msg || err.message);
    }
  }, [projects]);

  const fetchProjects = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://bug-tracker-nb3y.onrender.com/api/projects", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
      if (res.data.length > 0) {
        setForm((prev) => ({ ...prev, projectId: res.data[0]._id }));
      }
    } catch (err) {
      console.error("❌ Failed to fetch projects", err.response?.data?.msg || err.message);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);
  useEffect(() => { if (projects.length > 0) fetchTickets(); }, [projects, fetchTickets]);

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      const ticketData = { ...form, assignee: form.assignee || undefined };
      await axios.post("https://bug-tracker-nb3y.onrender.com/api/tickets", ticketData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm((prev) => ({ ...prev, title: "", description: "", priority: "Medium", assignee: "" }));
      fetchTickets();
    } catch (err) {
      console.error("❌ Error creating ticket", err.response?.data || err.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://bug-tracker-nb3y.onrender.com/api/tickets/${editModal._id}`, {
        title: editModal.title,
        status: editModal.status,
        assignee: editModal.assignee
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditModal(null);
      fetchTickets();
    } catch (err) {
      console.error("❌ Failed to update ticket", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://bug-tracker-nb3y.onrender.com/api/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTickets();
    } catch (err) {
      console.error("❌ Failed to delete ticket", err.response?.data || err.message);
    }
  };

  const selectedProject = projects.find((p) => p._id === form.projectId);

  return (
    <div className="flex flex-col p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Tickets</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={() => navigate("/dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </div>

      <div className="flex gap-6">
        {/* Ticket Form */}
        <div className="w-1/2 space-y-6">
          <select
            className="p-2 border rounded w-full"
            value={form.projectId}
            onChange={(e) => setForm((prev) => ({ ...prev, projectId: e.target.value, assignee: "" }))}
          >
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>{proj.title}</option>
            ))}
          </select>

          <div className="bg-white p-4 rounded shadow">
            <input
              placeholder="Title"
              className="w-full mb-2 p-2 border rounded"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="w-full mb-2 p-2 border rounded"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <select
              className="w-full mb-2 p-2 border rounded"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <select
              className="w-full mb-2 p-2 border rounded"
              value={form.assignee}
              onChange={(e) => setForm({ ...form, assignee: e.target.value })}
            >
              <option value="">-- Select Assignee (Optional) --</option>
              {selectedProject?.teamMembers?.map((member, idx) => (
                <option key={idx} value={member.email}>{member.name}</option>
              ))}
            </select>

            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" onClick={handleCreate}>
              Create Ticket
            </button>
          </div>
        </div>

        {/* Ticket List */}
        <div className="w-1/2 space-y-6 overflow-y-auto max-h-[80vh] pr-2">
          {projects.map((project) => {
            const projectTickets = tickets.filter(ticket => ticket.projectId === project._id);
            if (projectTickets.length === 0) return null;

            return (
              <div key={project._id} className="border border-purple-300 rounded-lg shadow">
                <div className="bg-purple-100 text-purple-800 px-4 py-2 font-semibold text-lg rounded-t-md border-b border-purple-300">
                  {project.title}
                </div>
                <div className="p-4 space-y-4">
                  {projectTickets.map(ticket => (
                    <div key={ticket._id} className="bg-gray-100 p-4 rounded shadow relative">
                      <div className="absolute top-2 right-4 text-xs text-gray-400">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </div>
                      <p className="text-xl font-semibold">{ticket.title}</p>
                      <p className="text-sm text-gray-600">{ticket.description}</p>
                      <p className="text-sm mt-2">
                        <strong>Priority:</strong> {ticket.priority} | <strong>Status:</strong> {ticket.status}
                      </p>
                      <p className="text-sm">
                        <strong>Assignee:</strong>{" "}
                        {project.teamMembers.find((m) => m.email === ticket.assignee)?.name || "Unassigned"}
                      </p>

                      <div className="mt-3 flex gap-2">
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => setEditModal({ ...ticket })}>Edit</button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(ticket._id)}>Delete</button>
                      </div>

                      {/* Comments Section */}
                      <div className="mt-4 border-t pt-3">
                        <h4 className="text-sm font-semibold mb-2">Comments:</h4>
                        <button
                          className="text-blue-600 text-xs underline mb-1"
                          onClick={() => fetchComments(ticket._id)}
                        >
                          Refresh Comments
                        </button>

                        {(comments[ticket._id] || []).map((cmt, idx) => (
                          <div key={idx} className="text-sm bg-white p-2 my-1 rounded shadow">
                            <strong>{cmt.userId?.name || cmt.userId?.email || "User"}:</strong> {cmt.text}
                          </div>
                        ))}

                        <textarea
                          rows={2}
                          placeholder="Add comment..."
                          className="w-full p-2 mt-2 border rounded"
                          value={newComment[ticket._id] || ""}
                          onChange={(e) => setNewComment(prev => ({ ...prev, [ticket._id]: e.target.value }))}
                        />
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded mt-1"
                          onClick={() => postComment(ticket._id)}
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96 shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">Edit Ticket</h2>
            <input
              className="w-full mb-2 p-2 border rounded"
              placeholder="Title"
              value={editModal.title}
              onChange={(e) => setEditModal({ ...editModal, title: e.target.value })}
            />
            <select
              className="w-full mb-2 p-2 border rounded"
              value={editModal.status}
              onChange={(e) => setEditModal({ ...editModal, status: e.target.value })}
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>
            <select
              className="w-full mb-2 p-2 border rounded"
              value={editModal.assignee}
              onChange={(e) => setEditModal({ ...editModal, assignee: e.target.value })}
            >
              <option value="">-- Select Assignee --</option>
              {projects.find((p) => p._id === editModal.projectId)?.teamMembers?.map((member, idx) => (
                <option key={idx} value={member.email}>{member.name}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2 mt-4">
              <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleUpdate}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
