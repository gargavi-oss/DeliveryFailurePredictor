export default function AlertBadge({ count, onClick }) {
  return (
    <button className="topbar-btn topbar-notif-btn" onClick={onClick} title="Alerts">
      🔔
      {count > 0 && <span className="topbar-notif-badge">{count}</span>}
    </button>
  );
}
