import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DashboardLayout from "../components/DashboardLayout";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assignee: "",
    search: "",
  });

  const fetchProjects = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  }, []);

  const fetchTickets = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const allTickets = [];

      for (const proj of projects) {
        const res = await axios.get(
          `http://localhost:5000/api/tickets/project/${proj._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const ticketsWithProject = res.data.map((ticket) => ({
          ...ticket,
          projectName: proj.title || "Untitled Project",
        }));

        allTickets.push(...ticketsWithProject);
      }

      setTickets(allTickets);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    }
  }, [projects]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (projects.length > 0) fetchTickets();
  }, [projects, fetchTickets]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const updatedTickets = tickets.map((ticket) =>
      ticket._id === draggableId
        ? { ...ticket, status: destination.droppableId }
        : ticket
    );
    setTickets(updatedTickets);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/tickets/${draggableId}`,
        { status: destination.droppableId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Failed to update ticket status", err);
    }
  };

  const statuses = ["Open", "In Progress", "Closed"];

  const uniqueAssignees = [
    ...new Set(tickets.map((t) => t.assignee?.name || t.assignee).filter(Boolean)),
  ];

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus =
      !filters.status || ticket.status === filters.status;
    const matchesPriority =
      !filters.priority || ticket.priority === filters.priority;
    const matchesAssignee =
      !filters.assignee ||
      ticket.assignee === filters.assignee ||
      ticket.assignee?.name === filters.assignee;
    const matchesSearch =
      !filters.search ||
      ticket.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(filters.search.toLowerCase());

    return (
      matchesStatus && matchesPriority && matchesAssignee && matchesSearch
    );
  });

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome to the Dashboard
      </h1>
      <p className="text-gray-600 mb-8">
        Use the sidebar to navigate to your projects and tickets.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search tickets..."
          className="border rounded px-3 py-2 text-sm"
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />

        <select
          className="border rounded px-3 py-2 text-sm"
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2 text-sm"
          value={filters.priority}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, priority: e.target.value }))
          }
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>

        <select
          className="border rounded px-3 py-2 text-sm"
          value={filters.assignee}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, assignee: e.target.value }))
          }
        >
          <option value="">All Assignees</option>
          {uniqueAssignees.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {/* Kanban Board */}
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Kanban Board</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  className="bg-gray-100 rounded-lg p-4 min-h-[300px]"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3 className="text-lg font-semibold mb-2">{status}</h3>
                  {filteredTickets
                    .filter((ticket) => ticket.status === status)
                    .map((ticket, index) => (
                      <Draggable
                        draggableId={ticket._id}
                        index={index}
                        key={ticket._id}
                      >
                        {(provided) => (
                          <div
                            className="bg-white rounded p-3 mb-3 shadow-md"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <p className="font-bold text-sm">{ticket.title}</p>
                            <p className="text-xs text-gray-600">
                              Priority: {ticket.priority}
                            </p>
                            {ticket.assignee && (
                              <p className="text-xs text-gray-600">
                                Assigned to:{" "}
                                {ticket.assignee.name || ticket.assignee}
                              </p>
                            )}
                            <p className="text-xs italic text-gray-500 mt-1">
                              Project: {ticket.projectName}
                            </p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </DashboardLayout>
  );
}
