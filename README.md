<div align="center">

  <h1>⚡ Edge Light Backend & Admin API</h1>

  **Centralized Firestore Licensing Server, Razorpay Payment Webhooks & Real-Time Admin Console**

  [![GitHub Stars](https://img.shields.io/github/stars/CHAUHANRUDRA24/edgelight-backend?style=for-the-badge&logo=github)](https://github.com/CHAUHANRUDRA24/edgelight-backend)
  [![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com)
  [![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
  [![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express)](https://expressjs.com)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

  <br>

  [API Reference](#-api-endpoints) • [Webhook Setup](#-razorpay-webhook-integration) • [Admin Console](#-live-admin-console) • [Author](#-maintainer--author)

</div>

---

## 📖 Overview

The **Edge Light Backend** provides the cloud infrastructure for Edge Light desktop clients. It manages device registrations, license verification, real-time activity heartbeats, payment webhook processing from Razorpay, and hosts the live Web Admin Dashboard.

---

## 🌟 Features

- **Centralized Device Management**: Tracks machine registrations, Hardware IDs (`HWID`), Windows hostnames, client versions, and online/offline status.
- **Automated Razorpay Webhooks**: Validates cryptographic HMAC-SHA256 signatures and automatically grants lifetime or subscription license approvals upon successful payment.
- **Real-Time Web Admin Console**: Standalone web portal powered by the Firebase JS SDK v10 with live `onSnapshot` updates and 1-click **Approve**, **Reject**, and **Reset Trial** controls.
- **Firestore Security Rules**: Pre-configured production rules protecting documents in the `licenses` collection.
- **Zero-Friction Deployment**: Single-command deployment to Firebase Hosting and Cloud Functions or standard Node.js servers.

---

## 🔌 API Endpoints

### 1. Verify Device License
- **Method**: `GET`
- **URL**: `/api/licenses/verify/:hwid`
- **Response**:
  ```json
  {
    "exists": true,
    "hwid": "CAA0-7C92-AC5D-B662",
    "status": "approved",
    "pcName": "DESKTOP-PRO",
    "lastActiveAt": "2026-09-20T21:40:00Z"
  }
  ```

### 2. Auto-Register New Installation
- **Method**: `POST`
- **URL**: `/api/licenses/register`
- **Payload**:
  ```json
  {
    "hwid": "CAA0-7C92-AC5D-B662",
    "fullHwid": "730B81771046C76D...",
    "pcName": "DESKTOP-WORK",
    "appVersion": "1.0.3"
  }
  ```
- **Response**:
  ```json
  {
    "registered": true,
    "status": "trial"
  }
  ```

### 3. Razorpay Payment Webhook
- **Method**: `POST`
- **URL**: `/api/webhooks/razorpay`
- **Headers**: `x-razorpay-signature: <hmac_sha256_hash>`
- **Action**: Extracts `hwid` from payment notes and updates the Firestore license to `status: 'approved'`.

---

## 📊 Live Admin Console

The `/admin` portal (`admin-dashboard/index.html`) is an interactive management console with:
- **Real-Time Telemetry Cards**:
  - Total Downloads / Registered Machines
  - Active Users in the last 24h
  - Active 3-Day Trials
  - Approved Commercial Pro Licenses
  - Blocked / Rejected Machines
- **Device Management Grid**:
  - Instant search by Device Name or HWID
  - 1-click **Approve** (activates commercial license)
  - 1-click **Reject** (revokes access)
  - 1-click **Reset Trial** (resets machine to 3-day evaluation)
  - 1-click **Delete (🗑️)** (removes record from Firestore)

---

## 💳 Razorpay Webhook Integration

To connect Razorpay with automatic license provisioning:
1. Go to **Razorpay Dashboard → Settings → Webhooks**.
2. Click **Add New Webhook**.
3. **Webhook URL**: `https://your-backend-domain.com/api/webhooks/razorpay`
4. **Secret**: Enter a secure random string and put it in `.env` as `RAZORPAY_WEBHOOK_SECRET`.
5. **Active Events**: Check `payment.captured` and `order.paid`.
6. Whenever a customer pays via link or QR code, their license is approved automatically!

---

## 🏗️ Project Structure

```
backend/
├── admin-dashboard/         # Real-time Web Admin Console (Firebase JS SDK v10)
│   └── index.html
├── api/                     # Specialized route handlers
├── firebase.json            # Firebase Hosting & Firestore deploy settings
├── firestore.rules          # Firestore database security rules
├── package.json             # Dependencies (express, cors, firebase-admin)
├── server.js                # Express application & webhook listener
├── .env.example             # Environment template
├── .gitignore
└── README.md
```

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
Fill in your Firebase credentials (`edge-light-24`) and Razorpay secrets.

### 3. Run Locally
```bash
npm start
```
- API Server: `http://localhost:4000`
- Admin Dashboard: `http://localhost:4000/admin`

### 4. Deploy to Firebase
```bash
firebase deploy
```

---

## 👨‍💻 Maintainer & Author

- **Author**: **CHAUHANRUDRA24**
- **Email**: [rudrachauhan2475@gmail.com](mailto:rudrachauhan2475@gmail.com)
- **GitHub**: [@CHAUHANRUDRA24](https://github.com/CHAUHANRUDRA24)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
