import {
  CheckSquare,
  ListTodo,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  LogOut,
  X
} from "lucide-react";
import "./components.css";

function Sidebar({
  activeFilter = "All",
  onSelectFilter,
  stats = { total: 0, pending: 0, completed: 0, highPriority: 0 },
  user,
  onLogout,
  isOpen = false,
  onClose,
  onOpenNewTask
}) {
  // Defensive local storage user parsing
  const currentUser = user || (() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw || raw === "undefined" || raw === "null") return {};
      const parsed = JSON.parse(raw);
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  })();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  const navItems = [
    {
      id: "All",
      label: "All Tasks",
      icon: ListTodo,
      count: stats?.total ?? 0
    },
    {
      id: "Pending",
      label: "Pending",
      icon: Clock,
      count: stats?.pending ?? 0
    },
    {
      id: "Completed",
      label: "Completed",
      icon: CheckCircle2,
      count: stats?.completed ?? 0
    },
    {
      id: "High",
      label: "High Priority",
      icon: AlertCircle,
      count: stats?.highPriority ?? 0
    }
  ];

  const categories = [
    { id: "Personal", label: "Personal", dotClass: "tf-dot-personal" },
    { id: "Work", label: "Work", dotClass: "tf-dot-work" },
    { id: "Study", label: "Study", dotClass: "tf-dot-study" },
    { id: "Development", label: "Development", dotClass: "tf-dot-dev" }
  ];

  const handleItemClick = (id) => {
    if (onSelectFilter) {
      onSelectFilter(id);
    }
    if (onClose) {
      onClose();
    }
  };

  const getUserInitial = (name) => {
    if (!name || typeof name !== "string") return "U";
    const trimmed = name.trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="tf-sidebar-wrapper">
      {/* Mobile overlay backdrop */}
      <div
        className={`tf-sidebar-backdrop ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`tf-sidebar ${isOpen ? "open" : ""}`}>
        <div>
          {/* Brand header */}
          <div className="tf-sidebar-brand">
            <div className="tf-sidebar-logo">
              <div className="tf-logo-icon">
                <CheckSquare size={22} strokeWidth={2.5} />
              </div>
              <span className="tf-logo-text">TaskFlow</span>
              <span className="tf-logo-badge">PRO</span>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              className="tf-sidebar-close-btn"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Add Task button */}
          {onOpenNewTask && (
            <button
              type="button"
              className="tf-sidebar-new-btn"
              onClick={() => {
                onOpenNewTask();
                if (onClose) onClose();
              }}
            >
              <Plus size={18} />
              <span>Create New Task</span>
            </button>
          )}

          {/* Main Navigation Views */}
          <div className="tf-sidebar-nav-group">
            <div className="tf-sidebar-heading">Views</div>
            <ul className="tf-sidebar-nav-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeFilter === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`tf-sidebar-nav-item ${isActive ? "active" : ""}`}
                      onClick={() => handleItemClick(item.id)}
                    >
                      <div className="tf-sidebar-nav-item-left">
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </div>
                      {typeof item.count === "number" && (
                        <span className="tf-sidebar-badge">{item.count}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Categories Section */}
          <div className="tf-sidebar-nav-group">
            <div className="tf-sidebar-heading">Categories</div>
            <ul className="tf-sidebar-nav-list">
              {categories.map((cat) => {
                const isActive = activeFilter === cat.id;
                return (
                  <li key={cat.id}>
                    <button
                      type="button"
                      className={`tf-sidebar-nav-item ${isActive ? "active" : ""}`}
                      onClick={() => handleItemClick(cat.id)}
                    >
                      <div className="tf-sidebar-nav-item-left">
                        <span className={`tf-category-dot ${cat.dotClass}`} />
                        <span>{cat.label}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* User Card & Logout Footer */}
        <div className="tf-sidebar-footer">
          <div className="tf-sidebar-user-card">
            <div className="tf-sidebar-user-info">
              <div className="tf-sidebar-avatar">
                {getUserInitial(currentUser?.name)}
              </div>
              <div className="tf-sidebar-user-meta">
                <div className="tf-sidebar-user-name">
                  {currentUser?.name || "TaskFlow User"}
                </div>
                <div className="tf-sidebar-user-email">
                  {currentUser?.email || "user@taskflow.app"}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="tf-sidebar-logout-btn"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

export { Sidebar };
export default Sidebar;
