const express = require("express");
const cors = require("cors");
const { analyzeTicket, getAllTickets } = require("./controllers/ticketController");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/tickets/analyze", analyzeTicket);
app.get("/tickets", getAllTickets);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

module.exports = app;
