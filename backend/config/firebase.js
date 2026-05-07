const admin = require('firebase-admin');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// Check if Firebase env variables exist
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error('\x1b[31m%s\x1b[0m', 'CRITICAL ERROR: Firebase environment variables are missing!');
  console.error('\x1b[33m%s\x1b[0m', 'Please add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to your backend/.env file.');
  process.exit(1);
}

try {
  let cleanPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (cleanPrivateKey.startsWith('"') && cleanPrivateKey.endsWith('"')) {
    cleanPrivateKey = cleanPrivateKey.slice(1, -1);
  }
  cleanPrivateKey = cleanPrivateKey.replace(/\\n/g, '\n');

  let cleanProjectId = process.env.FIREBASE_PROJECT_ID;
  if (cleanProjectId.startsWith('"') && cleanProjectId.endsWith('"')) cleanProjectId = cleanProjectId.slice(1, -1);

  let cleanClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  if (cleanClientEmail.startsWith('"') && cleanClientEmail.endsWith('"')) cleanClientEmail = cleanClientEmail.slice(1, -1);

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: cleanProjectId,
      clientEmail: cleanClientEmail,
      privateKey: cleanPrivateKey
    })
  });
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', 'Firebase Initialization Error:', error.message);
  process.exit(1);
}

const db = admin.firestore();

module.exports = { admin, db };
