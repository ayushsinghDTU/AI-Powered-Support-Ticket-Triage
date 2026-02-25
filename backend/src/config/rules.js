const rules = {
  categories: {
    Billing: ["payment", "refund", "invoice", "charge"],
    Technical: ["error", "bug", "crash", "down"],
    Account: ["login", "password", "account"],
    "Feature Request": ["feature", "request", "add"]
  },
  defaultCategory: "Other",
  securityCategory: "Security",
  urgencyKeywords: ["urgent", "asap", "immediately", "critical", "down"],
  securityOverrideKeywords: ["security", "breach"],
  priorities: {
    security: "P0",
    urgent: "P1",
    byCategory: {
      Technical: "P1",
      Billing: "P2"
    },
    default: "P3"
  }
};

module.exports = rules;
