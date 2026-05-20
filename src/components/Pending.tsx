import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Call { id: string; customerName: string; accountNumber: string; contactNumber: string; purpose: string; remarks: string; status: string; followUpDate: string; createdAt: string; }
interface Task { id: string; task: string; status: string; createdAt: string; }
interface Props { userId: string; }

export default function Pending({ userId }: Props) {
  const [pendingCalls, setPendingCalls] = useState<Call[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);

  const fetchPending = async () => {
    const callsQ = query(collection(db, "calls"), where("userId", "==", userId), where("status", "in", ["Pending", "Follow-up"]));
    const callsSnap = await getDocs(callsQ);
    setPendingCalls(callsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Call)));

    const tasksQ = query(collection(db, "tasks"), where("userId", "==", userId), where("status", "==", "Pending"));
    const tasksSnap = await getDocs(tasksQ);
    setPendingTasks(tasksSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Task)));
  };

  useEffect(() => { fetchPending(); }, []);

  return (
    <div>
      <h1 className="page-title">⏰ Pending Works</h1>
      <div className="card">
        <h3>📞 Pending & Follow-up Calls ({pendingCalls.length})</h3>
        {pendingCalls.length === 0 ? <p className="empty-msg">No pending calls. All clear! ✅</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Customer</th><th>Account No.</th><th>Contact</th><th>Purpose</th><th>Remarks</th><th>Status</th><th>Follow-up Date</th></tr></thead>
              <tbody>
                {pendingCalls.map((c) => (
                  <tr key={c.id}>
                    <td>{c.customerName}</td><td>{c.accountNumber}</td><td>{c.contactNumber}</td><td>{c.purpose}</td><td>{c.remarks || "—"}</td>
                    <td><span className={`badge badge-${c.status.toLowerCase().replace("-", "")}`}>{c.status}</span></td>
                    <td>{c.followUpDate || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card">
        <h3>✅ Pending Tasks ({pendingTasks.length})</h3>
        {pendingTasks.length === 0 ? <p className="empty-msg">No pending tasks. Great job! 🎉</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Task</th><th>Date Added</th></tr></thead>
              <tbody>
                {pendingTasks.map((t) => (
                  <tr key={t.id}>
                    <td>{t.task}</td>
                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}