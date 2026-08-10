// ============================================================================
// DERBY 2026 — APP LOGIC
// ============================================================================

const state = {
  view: "schedule",
  day: DAY_ORDER[0],
  isAdmin: false,
  events: [],          // live from Firestore (or local seed as fallback)
  usingFallback: false,
  editingId: null
};

// ---------------------------------------------------------------------------
// Toasts
// ---------------------------------------------------------------------------
function toast(msg, ms = 4500) {
  const stack = document.getElementById("toast-stack");
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  stack.appendChild(el);
  setTimeout(() => el.remove(), ms);
}

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------
function computeTotals(events) {
  let eendrag = 0, helshoogte = 0, decided = 0;
  events.forEach(e => {
    eendrag += e.pointsEendrag || 0;
    helshoogte += e.pointsHelshoogte || 0;
    if (e.status === "completed" && e.weightClass) decided += WEIGHT_CLASSES[e.weightClass].points;
  });
  return { eendrag, helshoogte, decided };
}

function eventsForDay(day) {
  return state.events
    .filter(e => e.day === day)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
}

// ---------------------------------------------------------------------------
// Rendering: scoreboard
// ---------------------------------------------------------------------------
function renderScoreboard() {
  const { eendrag, helshoogte, decided } = computeTotals(state.events);
  document.getElementById("team-a-name").textContent = TEAMS.eendrag.name;
  document.getElementById("team-b-name").textContent = TEAMS.helshoogte.name;
  document.getElementById("team-a-points").textContent = eendrag;
  document.getElementById("team-b-points").textContent = helshoogte;

  const total = TOTAL_POOL || 1;
  document.getElementById("meter-a").style.width = ((eendrag / total) * 100).toFixed(1) + "%";
  document.getElementById("meter-b").style.width = ((helshoogte / total) * 100).toFixed(1) + "%";
  document.getElementById("pool-label").textContent = `${decided} of ${TOTAL_POOL} points decided`;
}

// ---------------------------------------------------------------------------
// Rendering: schedule
// ---------------------------------------------------------------------------
function renderDayTabs() {
  const wrap = document.getElementById("day-tabs");
  wrap.innerHTML = "";
  DAY_ORDER.forEach(day => {
    const btn = document.createElement("button");
    btn.className = "day-tab" + (day === state.day ? " active" : "");
    btn.textContent = day;
    btn.addEventListener("click", () => { state.day = day; renderDayTabs(); renderEventList(); });
    wrap.appendChild(btn);
  });
}

function weightBadge(weightClass) {
  if (!weightClass) return "";
  const wc = WEIGHT_CLASSES[weightClass];
  return `<span class="badge badge-${weightClass}">${wc.label} · ${wc.points} pts</span>`;
}

function statusBadge(ev) {
  if (ev.status === "live") return `<span class="badge badge-live">● Live now</span>`;
  if (ev.status === "completed" && ev.winner) {
    const label = ev.winner === "split" ? "Split" : TEAMS[ev.winner].name + " won";
    return `<span class="badge badge-winner-${ev.winner}">${label}</span>`;
  }
  return "";
}

function renderEventList() {
  const list = document.getElementById("event-list");
  const evs = eventsForDay(state.day);
  if (!evs.length) {
    list.innerHTML = `<div class="empty-state">No events on this day.</div>`;
    return;
  }
  list.innerHTML = evs.map(ev => `
    <div class="event-card ${ev.status === "live" ? "is-live" : ""}" data-id="${ev.id}">
      <div class="event-time">${ev.time || "--:--"}</div>
      <div class="event-main">
        <div class="event-name">${escapeHtml(ev.name)}</div>
        <div class="event-venue">${escapeHtml(ev.venue || "")}</div>
        <div class="event-meta">${weightBadge(ev.weightClass)}${statusBadge(ev)}</div>
      </div>
      ${state.isAdmin ? `<button class="event-edit-btn" data-edit="${ev.id}" title="Edit event">✎</button>` : `<span></span>`}
    </div>
  `).join("");

  if (state.isAdmin) {
    list.querySelectorAll("[data-edit]").forEach(btn => {
      btn.addEventListener("click", () => openEditModal(btn.dataset.edit));
    });
  }
}

