import {
  Menu,
  Search,
  Plus,
  Bell,
  LogOut,
  X
} from "lucide-react";
import "./components.css";

function Navbar({
  user,
  onLogout,
  title = "Dashboard",
  subtitle = "Manage and track your tasks effortlessly",
  search = "",
  onSearchChange,
  onOpenTaskModal,
  onNewTask,
  onToggleSidebar,
  pendingCount = 0
}) {
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

  const handleCreateTask = () => {
    if (onOpenTaskModal) {
      onOpenTaskModal();
    } else if (onNewTask) {
      onNewTask();
    }
  };

  const handleInputChange = (e) => {
    if (!onSearchChange) return;
    onSearchChange(e.target.value);
  };

  const handleClearSearch = () => {
    if (!onSearchChange) return;
    onSearchChange("");
  };

  const getUserInitial = (name) => {
    if (!name || typeof name !== "string") return "U";
    const trimmed = name.trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : "U";
  };

  return (
    <header className="tf-navbar">
      {/* Left section: Hamburger button & Page Title */}
      <div className="tf-navbar-left">
        {onToggleSidebar && (
          <button
            type="button"
            className="tf-navbar-menu-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>
        )}

        <div className="tf-navbar-title-wrap">
          <h1>{title}</h1>
          {subtitle && <p className="tf-navbar-subtitle">{subtitle}</p>}
        </div>
      </div>

      {/* Center section: Live Search */}
      {typeof onSearchChange === "function" && (
        <div className="tf-navbar-center">
          <div className="tf-navbar-search-box">
            <Search className="tf-navbar-search-icon" size={17} />
            <input
              type="text"
              className="tf-navbar-search-input"
              placeholder="Search tasks by title..."
              value={search}
              onChange={handleInputChange}
            />
            {search && (
              <button
                type="button"
                className="tf-navbar-search-clear"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Right section: New Task action, notifications, and user profile */}
      <div className="tf-navbar-right">
        {(onOpenTaskModal || onNewTask) && (
          <button
            type="button"
            className="tf-navbar-btn-primary"
            onClick={handleCreateTask}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>New Task</span>
          </button>
        )}

        {/* Activity / notification icon */}
        <div className="tf-navbar-icon-btn" title="Pending tasks alert">
          <Bell size={18} />
          {pendingCount > 0 && <span className="tf-navbar-badge-dot" />}
        </div>

        {/* User profile capsule */}
        <div className="tf-navbar-user">
          <div className="tf-navbar-user-avatar">
            {getUserInitial(currentUser?.name)}
          </div>
          <div className="tf-navbar-user-details">
            <span className="tf-navbar-user-name">
              {currentUser?.name || "User"}
            </span>
            <span className="tf-navbar-user-role">
              {currentUser?.email || "TaskFlow Pro"}
            </span>
          </div>
        </div>

        {/* Quick Logout button */}
        <button
          type="button"
          className="tf-navbar-logout-btn"
          onClick={handleLogout}
          title="Sign out of your account"
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export { Navbar };
export default Navbar;
