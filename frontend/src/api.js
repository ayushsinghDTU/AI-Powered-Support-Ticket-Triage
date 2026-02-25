const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function analyzeTicket(message) {
  const response = await fetch(`${API_BASE_URL}/tickets/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Failed to analyze ticket.");
  }

  return response.json();
}

export async function fetchTickets() {
  const response = await fetch(`${API_BASE_URL}/tickets`);
  if (!response.ok) {
    throw new Error("Failed to fetch tickets.");
  }
  return response.json();
}
