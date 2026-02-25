const { analyzeTicket } = require("../analyzer/ticketAnalyzer");
const { insertTicket, getTickets } = require("../db");

function createTicketFromMessage(message) {
  const analysis = analyzeTicket(message);

  const id = insertTicket({
    message,
    ...analysis
  });

  return {
    id,
    message,
    ...analysis
  };
}

function listTickets() {
  return getTickets();
}

module.exports = {
  createTicketFromMessage,
  listTickets
};
