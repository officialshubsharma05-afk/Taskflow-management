import { useState, useEffect } from "react";
import {
  X,
  PlusCircle,
  Pencil,
  Calendar,
  Tag,
  AlertCircle,
  AlignLeft,
  Type,
  Check,
  Clock
} from "lucide-react";
import "./components.css";

function getInitialFormData(task) {
  if (!task) {
    return {
      title: "",
      description: "",
      category: "Personal",
      priority: "Medium",
      status: "Pending",
      dueDate: ""
    };
  }

  let formattedDate = "";
  if (task.dueDate) {
    try {
      const d = new Date(task.dueDate);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toISOString().slice(0, 10);
      }
    } catch {
      formattedDate = "";
    }
  }

  return {
    title: task.title || "",
    description: task.description || "",
    category: task.category || "Personal",
    priority: task.priority || "Medium",
    status: task.status || "Pending",
    dueDate: formattedDate
  };
}

function TaskModal({
  isOpen = false,
  onClose,
  onSubmit,
  onSave,
  task = null,
  initialData = null,
  loading = false,
  isSubmitting = false,
  error = ""
}) {
  const activeTask = task || initialData;
  const isEditing = Boolean(activeTask && (activeTask._id || activeTask.id));

  const [form, setForm] = useState(() => getInitialFormData(activeTask));
  const [validationError, setValidationError] = useState("");

  const [prevTask, setPrevTask] = useState(activeTask);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Synchronize form when task or isOpen prop changes
  if (activeTask !== prevTask || isOpen !== prevIsOpen) {
    setPrevTask(activeTask);
    setPrevIsOpen(isOpen);
    setForm(getInitialFormData(activeTask));
    setValidationError("");
  }

  // Handle ESC key to close modal & lock background scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
    if (name === "title" && value.trim()) {
      setValidationError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setValidationError("Please enter a task title.");
      return;
    }

    if (form.title.trim().length < 3) {
      setValidationError("Task title must be at least 3 characters long.");
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      dueDate: form.dueDate || null
    };

    if (isEditing) {
      payload._id = activeTask._id || activeTask.id;
    }

    if (onSubmit) {
      onSubmit(payload);
    } else if (onSave) {
      onSave(payload);
    }
  };

  const isBusy = loading || isSubmitting;
  const displayError = validationError || error;

  return (
    <div
      className="tf-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tf-modal-title"
    >
      <div className="tf-modal">
        {/* Header */}
        <div className="tf-modal-header">
          <div className="tf-modal-title-wrap">
            <div className="tf-modal-icon-badge">
              {isEditing ? <Pencil size={20} /> : <PlusCircle size={20} />}
            </div>
            <div>
              <h2 id="tf-modal-title" className="tf-modal-title">
                {isEditing ? "Edit Task" : "Create New Task"}
              </h2>
              <p className="tf-modal-subtitle">
                {isEditing
                  ? "Update your task details and progress"
                  : "Fill in the information below to schedule a new task"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="tf-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="tf-modal-body">
            {displayError && (
              <div className="tf-modal-error">
                <span>{displayError}</span>
              </div>
            )}

            {/* Task Title */}
            <div className="tf-form-group">
              <label className="tf-form-label" htmlFor="task-title">
                <Type size={14} />
                <span>
                  Task Title <span className="required">*</span>
                </span>
              </label>
              <input
                id="task-title"
                name="title"
                type="text"
                className="tf-form-input"
                placeholder="e.g. Design modern dashboard cards"
                value={form.title}
                onChange={handleChange}
                autoFocus
                required
              />
            </div>

            {/* Task Description */}
            <div className="tf-form-group">
              <label className="tf-form-label" htmlFor="task-description">
                <AlignLeft size={14} />
                <span>Description</span>
              </label>
              <textarea
                id="task-description"
                name="description"
                className="tf-form-textarea"
                placeholder="Provide helpful context, steps, or goals..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* Category & Priority Row */}
            <div className="tf-form-row">
              <div className="tf-form-group">
                <label className="tf-form-label" htmlFor="task-category">
                  <Tag size={14} />
                  <span>Category</span>
                </label>
                <select
                  id="task-category"
                  name="category"
                  className="tf-form-select"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Study">Study</option>
                  <option value="Development">Development</option>
                </select>
              </div>

              <div className="tf-form-group">
                <label className="tf-form-label" htmlFor="task-priority">
                  <AlertCircle size={14} />
                  <span>Priority</span>
                </label>
                <select
                  id="task-priority"
                  name="priority"
                  className="tf-form-select"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Status & Due Date Row */}
            <div className="tf-form-row">
              <div className="tf-form-group">
                <label className="tf-form-label" htmlFor="task-status">
                  <Clock size={14} />
                  <span>Status</span>
                </label>
                <select
                  id="task-status"
                  name="status"
                  className="tf-form-select"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="tf-form-group">
                <label className="tf-form-label" htmlFor="task-duedate">
                  <Calendar size={14} />
                  <span>Due Date</span>
                </label>
                <input
                  id="task-duedate"
                  name="dueDate"
                  type="date"
                  className="tf-form-input"
                  value={form.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="tf-modal-footer">
            <button
              type="button"
              className="tf-btn-secondary"
              onClick={onClose}
              disabled={isBusy}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="tf-btn-primary"
              disabled={isBusy}
            >
              {isBusy ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check size={16} />
                  <span>{isEditing ? "Update Task" : "Create Task"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { TaskModal };
export default TaskModal;
