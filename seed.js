// ============================================================================
// One-time seed script — populates Firestore with the initial derby schedule
// and results so every visitor sees the same shared data from the start.
//
// Setup:
//   1. npm install firebase-admin
//   2. Firebase Console → Project Settings → Service Accounts →
//      "Generate new private key" → save the file as serviceAccountKey.json
//      in this folder (DO NOT commit this file — it's in .gitignore already)
//   3. node seed.js
//
// Safe to re-run: it overwrites each event by its id, so running it again
// just resets the data back to these starting values.
// ============================================================================

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const { SEED_EVENTS } = require("./js/data.js");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function seed() {
  const batch = db.batch();
  SEED_EVENTS.forEach(event => {
    const ref = db.collection("events").doc(event.id);
    batch.set(ref, event);
  });
  await batch.commit();
  console.log(`Seeded ${SEED_EVENTS.length} events into Firestore.`);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
