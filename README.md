<div align="center">

  # Edge Light — Backend & Admin API

  **Firestore licensing server, payment webhooks, and administrative console**

  [![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com)
  [![Node](https://img.shields.io/badge/Node-%3E%3D18.0-339933?style=flat-square&logo=node.js)](https://nodejs.org)
  [![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express)](https://expressjs.com)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

  [API Reference](#api-reference) • [Webhooks](#payment-webhooks) • [Admin Dashboard](#admin-dashboard)

</div>

---

## Overview

The **Edge Light Backend** provides authentication, licensing management, and administrative control for the Edge Light desktop client. It handles machine registrations, validates license statuses, receives payment webhooks, and powers a real-time web dashboard for license provisioning.

---

## Features

- **Device Verification**: Validates hardware identifiers (`HWID`), hostnames, client versions, and activity timestamps.
- **Payment Webhook Processing**: Verifies Razorpay signatures (HMAC-SHA256) and updates licenses upon successful checkout.
- **Real-Time Admin Console**: Web-based dashboard utilizing Firestore real-time listeners (`onSnapshot`) with single-click actions to approve, reject, or reset trials.
- **Access Control**: Built-in Firestore security rules protecting the `licenses` collection.
- **Flexible Deployment**: Supports standard Node.js servers, Firebase Cloud Functions, or Docker containers.

---

## API Reference

### 1. Verify License Status

```http
GET /api/licenses/verify/:hwid
```

**Response (`200 OK`)**:
```json
{
  "exists": true,
  "hwid": "CAA0-7C92-AC5D-B662",
  "status": "approved",
  "pcName": "DESKTOP-WORK",
  "lastActiveAt": "2026-09-20T21:40:00Z"
}
```

---

### 2. Register Device

```http
POST /api/licenses/register
```

**Payload**:
```json
{
  "hwid": "CAA0-7C92-AC5D-B662",
  "fullHwid": "730B81771046C76D...",
  "pcName": "DESKTOP-WORK",
  "appVersion": "1.0.3"
}
```

**Response (`200 OK`)**:
```json
{
  "registered": true,
  "status": "trial"
}
```

---

### 3. Razorpay Payment Webhook

```http
POST /api/webhooks/razorpay
Header: x-razorpay-signature: <hmac_sha256_hash>
```

Parses the payment payload, extracts the device HWID from order notes, and updates the device license status to `approved`.

---

## Admin Dashboard

Located in `admin-dashboard/index.html`, the admin interface provides:
- Live metrics: Total installations, active 24h users, trials, and active pro licenses.
- Searchable device table by HWID or machine name.
- Management actions: **Approve**, **Reject**, **Reset Trial (3 Days)**, and **Delete**.

---

## Project Structure

```
backend/
├── admin-dashboard/                 # Real-time web admin console
│   └── index.html
├── api/                             # REST API handlers & endpoints
│   ├── server.js                    # Express application entry point
│   ├── routes.js                    # Route definitions
│   └── webhooks.js                  # Razorpay signature verification
├── config/                          # Firebase configuration and credentials
│   └── firebase-config.js
├── firestore.rules                  # Security rules for Firestore
├── .env.example                     # Environment template
├── package.json
└── README.md
```

---

## Setup & Running

### Prerequisites

- [Node.js](https://nodejs.org) (v18 or later)
- A Firebase project with Firestore enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/CHAUHANRUDRA24/edgelight-backend.git
cd edgelight-backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

### Start Server

```bash
# Start backend server
npm start
```

Default server runs on port `5000`. Access the admin dashboard at `http://localhost:5000/admin`.

---

## Author

- **Maintainer**: Chauhan Rudra ([@CHAUHANRUDRA24](https://github.com/CHAUHANRUDRA24))
- **Contact**: rudrachauhan2475@gmail.com

---

## License

This project is licensed under the [MIT License](LICENSE).
