// ============================================================================
// Scheduled Cloud Function — runs every minute, checks whether any event's
// start time (date + time) has just arrived, and if so:
//   1. marks it "live" in Firestore
//   2. sends a real push notification to every subscribed device
// This is what makes notifications arrive even when nobody has the app open.
//
// Deploy with: firebase deploy --only functions
// (requires the Blaze "pay as you go" plan — the free quota comfortably
// covers a one-week event like this; Google Cloud Scheduler needs billing
// enabled to run scheduled functions at all, even at $0 actual cost)
// ============================================================================

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.notifyEventStart = functions.pubsub
  .schedule("every 1 minutes")
  .timeZone("Africa/Johannesburg")
  .onRun(async () => {
    const now = new Date();
    const pad = n => String(n).padStart(2, "0");
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const nowTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const eventsSnap = await db.collection("events")
      .where("date", "==", today)
      .where("time", "==", nowTime)
      .get();

    if (eventsSnap.empty) return null;

    const subsSnap = await db.collection("subscribers").get();
    const tokens = subsSnap.docs.map(d => d.id);

    for (const doc of eventsSnap.docs) {
      const event = doc.data();
      await doc.ref.update({ status: "live" });

      if (tokens.length) {
        const message = {
          notification: {
            title: `${event.name} is starting now`,
            body: event.venue ? `Happening at ${event.venue}` : "Derby 2026"
          },
          tokens
        };
        try {
          const resp = await admin.messaging().sendEachForMulticast(message);
          // Clean up tokens that are no longer valid (uninstalled/expired)
          const stale = [];
          resp.responses.forEach((r, i) => { if (!r.success) stale.push(tokens[i]); });
          if (stale.length) {
            const batch = db.batch();
            stale.forEach(t => batch.delete(db.collection("subscribers").doc(t)));
            await batch.commit();
          }
        } catch (err) {
          console.error("Push send failed:", err);
        }
      }
    }
    return null;
  });
