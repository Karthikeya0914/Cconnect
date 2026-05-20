import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy } from "firebase/firestore";

interface Call {
  id: string;
  customerName: string;
  accountNumber: string;
  contactNumber: string;
  purpose: string;
  remarks: string;
  status: string;
  followUpDate: string;
  createdAt: string;
}

interface Props { userId: string; }

export default function Calls({ userId }: Props) {
  const [calls, setCalls] = useState<Call[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [purpose, setPurpose] = useState("");
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState("Pending");
  const [followUpDate, setFollowUpDate] = useState("");
  const [search, setSearch] = useState("");

  const fetchCalls = async () => {
    const q = query(collection(db, "calls"), where("userId", "==", userId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setCalls(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Call)));
  };

  useEffect(() => { fetchCalls(); }, []);

  const addCall = async () => {
    if (!customerName || !accountNumber || !contactNumber || !purpose) return;
    await addDoc(collection(db, "calls"), { userId, customerName, accountNumber, contactNumber, purpose, remarks, status, followUpDate, createdAt: new Date().toISOString() });
    setCustomerName(""); setAccountNumber(""); setContactNumber(""); setPurpose(""); setRemarks(""); setStatus("Pending"); setFollowUpDate("");
    fetchCalls();
  };

  const deleteCall = async (id: string) => {
    await deleteDoc(doc(db, "calls", id));
    fetchCalls();
  };

  const filtered = calls.filter((c) => c.customerName.toLowerCase().includes(search.toLowerCase()) || c.accountNumber.includes(search));

  return (
    <div>
      <h1 className="page-title">📞 Calls</h1>
      <div className="card">
        <h3>Log a New Call</h3>
        <div className="form-row">
          <input placeholder="Customer Name *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          <input placeholder="Account Number *" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
          <input placeholder="Contact Number *" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
        </div>
        <div className="form-row">
          <input placeholder="Purpose of Call *" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Follow-up">Follow-up</option>
          </select>
          <input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
        </div>
        <div className="form-row">
          <textarea placeholder="Remarks / Notes" rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </div>
        <button className="btn-add" onClick={addCall}>+ Log Call</button>
      </div>
      <div className="card">
        <h3>Call History</h3>
        <div className="form-row" style={{ marginBottom: "1rem" }}>
          <input placeholder="🔍 Search by name or account number" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {filtered.length === 0 ? <p className="empty-msg">No calls logged yet.</p> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Customer</th><th>Account No.</th><th>Contact</th><th>Purpose</th><th>Remarks</th><th>Status</th><th>Follow-up</th><th>Date</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>{c.customerName}</td><td>{c.accountNumber}</td><td>{c.contactNumber}</td><td>{c.purpose}</td><td>{c.remarks || "—"}</td>
                    <td><span className={`badge badge-${c.status.toLowerCase().replace("-", "")}`}>{c.status}</span></td>
                    <td>{c.followUpDate || "—"}</td><td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td><button className="btn-delete" onClick={() => deleteCall(c.id)}>Delete</button></td>
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