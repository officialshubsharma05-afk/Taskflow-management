import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./services/api";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import StatCard from "./components/StatCard";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import { Plus, ListTodo, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import "./App.css";
import "./components/components.css";

function Dashboard() {
  const navigate = useNavigate();

  const user = (() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw || raw === "undefined" || raw === "null") return {};
      const parsed = JSON.parse(raw);
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  })();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states for Create & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  // Mobile sidebar drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Search & Filter states
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Fetch logged-in user's tasks
  const fetchTasks = async () => {
    try {
      setError("");
      const response = await API.get("/tasks");
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load tasks from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialTasks = async () => {
      try {
        setError("");
        const response = await API.get("/tasks");
        if (isMounted) {
          setTasks(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message || "Unable to load tasks from server."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInitialTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  // Open modal for new task
  const handleOpenNewTask = () => {
    setEditingTask(null);
    setModalError("");
    setIsModalOpen(true);
  };

  // Open modal for editing task
  const handleEdit = (task) => {
    setEditingTask(task);
    setModalError("");
    setIsModalOpen(true);
  };

  // Save task (create or update) via TaskModal
  const handleSaveTask = async (taskData) => {
    setModalSubmitting(true);
    setModalError("");

    try {
      const payload = {
        title: taskData.title,
        description: taskData.description || "",
        category: taskData.category || "Personal",
        priority: taskData.priority || "Medium",
        status: taskData.status || "Pending",
        dueDate: taskData.dueDate || null
      };

      if (taskData._id) {
        await API.put(`/tasks/${taskData._id}`, payload);
      } else {
        await API.post("/tasks", payload);
      }

      setIsModalOpen(false);
      setEditingTask(null);
      await fetchTasks();
    } catch (err) {
      setModalError(
        err.response?.data?.message || "Unable to save task. Please try again."
      );
    } finally {
      setModalSubmitting(false);
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await API.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete task. Please try again."
      );
    }
  };

  // Toggle task status
  const handleComplete = async (task) => {
    try {
      const nextStatus =
        task.status === "Completed" ? "Pending" : "Completed";

      await API.put(`/tasks/${task._id}`, {
        status: nextStatus
      });

      await fetchTasks();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update task status."
      );
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Defensive metrics computation
  const taskList = Array.isArray(tasks) ? tasks : [];
  const totalCount = taskList.length;
  const completedCount = taskList.filter((t) => t?.status === "Completed").length;
  const pendingCount = taskList.filter((t) => t?.status === "Pending").length;
  const highPriorityCount = taskList.filter((t) => t?.priority === "High").length;

  // Filtered tasks computation
  const filteredTasks = taskList.filter((task) => {
    if (!task) return false;
    const title = task.title || "";
    const desc = task.description || "";
    const searchLower = (search || "").toLowerCase();
    const matchesSearch =
      title.toLowerCase().includes(searchLower) ||
      desc.toLowerCase().includes(searchLower);

    // Sidebar active filter
    let matchesFilter = true;
    if (activeFilter === "Pending") {
      matchesFilter = task.status === "Pending";
    } else if (activeFilter === "Completed") {
      matchesFilter = task.status === "Completed";
    } else if (activeFilter === "High") {
      matchesFilter = task.priority === "High";
    } else if (["Personal", "Work", "Study", "Development"].includes(activeFilter)) {
      matchesFilter = (task.category || "Personal") === activeFilter;
    }

    // Secondary priority filter
    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;

    return matchesSearch && matchesFilter && matchesPriority;
  });

  return (
    <div className="tf-dashboard-layout">
      {/* 1. Sidebar Navigation */}
      <Sidebar
        activeFilter={activeFilter}
        onSelectFilter={(filterId) => setActiveFilter(filterId)}
        stats={{
          total: totalCount,
          pending: pendingCount,
          completed: completedCount,
          highPriority: highPriorityCount
        }}
        user={user}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenNewTask={handleOpenNewTask}
      />

      {/* Main Content Area */}
      <div className="tf-dashboard-main">
        {/* 2. Top Navbar */}
        <Navbar
          user={user}
          title="Task Dashboard"
          subtitle={`Welcome back, ${user.name || "User"}! You have ${pendingCount} pending task${pendingCount === 1 ? "" : "s"}.`}
          search={search}
          onSearchChange={(val) => setSearch(val)}
          onOpenTaskModal={handleOpenNewTask}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          pendingCount={pendingCount}
          onLogout={handleLogout}
        />

        <main className="tf-dashboard-content">
          {/* Global error banner */}
          {error && (
            <div className="tf-modal-error" style={{ marginBottom: "20px" }}>
              <span>{error}</span>
            </div>
          )}

          {/* 3. Stat Cards Section */}
          <section className="tf-dashboard-stats-grid">
            <StatCard
              title="Total Tasks"
              value={totalCount}
              variant="blue"
              icon={ListTodo}
              trend="All registered tasks"
              onClick={() => setActiveFilter("All")}
              isActive={activeFilter === "All"}
            />
            <StatCard
              title="Completed"
              value={completedCount}
              variant="green"
              icon={CheckCircle2}
              trend={
                totalCount > 0
                  ? `${Math.round((completedCount / totalCount) * 100)}% completion rate`
                  : "No tasks yet"
              }
              onClick={() => setActiveFilter("Completed")}
              isActive={activeFilter === "Completed"}
            />
            <StatCard
              title="Pending"
              value={pendingCount}
              variant="amber"
              icon={Clock}
              trend="Requires attention"
              onClick={() => setActiveFilter("Pending")}
              isActive={activeFilter === "Pending"}
            />
            <StatCard
              title="High Priority"
              value={highPriorityCount}
              variant="red"
              icon={AlertCircle}
              trend="Urgent deliverables"
              onClick={() => setActiveFilter("High")}
              isActive={activeFilter === "High"}
            />
          </section>

          {/* 4. Toolbar: Filter indicators & Action */}
          <div className="tf-dashboard-toolbar">
            <div className="tf-toolbar-left">
              <h2 className="tf-toolbar-title">
                {activeFilter === "All"
                  ? "All Tasks"
                  : activeFilter === "High"
                  ? "High Priority Tasks"
                  : `${activeFilter} Tasks`}
              </h2>

              {/* Quick filter pills */}
              <div className="tf-filter-pill-group">
                {["All", "Pending", "Completed"].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={`tf-filter-pill ${activeFilter === filter ? "active" : ""}`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="tf-toolbar-right">
              {/* Secondary Priority Filter */}
              <select
                className="tf-filter-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                aria-label="Filter by priority"
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>

              {/* Primary Add Task Button */}
              <button
                type="button"
                className="tf-btn-primary"
                onClick={handleOpenNewTask}
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* 5. Task List / Loading / Empty States */}
          {loading ? (
            <div className="tf-dashboard-loading">
              <div className="tf-spinner" />
              <span>Loading your tasks...</span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="tf-empty-state">
              <div className="tf-empty-icon">
                <ListTodo size={28} />
              </div>
              <h3 className="tf-empty-title">
                {search ? "No tasks matching your search" : "No tasks found"}
              </h3>
              <p className="tf-empty-text">
                {search
                  ? `No task titles or descriptions match "${search}". Try adjusting your query.`
                  : activeFilter !== "All"
                  ? `There are currently no tasks in the "${activeFilter}" view.`
                  : "Get started by adding your first task to TaskFlow!"}
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginTop: "10px" }}>
                {search && (
                  <button
                    type="button"
                    className="tf-btn-secondary"
                    onClick={() => setSearch("")}
                  >
                    Clear Search
                  </button>
                )}
                {activeFilter !== "All" && (
                  <button
                    type="button"
                    className="tf-btn-secondary"
                    onClick={() => setActiveFilter("All")}
                  >
                    View All Tasks
                  </button>
                )}
                <button
                  type="button"
                  className="tf-btn-primary"
                  onClick={handleOpenNewTask}
                >
                  <Plus size={16} />
                  <span>Create New Task</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="tf-task-list">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onComplete={handleComplete}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 6. Add/Edit Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
          setModalError("");
        }}
        onSubmit={handleSaveTask}
        task={editingTask}
        loading={modalSubmitting}
        error={modalError}
      />
    </div>
  );
}

export default Dashboard;
