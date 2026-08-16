import { Link } from "react-router-dom";
import { User } from "lucide-react";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div dir="ltr" className="dashboard-page">
      <header className="dashboard-header">
        <Link to="/" className="dashboard-logo">
          SHOP
        </Link>
        <div className="dashboard-user">
          <User size={18} />
          <span>Welcome</span>
        </div>
      </header>

      <div className="dashboard-body">
        {/* your design starts from here */}
        <h1>User Dashboard</h1>
        <p>This page is shown after a successful login.</p>
      </div>
    </div>
  );
}
