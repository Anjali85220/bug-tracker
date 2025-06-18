import axios from "axios";

const API = axios.create({
  baseURL: "https://bug-tracker-nb3y.onrender.com/api",
});

// 🔐 Automatically add token to request headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("Token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// PROJECT APIs
const getProjects = () => API.get("/projects");
const getProjectById = (id) => API.get(`/projects/${id}`);
const createProject = (data) => API.post("/projects", data);
const updateProject = (id, data) => API.put(`/projects/${id}`, data);
const deleteProject = (id) => API.delete(`/projects/${id}`);

// TICKET APIs
const createTicket = (data) => API.post("/tickets", data);
const getTicketsByProject = (projectId) =>
  API.get(`/tickets/project/${projectId}`);
const updateTicket = (id, data) => API.put(`/tickets/${id}`, data);
const deleteTicket = (id) => API.delete(`/tickets/${id}`);
const assignTicket = (id, assigneeId) =>
  API.put(`/tickets/${id}/assign`, { assignee: assigneeId });

// AUTH APIs
const login = (data) => API.post("/auth/login", data);
const register = (data) => API.post("/auth/register", data);

// Export
export default API;
export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  createTicket,
  getTicketsByProject,
  updateTicket,
  deleteTicket,
  assignTicket,
  login,
  register,
};
