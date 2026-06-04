# MoneyMate App

A full-stack money transfer app — sign up, send money to other users, and track your transaction history.

---

## Features

- Sign up / Sign in with JWT auth
- Dashboard showing your balance and all other users
- Send money via modal (no page navigation)
- Transaction history with pagination (7 per page)
- Edit profile (first name, last name, password)
- Logout from profile icon
- Auth guards — signed-in users can't access signin/signup routes

---

## Tech Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | React, Vite, Tailwind CSS     |
| Backend  | Node.js, Express              |
| Database | MongoDB Atlas (Mongoose)      |
| Auth     | JWT                           |

---

## Local Setup

### Prerequisites

- Node.js v18+
- A [MongoDB Atlas](https://cloud.mongodb.com) account with a free cluster

---

### 1. Clone the repo

```bash
git clone <repo-url>
cd MoneyMate
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

Create / update `backend/.env`:

```env
DB_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net"
```

> **Important:** Do not end the URL with a trailing slash.  
> Whitelist your current IP in MongoDB Atlas → Network Access.

Start the backend:

```bash
node index.js
```

Backend runs at `http://localhost:3000`

---

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

### 4. Open the app

Visit `http://localhost:5173` in your browser. Sign up and start transferring money.

---

## Demo Screenshots

### 1. Sign Up
<img src="./screenshots/1.signup.png" width="700">

### 2. Dashboard
<img src="./screenshots/2.dashboard.png" width="700">

### 3. Search Users
<img src="./screenshots/3.searchUsers.png" width="700">

### 4. Send Money
<img src="./screenshots/4.sendMoney.png" width="700">

### 5. Send Money — Confirm
<img src="./screenshots/5.sendMoney2.png" width="700">

### 6. Transaction History
<img src="./screenshots/6.transactionsHistory.png" width="700">

### 7. Transaction Limit (Show More)
<img src="./screenshots/7.LimitedTranscations.png" width="700">

### 8. Received Money
<img src="./screenshots/8.receivedMoney.png" width="700">

### 9. Edit Profile
<img src="./screenshots/9.EditProfile.png" width="700">

### 10. Logout
<img src="./screenshots/10.logout.png" width="700">

### 11. Incorrect Password
<img src="./screenshots/11.incorrectpass.png" width="700">

### 12. Incorrect Username
<img src="./screenshots/12.incorrectusername.png" width="700">

---

## Intial Demo

- Backend completed | [Demo](https://youtu.be/pTencsijI2Q)
