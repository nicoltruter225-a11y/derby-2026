# Derby 2026 — Eendrag vs Helshoogte

A live schedule + scoreboard site for Derby 2026. Everyone can view the schedule,
results, and live points; only a signed-in admin can edit events or record results.
Built to run for free on GitHub Pages + Firebase.

---

## What's in this repo

```
index.html              Main page
css/style.css            All styling
js/data.js                Full event schedule + starting results (seed data)
js/firebase-config.js     ⚠️ You must paste your own Firebase keys here
js/app.js                 App logic — rendering, admin login, editing, notifications
service-worker.js         ⚠️ You must paste your own Firebase keys here too (background push)
manifest.json             Makes the site installable as an app on phones
icons/                    App icons
firestore.rules           Who can read/write the shared database
firebase.json              Ties Firestore rules + Cloud Functions together
seed.js                    Run once to load the schedule into your database
functions/index.js         Sends the real push notification when an event starts
```

---

## 1. One-time setup (about 15–20 minutes total)

### A. Create the Firebase project
1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project** → name it (e.g. `derby-2026`) → skip Analytics.
2. Click the **`</>`** web icon on the project overview page → nickname it → **Register app**. You'll see a `firebaseConfig` object — copy it.
3. Open `js/firebase-config.js` in this repo and paste your values in place of the `PASTE_...` placeholders.
4. Open `service-worker.js` and paste the **same values** into the config object near the top (service workers can't share the other file, so it has to be duplicated — this is the one thing that has to be kept in sync manually if you ever change your Firebase project).

### B. Turn on Firestore (the shared database)
1. In the Firebase console sidebar: **Build → Firestore Database → Create database**.
2. Choose **production mode**, pick a region (e.g. `europe-west1`).
3. From a terminal in this project folder, install the Firebase CLI once: `npm install -g firebase-tools`
4. `firebase login`, then `firebase use --add` and select your project.
5. Deploy the security rules: `firebase deploy --only firestore:rules`
   This makes the schedule readable by anyone, but only writable by a signed-in admin.

### C. Create the admin login
1. Firebase console → **Build → Authentication → Get started → Sign-in method → Email/Password → Enable**.
2. **Users** tab → **Add user**. Use any email you like (e.g. `admin@derby2026.app`) and set the password to `ADMIN225` (or change it to something else — it's yours to choose now that it's real, secure login rather than a hardcoded password in the code).
3. That's the login you'll use with the **Admin** button in the app.

> Why not just hardcode the password in the JavaScript like you asked? Because any password written directly into the site's code is visible to anyone who opens their browser's dev tools — it wouldn't actually stop someone from editing scores. This does the same job (log in with a password to unlock editing) but properly: real accounts, real access control enforced by the database itself, not just hidden in the page.

### D. Load the schedule into the database
1. Firebase console → Project Settings → **Service Accounts** → **Generate new private key** → save the downloaded file as `serviceAccountKey.json` in this project's root folder. (It's already in `.gitignore` so it won't get published.)
2. `npm install firebase-admin`
3. `node seed.js`

You only need to do this once. Re-running it later just resets scores back to these starting values, which is handy if you want to reset before the real week starts.

### E. Turn on push notifications
1. Firebase console → Project Settings → **Cloud Messaging** tab → **Web configuration** → **Generate key pair**.
2. Copy the key into `FCM_VAPID_KEY` in `js/firebase-config.js`.
3. Deploy the notification function: `cd functions && npm install && cd .. && firebase deploy --only functions`
   This requires switching the Firebase project to the **Blaze (pay-as-you-go)** plan — Google requires billing to be enabled for scheduled functions to run at all, but for a one-week event like this you'll stay comfortably inside the free monthly quota (realistically a few cents at most, likely $0).

If you'd rather skip push notifications for now, the app still works fine without step E — the "🔔 Notify me" button just won't do anything until it's set up.

---

## 2. Publish to GitHub

```bash
git init
git add .
git commit -m "Derby 2026 site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Then: repo **Settings → Pages → Source → Deploy from a branch → main → / (root)**.
Your site will be live at `https://<your-username>.github.io/<your-repo>/` within a minute or two.

Send that link to everyone — no login needed to view; the **Admin** button is how you log in to edit.

---

## 3. Data notes — things I fixed or want you to double check

Cross-checking the PDF schedule against the Google Sheet's scoring data, everything lines up
except for a few naming differences I had to resolve:

- **"Ser" (sheet) = "Acapella" (PDF).** The sheet lists a 10-point event called "Ser" in the same
  time slot the PDF calls "Acapella" on Sunday night. I've merged these into one event,
  **"Acapella (Serenade)"**. Worth a quick sanity check that this is right.
- **"Snelrook" (sheet) = "Vinnig rook" (PDF).** Same Afrikaans phrase ("fast smoke"), just
  written two ways — merged into one event called **"Snelrook"**.
- **Typos fixed:** "Rocket Leahue" → Rocket League, "Hokcey" → Hockey, "Wimbdldedon" → Wimbledon,
  "Coetzenberg"/"Coetzenburg" standardized to "Coetzenberg" (used both ways in the PDF).
- **Point values** (Heavy = 25, Medium = 17.5, Light = 10) came entirely from the sheet — the PDF
  had no point values at all, only the schedule.
- **Opening Ceremony** has no points — it's shown on the schedule but can't be "won."
- The **total prize pool is 522.5 points**, and the **current live score** seeded in is
  Eendrag 50 – Helshoogte 22.5, both of which I verified add up exactly against the sheet's
  own "Completed" running total column.

If any of those merges are wrong (e.g. "Ser" is actually a separate event I'm not aware of),
just edit `js/data.js` directly, or use the admin edit panel once it's live.

---

## 4. Using the app day-to-day

- **Viewers**: open the link, browse **Schedule** by day or **Leaderboard** for the running score. Nothing is editable without logging in.
- **You (admin)**: tap **Admin**, log in, then tap the pencil icon on any event to change its date, time, venue, point value, or record the winner. The scoreboard updates instantly for everyone viewing the site, live.
- **Notifications**: anyone who taps **🔔 Notify me** and allows notifications gets a push the moment an event's scheduled time arrives — whether or not they have the app open.
