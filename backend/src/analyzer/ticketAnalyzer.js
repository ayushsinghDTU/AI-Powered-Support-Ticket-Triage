const defaultRules = require("../config/rules");

function tokenize(text) {
  return text.toLowerCase().match(/\b[a-z0-9]+\b/g) || [];
}

function toUniqueArray(items) {
  return [...new Set(items)];
}

function calculatePriority(category, urgency, rules) {
  if (category === rules.securityCategory) {
    return rules.priorities.security;
  }
  if (urgency) {
    return rules.priorities.urgent;
  }
  if (rules.priorities.byCategory[category]) {
    return rules.priorities.byCategory[category];
  }
  return rules.priorities.default;
}

function analyzeTicket(message, rules = defaultRules) {
  const words = tokenize(message);
  const wordSet = new Set(words);
  const totalWords = words.length || 1;

  const hasSecurityOverride = rules.securityOverrideKeywords.some((keyword) =>
    wordSet.has(keyword)
  );

  let category = rules.defaultCategory;
  let matchedCategoryKeywords = [];

  if (!hasSecurityOverride) {
    let bestCount = 0;

    for (const [categoryName, categoryKeywords] of Object.entries(rules.categories)) {
      const matched = categoryKeywords.filter((keyword) => wordSet.has(keyword));
      if (matched.length > bestCount) {
        bestCount = matched.length;
        category = categoryName;
        matchedCategoryKeywords = matched;
      }
    }
  } else {
    category = rules.securityCategory;
    matchedCategoryKeywords = rules.securityOverrideKeywords.filter((keyword) =>
      wordSet.has(keyword)
    );
  }

  const matchedUrgencyKeywords = rules.urgencyKeywords.filter((keyword) => wordSet.has(keyword));
  const urgency = matchedUrgencyKeywords.length > 0;

  const allMatchedKeywords = toUniqueArray([
    ...matchedCategoryKeywords,
    ...matchedUrgencyKeywords
  ]);

  const confidence = hasSecurityOverride
    ? 1.0
    : Math.min(allMatchedKeywords.length / totalWords, 1.0);

  return {
    category,
    priority: calculatePriority(category, urgency, rules),
    urgency,
    keywords: allMatchedKeywords,
    confidence: Number(confidence.toFixed(2))
  };
}

module.exports = {
  analyzeTicket
};