// ---------------------------------------------------------------------------
// Rendering: leaderboard
// ---------------------------------------------------------------------------
function renderLeaderboard() {
  const byDay = {};
  DAY_ORDER.forEach(d => byDay[d] = { eendrag: 0, helshoogte: 0, total: 0 });
  state.events.forEach(e => {
    if (!byDay[e.day]) return;
    byDay[e.day].eendrag += e.pointsEendrag || 0;
    byDay[e.day].helshoogte += e.pointsHelshoogte || 0;
    if (e.weightClass) byDay[e.day].total += WEIGHT_CLASSES[e.weightClass].points;
  });

  const breakdown = document.getElementById("day-breakdown");
  breakdown.innerHTML = DAY_ORDER.map(d => {
    const row = byDay[d];
    const decided = row.eendrag + row.helshoogte;
    const aPct = row.total ? (row.eendrag / row.total) * 100 : 0;
    const bPct = row.total ? (row.helshoogte / row.total) * 100 : 0;
    return `
      <div class="day-row">
        <div class="day-row-name">${d}</div>
        <div class="day-row-bar">
          <div style="width:${aPct}%; background:var(--eendrag)"></div>
          <div style="width:${bPct}%; background:var(--helshoogte)"></div>
        </div>
        <div class="day-row-total">${decided}/${row.total}</div>
      </div>`;
  }).join("");

  const completed = state.events
    .filter(e => e.status === "completed" && e.weightClass)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const log = document.getElementById("results-log");
  if (!completed.length) {
    log.innerHTML = `<div class="empty-state">No results yet.</div>`;
    return;
  }
  log.innerHTML = completed.map(e => {
    let resultText;
    if (e.winner === "split") resultText = `Split ${e.pointsEendrag}–${e.pointsHelshoogte}`;
    else if (e.winner) resultText = `${TEAMS[e.winner].name} +${e.winner === "eendrag" ? e.pointsEendrag : e.pointsHelshoogte}`;
    else resultText = "—";
    return `<div class="log-row"><span class="log-row-event">${escapeHtml(e.name)}</span><span class="log-row-result">${resultText}</span></div>`;
  }).join("");
}

function renderAll() {
  renderScoreboard();
  renderDayTabs();
  renderEventList();
  renderLeaderboard();
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str || "";
  return d.innerHTML;
}

// ---------------------------------------------------------------------------
// View / tab switching
// ---------------------------------------------------------------------------
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    state.view = tab.dataset.view;
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.getElementById("view-" + state.view).classList.add("active");
  });
});

// ---------------------------------------------------------------------------
// Firestore live sync
// ---------------------------------------------------------------------------
function startFirestoreSync() {
  try {
    db.collection("events").onSnapshot(
      snap => {
        if (snap.empty) {
          // Not seeded yet — fall back to local data so the app is still usable,
          // and tell the admin how to seed real shared data.
          state.events = SEED_EVENTS.slice();
          state.usingFallback = true;
          if (state.isAdmin) toast("No events found in Firestore yet — run seed.js to load shared data. Showing local data for now.");
        } else {
          state.events = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          state.usingFallback = false;
        }
        renderAll();
      },
      err => {
        console.error("Firestore error:", err);
        state.events = SEED_EVENTS.slice();
        state.usingFallback = true;
        renderAll();
        toast("Couldn't reach the live database — showing local data.");
      }
    );
  } catch (err) {
    console.error(err);
    state.events = SEED_EVENTS.slice();
    renderAll();
  }
}

// ---------------------------------------------------------------------------
// Admin: login / logout
// ---------------------------------------------------------------------------
const adminModal = document.getElementById("admin-modal");
document.getElementById("admin-btn").addEventListener("click", () => {
  if (state.isAdmin) return; // banner handles logout when already admin
  adminModal.classList.remove("hidden");
});
document.getElementById("admin-cancel").addEventListener("click", () => adminModal.classList.add("hidden"));

