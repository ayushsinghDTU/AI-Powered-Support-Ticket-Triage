# AI-Powered Support Ticket Triage

Minimal full-stack project that classifies support tickets using simple keyword-based NLP (no external AI APIs).

## 1. Setup Instructions

### Run with Docker (recommended)
```bash
docker-compose up --build
```

Then open:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

### Run tests
```bash
cd backend
npm install
npm test
```

## 2. Architecture Explanation

- `backend/src/config/rules.js`: Config-driven classification and priority rules.
- `backend/src/analyzer/ticketAnalyzer.js`: Pure keyword analyzer logic.
- `backend/src/services/ticketService.js`: Business flow (analyze + store, list).
- `backend/src/controllers/ticketController.js`: HTTP input/output handling and validation.
- `backend/src/db.js`: SQLite initialization and queries.
- `frontend/src/App.jsx`: Minimal UI for submit + results + history table.
- `frontend/src/api.js`: Fetch API calls.

This keeps concerns separated and easy to explain in interviews.

## 3. Data Model Explanation

SQLite table: `tickets`
- `id` (integer primary key)
- `message` (text)
- `category` (text)
- `priority` (text)
- `urgency` (boolean stored as integer)
- `keywords` (text, comma-separated)
- `confidence` (real)
- `created_at` (timestamp, default current timestamp)

## 4. Classification Approach Explanation

1. Lowercase + tokenize the message.
2. Count matched keywords for each category.
3. Choose highest matched category; if none, use `Other`.
4. Detect urgency via urgency keywords.
5. Assign priority:
   - `Security -> P0`
   - `urgency true -> P1`
   - `Technical -> P1`
   - `Billing -> P2`
   - otherwise `P3`
6. Confidence = `matched_keywords / total_words`, capped at `1.0`, rounded to 2 decimals.

## 5. Custom Rule Rationale

If message contains `security` or `breach`, force:
- `category = Security`
- `priority = P0`
- `confidence = 1.0`

Reason: security incidents are high-risk and time-sensitive, so they must bypass normal scoring and always be escalated immediately.

## 6. Trade-offs

- Pros: very simple, deterministic, explainable, easy to test.
- Cons: keyword logic is brittle and may miss intent or context.

## 7. Limitations

- No stemming/synonym support.
- No typo tolerance.
- Confidence is heuristic, not probabilistic.
- Basic UI and no authentication.

## 8. Improvements With More Time

- Add synonym dictionary and fuzzy matching.
- Add ticket status/assignee fields.
- Add pagination/filtering on ticket list.
- Add integration tests for API endpoints.

## 9. API Summary

### `POST /tickets/analyze`
Request:
```json
{
  "message": "My payment failed and this is urgent"
}
```

Response:
```json
{
  "category": "Billing",
  "priority": "P1",
  "urgency": true,
  "keywords": ["payment", "urgent"],
  "confidence": 0.29
}
```

### `GET /tickets`
Returns saved tickets (latest first).
