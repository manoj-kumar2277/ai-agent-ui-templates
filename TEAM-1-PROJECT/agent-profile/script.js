// Orbit – AI Agent Profile (plain JavaScript, no libraries)
const $ = (s) => document.querySelector(s);
const roles = { "Research Agent": "Finds and summarises sources", "Support Agent": "Answers customer tickets", "Data Agent": "Cleans and syncs datasets", "Billing Agent": "Handles invoices and refunds", "Outreach Agent": "Writes and sends emails", "Scheduler Agent": "Books meetings and reminders", "Code Review Agent": "Checks pull requests", "Insight Agent": "Spots trends in your data", "Translator Agent": "Translates content, 30 languages", "Security Agent": "Watches for risky activity", "Content Agent": "Drafts posts and captions", "QA Agent": "Tests new releases" };
const name = new URLSearchParams(location.search).get("name") || "Research Agent";
const role = roles[name] || "Just created, ready for tasks";
let on = true;

// Same name always gives the same demo numbers
let seed = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
const rnd = (a, b) => { seed = (seed * 9301 + 49297) % 233280; return Math.round(a + (seed / 233280) * (b - a)); };

$("#avatar").textContent = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
$("#name").textContent = name; $("#role").textContent = role; document.title = name + " – Orbit";

// Stat cards with count-up
const stats = [["Tasks done", rnd(400, 2600), ""], ["Success rate", rnd(90, 99), "%"], ["Avg. response", rnd(8, 24) / 10, "s"], ["Uptime", 99.2 + rnd(0, 7) / 10, "%"]];
$("#stats").innerHTML = stats.map((s) => `<div class="card"><span>${s[0]}</span><b data-end="${s[1]}" data-suf="${s[2]}">0</b></div>`).join("");
document.querySelectorAll("[data-end]").forEach((el) => {
  const end = +el.dataset.end, dec = end % 1 ? 1 : 0, t0 = performance.now();
  (function tick(t) { const k = Math.min((t - t0) / 1300, 1); el.textContent = (end * (1 - Math.pow(1 - k, 3))).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + el.dataset.suf; if (k < 1) requestAnimationFrame(tick); })(t0);
});

// Bar chart
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], vals = days.map(() => rnd(30, 100));
$("#bars").innerHTML = days.map((d, i) => `<div><i data-h="${vals[i]}"></i>${d}</div>`).join("");
function growBars() { document.querySelectorAll("#bars i").forEach((b) => { b.style.height = "0"; setTimeout(() => (b.style.height = b.dataset.h * 0.78 + "%"), 60); }); }

// Skills
const skillNames = ["Reading", "Writing", "Reasoning", "Tool use", "Accuracy"];
$("#skills").innerHTML = skillNames.map((s) => { const v = rnd(60, 98); return `<div class="skill"><span>${s}</span><div class="bar"><i data-w="${v}"></i></div><em>${v}%</em></div>`; }).join("");

// Activity
const acts = ["Finished a task for the support team", "Asked for approval before sending a report", "Retried a failed step and it worked", "Started a new task from the queue", "Connected to a new data source"];
$("#feed").innerHTML = acts.map((a, i) => `<li><time>${i * 14 + 3} min ago</time><span class="d ${i % 2 ? "y" : ""}"></span><span>${a}</span></li>`).join("");

// Tabs
$("#tabs").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  document.querySelectorAll("#tabs button").forEach((x) => x.classList.toggle("on", x === b));
  document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("on", p.id === b.dataset.t));
  if (b.dataset.t === "p1") growBars();
  if (b.dataset.t === "p2") document.querySelectorAll(".skill i").forEach((i) => { i.style.width = "0"; setTimeout(() => (i.style.width = i.dataset.w + "%"), 60); });
});

// Buttons
function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2200); }
$("#toggle").addEventListener("click", () => {
  on = !on; $("#toggle").textContent = on ? "Pause agent" : "Resume agent";
  $("#chip").className = "chip " + (on ? "working" : ""); $("#chip").textContent = on ? "Working" : "Paused";
  toast(name + (on ? " resumed" : " paused"));
});
$("#runBtn").addEventListener("click", () => toast("Task sent to " + name));

// Cursor
(function () { if (!matchMedia("(pointer:fine)").matches) return; const d = $("#cDot"), r = $("#cRing"); let x = 0, y = 0, rx = 0, ry = 0;
  addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; document.body.classList.add("cursor-on"); d.style.transform = `translate(${x}px,${y}px)`; document.body.classList.toggle("cursor-hover", !!e.target.closest("button,a")); });
  document.addEventListener("mouseleave", () => document.body.classList.remove("cursor-on"));
  (function f() { rx += (x - rx) * 0.16; ry += (y - ry) * 0.16; r.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(f); })(); })();

growBars();
