# AI Health Chains – Web3 Healthcare Platform

This repository contains a complete sample implementation of a healthcare data
management platform that combines a mock blockchain consent service (Node/Express)
with a React 18 frontend. Patients, consents, transactions, and platform
statistics are sourced from the provided backend API and surfaced through a
MetaMask-enabled UI.

---

## Features

| Area                 | Capability                                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Patients**         | Searchable, paginated grid of patients with wallet info and quick detail navigation.                            |
| **Patient Detail**   | Full demographic profile plus medical record cards with record-type badges and blockchain hashes.               |
| **Consents**         | Status filtering, MetaMask-backed consent creation (message signing), activation controls, and tx hash display. |
| **Transactions**     | Global or wallet-filtered history with formatted amounts, addresses, statuses, and block info.                  |
| **Stats Dashboard**  | Responsive grid highlighting total patients, records, consents, and blockchain transaction volume.              |
| **Web3 Integration** | `useWeb3` hook for MetaMask connection, signer access, and message signing across the app.                      |

---

## Project Layout

```
.
├── backend/            # Node/Express mock backend (patients, consents, records, txs, stats)
├── frontend/           # React application (feature folders per domain)
│   └── src/
│       ├── components/
│       │   ├── consents/
│       │   ├── patients/
│       │   ├── statistics/
│       │   └── transactions/
│       ├── hooks/useWeb3.js
│       └── services/apiService.js
├── eslint.config.cjs   # Root ESLint configuration (flat config)
├── package.json        # Root scripts (dev/lint/format)
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+ (tested with v20+)
- npm 9+
- MetaMask browser extension (or another injected Ethereum provider)

### Installation

```bash
# Install everything (root, backend, frontend)
npm run install-all
```

You can also install each workspace manually (`npm install`, `cd backend && npm install`,
`cd frontend && npm install`) if preferred.

---

## Running the App

### Backend (mock API @ http://localhost:3001)

```bash
cd backend
npm start
```

> The backend port was moved to **3001** to avoid clashes with other local
> services. The frontend consumes `http://localhost:3001/api` via
> `REACT_APP_API_URL`.

### Frontend (React @ http://localhost:3000)

```bash
cd frontend
npm start
```

### Combined Dev Mode

```bash
npm run dev   # starts backend + frontend together via concurrently
```

---

## Root Scripts

| Command            | Description                           |
| ------------------ | ------------------------------------- |
| `npm run backend`  | Runs the Express API only.            |
| `npm run frontend` | Runs the React dev server only.       |
| `npm run dev`      | Starts both servers concurrently.     |
| `npm run lint`     | ESLint (flat config) across the repo. |
| `npm run lint:fix` | ESLint with `--fix`.                  |
| `npm run format`   | Prettier (`**/*.js,jsx,json,css,md`). |

### Frontend-only Scripts

Inside `frontend/` you can still run:

| Command                              | Description                      |
| ------------------------------------ | -------------------------------- |
| `npm start`, `npm build`, `npm test` | Standard CRA scripts.            |
| `npm run lint`, `npm run format`     | Scoped to the React source tree. |

---

## API Surface (summary)

The Express API exposes REST endpoints under `http://localhost:3001/api`.

| Endpoint                                    | Purpose                                                |
| ------------------------------------------- | ------------------------------------------------------ |
| `GET /api/health`                           | Health check.                                          |
| `GET /api/patients?page&limit&search`       | Paginated patient list.                                |
| `GET /api/patients/:id`                     | Patient profile.                                       |
| `GET /api/patients/:id/records`             | Medical records for a patient.                         |
| `GET /api/consents?patientId&status`        | Consent list with optional status filtering.           |
| `POST /api/consents`                        | Create new consent (wallet/signature required).        |
| `PATCH /api/consents/:id`                   | Update consent status + blockchain tx hash.            |
| `GET /api/transactions?walletAddress&limit` | Blockchain transaction history.                        |
| `GET /api/stats`                            | Dashboard metrics.                                     |
| `POST /api/verify-signature`                | Signature verification mock (not used directly by UI). |

Data comes from `backend/data/mockData.js`, making it deterministic for demos.

---

## MetaMask & Web3

The shared `useWeb3` hook handles:

- Connecting/disconnecting MetaMask (`connectWallet`, `disconnectWallet`)
- Tracking `account`, `isConnected`, provider, and signer
- `signMessage(message)` for consent creation flows

Consent creation only succeeds when a wallet is connected. The UI guides the
user through connection, signing `"I consent to: {purpose} for patient: {patientId}"`,
and persists the resulting signature + wallet address via the backend.

---

## Linting & Formatting

- **ESLint**: configured via `eslint.config.cjs` (flat config) with React, hooks,
  accessibility, and Prettier integration.
- **Prettier**: project-wide rules (`frontend/.prettierrc.json`) and `npm run format`.
- PropTypes are defined for all React components to satisfy stricter lint rules.

Run from the repo root:

```bash
npm run lint
npm run format
```

---

## Folder Organization (Frontend)

- `components/consents`: Consent management UI + cards
- `components/patients`: Patient list, detail, pagination controls
- `components/statistics`: Stats dashboard + card component
- `components/transactions`: Transaction history + card component
- `components/wallet-connection`: Header wallet controls
- `hooks/useWeb3.js`: MetaMask integration logic
- `services/apiService.js`: Axios REST client (base URL respects `REACT_APP_API_URL`)

Each feature folder co-locates CSS, child components, and domain-specific logic
to mirror scalable monorepo patterns.

---

## Testing Checklist

1. Start backend (`npm run backend`) and verify `http://localhost:3001/api/health`.
2. Launch frontend (`npm run frontend`) and open `http://localhost:3000`.
3. Navigate tabs:
   - **Patients**: search, pagination, detail navigation.
   - **Consents**: switch filters, create consent with MetaMask, activate pending consent.
   - **Transactions**: toggle wallet filter (connect MetaMask for personal history).
   - **Statistics**: confirm metrics match backend dataset.
4. Run `npm run lint` and `npm run format` to ensure code quality gates pass.

---

## Notes

- Backend code is left untouched to reflect the original assessment constraint.
- Frontend uses only project dependencies (no additional UI libraries were introduced).
- Node modules are intentionally ignored; ensure they’re not committed.

---

## License

MIT © AI Health Chains – 2024. Use freely for evaluation, learning, or reference. If
you extend this project, please mention the original source.
