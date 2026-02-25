import { useEffect, useState } from "react";
import { analyzeTicket, fetchTickets } from "./api";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadTickets() {
    try {
      const data = await fetchTickets();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }

    try {
      setLoading(true);
      const data = await analyzeTicket(message.trim());
      setResult(data);
      setMessage("");
      await loadTickets();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>AI-Powered Support Ticket Triage</h1>

      <form onSubmit={handleSubmit} className="card">
        <label htmlFor="message">Ticket Message</label>
        <textarea
          id="message"
          rows="5"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the issue..."
        />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Ticket"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <section className="card">
          <h2>Latest Result</h2>
          <p><strong>Category:</strong> {result.category}</p>
          <p><strong>Priority:</strong> {result.priority}</p>
          <p><strong>Urgency:</strong> {result.urgency ? "Yes" : "No"}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
          <p><strong>Keywords:</strong> {result.keywords.join(", ") || "None"}</p>
        </section>
      )}

      <section className="card">
        <h2>Previous Tickets</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Message</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Urgency</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 && (
              <tr>
                <td colSpan="6">No tickets yet.</td>
              </tr>
            )}
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.message}</td>
                <td>{ticket.category}</td>
                <td>{ticket.priority}</td>
                <td>{ticket.urgency ? "Yes" : "No"}</td>
                <td>{ticket.confidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
