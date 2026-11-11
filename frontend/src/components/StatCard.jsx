import { isValidElement } from "react";
import {
  ListTodo,
  CheckCircle2,
  Clock,
  AlertCircle,
  CheckSquare,
  TrendingUp
} from "lucide-react";
import "./components.css";

// Helper outside component returning JSX elements safely
function renderStatIcon(title, customIcon) {
  if (customIcon) {
    if (isValidElement(customIcon)) {
      return customIcon;
    }
    const IconComponent = customIcon;
    return <IconComponent size={24} strokeWidth={2.2} />;
  }
  const t = (title || "").toLowerCase();
  if (t.includes("total")) return <ListTodo size={24} strokeWidth={2.2} />;
  if (t.includes("completed") || t.includes("done")) return <CheckCircle2 size={24} strokeWidth={2.2} />;
  if (t.includes("pending") || t.includes("progress")) return <Clock size={24} strokeWidth={2.2} />;
  if (t.includes("high") || t.includes("urgent")) return <AlertCircle size={24} strokeWidth={2.2} />;
  return <CheckSquare size={24} strokeWidth={2.2} />;
}

function getStatVariant(title, variant, color) {
  if (variant || color) return variant || color;
  const t = (title || "").toLowerCase();
  if (t.includes("total")) return "blue";
  if (t.includes("completed") || t.includes("done")) return "green";
  if (t.includes("pending") || t.includes("progress")) return "amber";
  if (t.includes("high") || t.includes("urgent")) return "red";
  return "purple";
}

function StatCard({
  title = "Tasks",
  value = 0,
  icon,
  variant,
  color,
  subtitle,
  description,
  trend,
  onClick,
  isActive = false
}) {
  const activeVariant = getStatVariant(title, variant, color);
  const subtext = subtitle || description;

  const cardClasses = [
    "stat-card",
    "tf-stat-card",
    `tf-stat-${activeVariant}`,
    onClick ? "tf-stat-card-clickable" : "",
    isActive ? "active" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="tf-stat-card-content">
        <h3 className="tf-stat-card-title">{title}</h3>
        <h2 className="tf-stat-card-value">{value}</h2>

        {trend && (
          <div className="tf-stat-card-trend">
            <TrendingUp size={14} />
            <span>{trend}</span>
          </div>
        )}

        {subtext && !trend && (
          <div className="tf-stat-card-trend">
            <span>{subtext}</span>
          </div>
        )}
      </div>

      <div className="tf-stat-icon-wrap">
        {renderStatIcon(title, icon)}
      </div>
    </div>
  );
}

export { StatCard };
export default StatCard;
