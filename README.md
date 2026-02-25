# AI-Powered Support Ticket Triage

## Demo Video
Google Drive link: https://drive.google.com/file/d/1ZD2ZZ4sJV7I-VqmQDI0qUN5UL-K9C7IW/view?usp=sharing

The demo video should clearly show:
- End-to-end workflow (submit ticket -> classification -> saved history)
- Custom Security rule (`P0` override)
- Persistence of analyzed tickets across requests
- Docker-based execution using `docker-compose up --build`

## Quick Start
```bash
docker-compose up --build
```

Then open: `http://localhost:5173`

## Setup and Verification
Backend API runs on: `http://localhost:3000`

Run backend tests:
```bash
cd backend
npm install
npm test
```

## Architecture
- `backend/src/config/rules.js`: Classification keywords and priority rules.
- `backend/src/analyzer/ticketAnalyzer.js`: Core keyword analysis logic.
- `backend/src/services/ticketService.js`: Business flow for analyze + store + list.
- `backend/src/controllers/ticketController.js`: Request validation and API responses.
- `backend/src/db.js`: SQLite initialization and ticket queries.
- `frontend/src/App.jsx`: UI for submission, result display, and history table.
- `frontend/src/api.js`: Frontend API client functions.

## Data Model
SQLite table: `tickets`
- `id` (integer primary key)
- `message` (text)
- `category` (text)
- `priority` (text)
- `urgency` (boolean as integer)
- `keywords` (text, comma-separated)
- `confidence` (real)
- `created_at` (timestamp, default current timestamp)

## Classification Approach
1. Normalize and tokenize input message.
2. Match keywords per category.
3. Select the highest-scoring category, else `Other`.
4. Detect urgency keywords.
5. Assign priority (`Security -> P0`, urgent/technical -> `P1`, billing -> `P2`, else `P3`).
6. Compute confidence as matched keywords / total words (capped at `1.0`, rounded to 2 decimals).

## Customization Twist
A custom override rule is implemented for security-sensitive tickets.

If the message contains `security` or `breach`, the system forces:
- `category = Security`
- `priority = P0`
- `confidence = 1.0`

Rationale:
- Security incidents require immediate escalation regardless of general keyword scoring.
- Forcing `category=Security` prevents misclassification into lower-risk categories.
- Setting `priority=P0` ensures fastest possible response handling.
- Setting `confidence=1.0` explicitly signals deterministic handling for high-risk cases.

## Test Results
Backend unit tests (Jest):
- Test Suites: **1 passed**
- Tests: **3 passed**
- Includes:
  - Billing classification test
  - Urgency detection test
  - Security override test

## API Summary
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
Returns saved tickets in descending order (latest first).
