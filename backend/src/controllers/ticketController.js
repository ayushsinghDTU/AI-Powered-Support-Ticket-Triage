const { createTicketFromMessage, listTickets } = require("../services/ticketService");

function analyzeTicket(req, res, next) {
  try {
    const { message } = req.body || {};

    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required and cannot be empty." });
    }

    const created = createTicketFromMessage(message.trim());

    return res.status(201).json({
      category: created.category,
      priority: created.priority,
      urgency: created.urgency,
      keywords: created.keywords,
      confidence: created.confidence
    });
  } catch (error) {
    return next(error);
  }
}

function getAllTickets(req, res, next) {
  try {
    const tickets = listTickets();
    return res.status(200).json(tickets);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  analyzeTicket,
  getAllTickets
};
