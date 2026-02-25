const { analyzeTicket } = require("../src/analyzer/ticketAnalyzer");

describe("ticketAnalyzer", () => {
  test("classifies billing message", () => {
    const result = analyzeTicket("I need a refund for this payment.");
    expect(result.category).toBe("Billing");
    expect(result.priority).toBe("P2");
    expect(result.keywords).toEqual(expect.arrayContaining(["refund", "payment"]));
  });

  test("detects urgency keyword", () => {
    const result = analyzeTicket("My app is down, please fix this asap.");
    expect(result.urgency).toBe(true);
    expect(result.priority).toBe("P1");
    expect(result.keywords).toEqual(expect.arrayContaining(["down", "asap"]));
  });

  test("applies security override rule", () => {
    const result = analyzeTicket("Possible security breach in user data.");
    expect(result.category).toBe("Security");
    expect(result.priority).toBe("P0");
    expect(result.confidence).toBe(1);
  });
});
