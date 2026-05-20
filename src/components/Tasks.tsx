import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, updateDoc } from "firebase/firestore";

interface Task { id: string; task: string; status: string; createdAt: string; }
interface Props { userId: string; }

export default function Tasks({ userId }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState("");

  const fetchTasks = async () => {
    const q = query(collection(db, "tasks"), where("userId", "==", userId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task)));
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async () => {
    if (!task) return;
    await addDoc(collection(db, "tasks"), { userId, task, status: "Pending", createdAt: new Date().toISOString() });
    setTask("");
    fetchTasks();
  };

  const markDone = async (id: string) => {
    await updateDoc(doc(db, "tasks", id), { status: "Completed" });
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
    fetchTasks();
  };

  const pending = tasks.filter((t) => t.status === "Pending");
  const completed = tasks.filter((t) => t.status === "Completed");

  return (
    <div>
      <h1 className="page-title">✅ Daily Tasks</h1>
      <div className="card">
        <h3>Add a New Task</h3>
        <div className="form-row">
          <input placeholder="What do you need to do today? *" value={task} onChange={(e) => setTask(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} />
          <button className="btn-add" onClick={addTask}>+ Add Task</button>
        </div>
      </div>
      <div className="card">
        <h3>⏳ Pending Tasks ({pending.length})</h3>
        {pending.length === 0 ? <p className="empty-msg">No pending tasks. Great job! 🎉</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Task</th><th>Date Added</th><th>Actions</th></tr></thead>
              <tbody>
                {pending.map((t) => (
                  <tr key={t.id}>
                    <td>{t.task}</td>
                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td style={{ display: "flex", gap: "0.5rem" }}>
                      <button className="btn-add" style={{ padding: "0.3rem 0.8rem", fontSize: "0.85rem" }} onClick={() => markDone(t.id)}>✓ Done</button>
                      <button className="btn-delete" onClick={() => deleteTask(t.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card">
        <h3>✅ Completed Tasks ({completed.length})</h3>
        {completed.length === 0 ? <p className="empty-msg">No completed tasks yet.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Task</th><th>Date Added</th><th>Action</th></tr></thead>
              <tbody>
                {completed.map((t) => (
                  <tr key={t.id}>
                    <td style={{ textDecoration: "line-through", color: "#a0aec0" }}>{t.task}</td>
                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td><button className="btn-delete" onClick={() => deleteTask(t.id)}>Delete</button></td>
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