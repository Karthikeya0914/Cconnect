import { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import Calls from "./Calls";
import Tasks from "./Tasks";
import Pending from "./Pending";

interface Props { user: User; }

export default function Dashboard({ user }: Props) {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="layout">
      <div className="sidebar">
        <h2>🏦 CConnect</h2>
        <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>🏠 Dashboard</button>
        <button className={activeTab === "calls" ? "active" : ""} onClick={() => setActiveTab("calls")}>📞 Calls</button>
        <button className={activeTab === "tasks" ? "active" : ""} onClick={() => setActiveTab("tasks")}>✅ Daily Tasks</button>
        <button className={activeTab === "pending" ? "active" : ""} onClick={() => setActiveTab("pending")}>⏰ Pending Works</button>
        <button className="logout-btn" onClick={() => signOut(auth)}>🚪 Logout</button>
      </div>
      <div className="main-content">
        {activeTab === "dashboard" && (
          <div>
            <h1 className="page-title">Good day, {user.email} 👋</h1>
            <p style={{ color: "#718096", marginBottom: "2rem" }}>Welcome to your CConnect dashboard.</p>
            <div className="stats-row">
              <div className="stat-card">
                <h4>Today's Date</h4>
                <p style={{ fontSize: "1.1rem" }}>{new Date().toDateString()}</p>
              </div>
            </div>
            <div className="card">
              <h3>Quick Navigation</h3>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
                <button className="btn-add" onClick={() => setActiveTab("calls")}>📞 Go to Calls</button>
                <button className="btn-add" onClick={() => setActiveTab("tasks")}>✅ Go to Tasks</button>
                <button className="btn-add" onClick={() => setActiveTab("pending")}>⏰ Go to Pending</button>
              </div>
            </div>
          </div>
        )}
        {activeTab === "calls" && <Calls userId={user.uid} />}
        {activeTab === "tasks" && <Tasks userId={user.uid} />}
        {activeTab === "pending" && <Pending userId={user.uid} />}
      </div>
    </div>
  );
}