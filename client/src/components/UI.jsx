export function Button({ variant = "primary", className = "", ...props }) {
  return <button className={`btn btn-${variant} ${className}`} {...props} />;
}

export function Card({ className = "", children }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </div>
  );
}

export function RuleNote({ children }) {
  return <p className="rule-note">{children}</p>;
}

export function Field({ label, hint, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function Input(props) {
  return <input className={`input ${props.className || ""}`} {...props} />;
}

export function Select({ className = "", children, ...props }) {
  return (
    <select className={`select ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Th({ className = "", children }) {
  return <th className={className}>{children}</th>;
}

export function Td({ className = "", children }) {
  return <td className={className}>{children}</td>;
}

export function EmptyRow({ colSpan, message }) {
  return (
    <tr>
      <td colSpan={colSpan} className="empty-row">
        {message}
      </td>
    </tr>
  );
}

const STATUS_CLASS = {
  Available: "success",
  Open: "warning",
  "On Trip": "accent",
  Dispatched: "accent",
  "In Shop": "warning",
  Draft: "muted",
  Retired: "destructive",
  Cancelled: "destructive",
  Completed: "success",
  Closed: "success",
  "Off Duty": "muted",
  Suspended: "destructive",
};

export function StatusBadge({ status }) {
  const cls = STATUS_CLASS[status] || "muted";
  return <span className={`badge badge-${cls}`}>{status}</span>;
}

export function Modal({ title, subtitle, onClose, wide, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal ${wide ? "modal-wide" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p className="muted">{subtitle}</p>}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
