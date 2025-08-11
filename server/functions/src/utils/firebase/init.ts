// firebase.js
import "dotenv/config";
import admin from "firebase-admin";
// import serviceAccount from "../../../slg100-service-account.json"; // Adjust the path as necessary

const serviceAccount = JSON.parse(process.env.FIREBASE_STORAGE_SA || "{}");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: process.env.BUCKET_NAME,
  });
}

const bucket = admin.storage().bucket();

export { admin, bucket };
