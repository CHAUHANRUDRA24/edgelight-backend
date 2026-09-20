const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize Firebase Admin (uses serviceAccountKey or Application Default Credentials)
const projectId = process.env.FIREBASE_PROJECT_ID || 'edge-light-24';
const collectionName = process.env.FIRESTORE_COLLECTION || 'licenses';

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: projectId
    });
    console.log('[Firebase] Admin initialized with Service Account.');
  } catch (e) {
    admin.initializeApp({ projectId: projectId });
  }
} else {
  admin.initializeApp({ projectId: projectId });
  console.log('[Firebase] Admin initialized with Project ID:', projectId);
}

const db = admin.firestore();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Serve Admin Dashboard
app.use('/admin', express.static(path.join(__dirname, 'admin-dashboard')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), project: projectId });
});

// 1. Verify Device License
app.get('/api/licenses/verify/:hwid', async (req, res) => {
  try {
    const { hwid } = req.params;
    if (!hwid) return res.status(400).json({ error: 'Missing hwid' });

    const docRef = db.collection(collectionName).doc(hwid);
    const snap = await docRef.get();

    if (!snap.exists) {
      return res.status(404).json({ exists: false, status: 'unregistered' });
    }

    const data = snap.data();
    return res.json({ exists: true, ...data });
  } catch (err) {
    console.error('[Verify Error]', err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Register Device on First Start
app.post('/api/licenses/register', async (req, res) => {
  try {
    const { hwid, fullHwid, pcName, appVersion } = req.body;
    if (!hwid) return res.status(400).json({ error: 'Missing hwid' });

    const docRef = db.collection(collectionName).doc(hwid);
    const snap = await docRef.get();

    if (snap.exists) {
      // Update heartbeat
      await docRef.update({
        lastActiveAt: admin.firestore.FieldValue.serverTimestamp(),
        pcName: pcName || snap.data().pcName,
        appVersion: appVersion || snap.data().appVersion
      });
      return res.json({ registered: true, status: snap.data().status });
    }

    const newDoc = {
      hwid,
      fullHwid: fullHwid || '',
      pcName: pcName || 'Unknown Device',
      status: 'trial',
      registeredAt: admin.firestore.FieldValue.serverTimestamp(),
      lastActiveAt: admin.firestore.FieldValue.serverTimestamp(),
      appVersion: appVersion || '1.0.3'
    };

    await docRef.set(newDoc);
    return res.json({ registered: true, status: 'trial' });
  } catch (err) {
    console.error('[Register Error]', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Razorpay Payment Webhook Handler (Auto-approves license upon payment)
app.post('/api/webhooks/razorpay', async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (secret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (signature !== expectedSignature) {
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log(`[Razorpay Webhook] Received event: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = payload.payment ? payload.payment.entity : null;
      const notes = payment?.notes || {};
      const hwid = notes.hwid || notes.HWID;

      if (hwid) {
        const docRef = db.collection(collectionName).doc(hwid);
        await docRef.set({
          status: 'approved',
          planId: notes.plan || 'pro',
          amount: payment.amount ? payment.amount / 100 : 49,
          paymentId: payment.id,
          paidAt: admin.firestore.FieldValue.serverTimestamp(),
          lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        console.log(`[License Approved] HWID ${hwid} approved via Razorpay payment ${payment.id}`);
      }
    }

    return res.json({ received: true });
  } catch (err) {
    console.error('[Webhook Error]', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`⚡ Edge Light Backend server running on port ${PORT}`);
  console.log(`📊 Admin Console available at: http://localhost:${PORT}/admin`);
});
