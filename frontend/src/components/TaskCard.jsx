import {
  CheckCircle2,
  Circle,
  Calendar,
  Tag,
  AlertCircle,
  Clock,
  Pencil,
  Trash2,
  Check
} from "lucide-react";
import "./components.css";

function TaskCard({
  task = {},
  onComplete,
  onToggleComplete,
  onEdit,
  onDelete
}) {
  const isCompleted = task.status === "Completed";

  const handleToggle = () => {
    if (onComplete) {
      onComplete(task);
    } else if (onToggleComplete) {
      onToggleComplete(task);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
    }
  };

  const handleDelete = () => {
    if (!onDelete) return;
    const id = task._id || task.id;
    onDelete(id, task);
  };

  // Due date formatting and overdue check
  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const target = new Date(date);
      target.setHours(0, 0, 0, 0);

      const isOverdue = target < today && !isCompleted;

      return {
        text: date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric"
        }),
        isOverdue
      };
    } catch {
      return null;
    }
  };

  const dueInfo = formatDueDate(task.dueDate);

  // Priority badge styling
  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "tf-badge-priority-high";
      case "low":
        return "tf-badge-priority-low";
      case "medium":
      default:
        return "tf-badge-priority-medium";
    }
  };

  // Status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "tf-badge-status-completed";
      case "in progress":
        return "tf-badge-status-in-progress";
      case "pending":
      default:
        return "tf-badge-status-pending";
    }
  };

  return (
    <article
      className={`task-card tf-task-card ${
        isCompleted ? "tf-task-card-completed" : ""
      }`}
    >
      <div className="tf-task-main">
        {/* Quick Complete Icon Button */}
        {(onComplete || onToggleComplete) && (
          <button
            type="button"
            className={`tf-task-check-btn ${isCompleted ? "checked" : ""}`}
            onClick={handleToggle}
            aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
            title={isCompleted ? "Mark as pending" : "Mark as completed"}
          >
            {isCompleted ? (
              <CheckCircle2 size={22} />
            ) : (
              <Circle size={22} />
            )}
          </button>
        )}

        <div className="tf-task-body">
          <div className="tf-task-header-line">
            <h3 className="tf-task-title">{task.title || "Untitled Task"}</h3>
          </div>

          {task.description && (
            <p className="tf-task-desc">{task.description}</p>
          )}

          {/* Badges / Metadata row */}
          <div className="tf-task-badges">
            {/* Category */}
            <span className="tf-badge tf-badge-category">
              <Tag size={12} />
              <span>{task.category || "Personal"}</span>
            </span>

            {/* Priority */}
            <span
              className={`tf-badge ${getPriorityBadgeClass(task.priority)}`}
            >
              {task.priority === "High" ? (
                <AlertCircle size={12} />
              ) : (
                <Clock size={12} />
              )}
              <span>{task.priority || "Medium"}</span>
            </span>

            {/* Status */}
            <span className={`tf-badge ${getStatusBadgeClass(task.status)}`}>
              {isCompleted ? (
                <Check size={12} />
              ) : (
                <Circle size={10} fill="currentColor" />
              )}
              <span>{task.status || "Pending"}</span>
            </span>

            {/* Due date */}
            {dueInfo && (
              <span
                className={`tf-badge ${
                  dueInfo.isOverdue ? "tf-badge-overdue" : "tf-badge-due"
                }`}
              >
                <Calendar size={12} />
                <span>
                  {dueInfo.text} {dueInfo.isOverdue ? "(Overdue)" : ""}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="task-actions tf-task-actions">
        {(onComplete || onToggleComplete) && (
          <button
            type="button"
            className={`tf-btn-action ${
              isCompleted ? "tf-btn-action-undo" : "tf-btn-action-complete"
            }`}
            onClick={handleToggle}
          >
            {isCompleted ? "Undo" : "Complete"}
          </button>
        )}

        {onEdit && (
          <button
            type="button"
            className="tf-btn-action tf-btn-action-edit"
            onClick={handleEdit}
            title="Edit task"
          >
            <Pencil size={13} />
            <span>Edit</span>
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            className="tf-btn-action tf-btn-action-delete"
            onClick={handleDelete}
            title="Delete task"
          >
            <Trash2 size={13} />
            <span>Delete</span>
          </button>
        )}
      </div>
    </article>
  );
}

export { TaskCard };
export default TaskCard;