document.getElementById("admin-submit").addEventListener("click", async () => {
  const email = document.getElementById("admin-email").value.trim();
  const password = document.getElementById("admin-password").value;
  const errEl = document.getElementById("admin-error");
  errEl.classList.add("hidden");
  try {
    await auth.signInWithEmailAndPassword(email, password);
    adminModal.classList.add("hidden");
    document.getElementById("admin-email").value = "";
    document.getElementById("admin-password").value = "";
  } catch (err) {
    errEl.textContent = "Login failed — check your email and password.";
    errEl.classList.remove("hidden");
  }
});

document.getElementById("admin-logout").addEventListener("click", () => auth.signOut());

auth.onAuthStateChanged(user => {
  state.isAdmin = !!user;
  document.getElementById("admin-banner").classList.toggle("hidden", !state.isAdmin);
  document.getElementById("admin-btn").classList.toggle("hidden", state.isAdmin);
  renderAll();
});

// ---------------------------------------------------------------------------
// Admin: edit event
// ---------------------------------------------------------------------------
const editModal = document.getElementById("edit-modal");

function openEditModal(id) {
  const ev = state.events.find(e => e.id === id);
  if (!ev) return;
  state.editingId = id;
  document.getElementById("edit-name").value = ev.name || "";
  document.getElementById("edit-date").value = ev.date || "";
  document.getElementById("edit-time").value = ev.time || "";
  document.getElementById("edit-venue").value = ev.venue || "";
  document.getElementById("edit-weight").value = ev.weightClass || "";
  document.getElementById("edit-winner").value = ev.winner || "";
  document.getElementById("edit-error").classList.add("hidden");
  editModal.classList.remove("hidden");
}
document.getElementById("edit-cancel").addEventListener("click", () => editModal.classList.add("hidden"));

document.getElementById("edit-save").addEventListener("click", async () => {
  const id = state.editingId;
  const errEl = document.getElementById("edit-error");
  if (!id) return;
  if (state.usingFallback) {
    errEl.textContent = "Shared database isn't set up yet — run seed.js first (see README).";
    errEl.classList.remove("hidden");
    return;
  }
  const weightClass = document.getElementById("edit-weight").value || null;
  const winner = document.getElementById("edit-winner").value || null;
  const pts = weightClass ? WEIGHT_CLASSES[weightClass].points : 0;

  let pointsEendrag = 0, pointsHelshoogte = 0;
  if (winner === "eendrag") pointsEendrag = pts;
  else if (winner === "helshoogte") pointsHelshoogte = pts;
  else if (winner === "split") { pointsEendrag = pts / 2; pointsHelshoogte = pts / 2; }

  const update = {
    name: document.getElementById("edit-name").value.trim(),
    date: document.getElementById("edit-date").value,
    time: document.getElementById("edit-time").value,
    venue: document.getElementById("edit-venue").value.trim(),
    weightClass,
    winner,
    status: winner ? "completed" : "upcoming",
    pointsEendrag,
    pointsHelshoogte
  };

  try {
    await db.collection("events").doc(id).set(update, { merge: true });
    editModal.classList.add("hidden");
    toast("Event updated.");
  } catch (err) {
    console.error(err);
    errEl.textContent = "Couldn't save — check your connection and admin access.";
    errEl.classList.remove("hidden");
  }
});

// ---------------------------------------------------------------------------
// Notifications (Firebase Cloud Messaging)
// ---------------------------------------------------------------------------
document.getElementById("notif-btn").addEventListener("click", async () => {
  if (!("Notification" in window)) {
    toast("This browser doesn't support notifications.");
    return;
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      toast("Notifications weren't enabled.");
      return;
    }
    const registration = await navigator.serviceWorker.register("service-worker.js");
    const messaging = firebase.messaging();
    const token = await messaging.getToken({ vapidKey: FCM_VAPID_KEY, serviceWorkerRegistration: registration });
    if (token) {
      await db.collection("subscribers").doc(token).set({ token, createdAt: new Date().toISOString() });
      toast("You'll get a notification when each event starts.");
    }
    messaging.onMessage(payload => {
      toast(`${payload.notification?.title || "Event starting"}: ${payload.notification?.body || ""}`);
    });
  } catch (err) {
    console.error(err);
    toast("Couldn't enable notifications — see console for details.");
  }
});

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
startFirestoreSync();
