# Edge Light — Backend & Admin API

[![Author](https://img.shields.io/badge/Author-CHAUHANRUDRA24-orange.svg)](https://github.com/CHAUHANRUDRA24)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28.svg)](https://firebase.google.com)
[![Node](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org)

Backend infrastructure, Firestore licensing server, Razorpay payment webhooks, and live Web Admin Dashboard for Edge Light.

---

## 🌟 Capabilities

- **Cloud Firestore Synchronization**: Centralized device registry storing HWID, machine name, install date, and real-time active heartbeats.
- **Automated Razorpay Webhooks**: Automatically approves a device HWID whenever a customer completes a sub-₹100 payment (Monthly ₹29, 3-Month ₹49, Lifetime ₹99).
- **Live Admin Console (`/admin`)**: Real-time interactive dashboard powered by the Firebase JS SDK v10 with instant **Approve**, **Reject**, and **Reset Trial** controls.
- **REST Endpoints**:
  - `GET /api/licenses/verify/:hwid` — Validates device status.
  - `POST /api/licenses/register` — Auto-registers first-run devices.
  - `POST /api/webhooks/razorpay` — Webhook listener for payment capture.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Server
```bash
npm start
```
Open `http://localhost:4000/admin` in your browser to access the Admin Console.

### 4. Deploy to Firebase Hosting
```bash
firebase deploy
```

---

## 👨‍💻 Maintainer & Author

- **GitHub ID**: [CHAUHANRUDRA24](https://github.com/CHAUHANRUDRA24)
- **Email**: [rudrachauhan2475@gmail.com](mailto:rudrachauhan2475@gmail.com)

---

## 📄 License
MIT License © 2026 Edge Light Team
