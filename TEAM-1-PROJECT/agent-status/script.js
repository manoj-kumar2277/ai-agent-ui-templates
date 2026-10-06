// Orbit – Agent Status Monitoring (plain JavaScript, no libraries)
const $ = (s) => document.querySelector(s);
const rnd = (a, b) => Math.round(a + Math.random() * (b - a));
const agents = ["Research Agent", "Support Agent", "Data Agent", "Billing Agent", "Outreach Agent", "Scheduler Agent", "Code Review Agent", "Security Agent"]
  .map((name) => ({ name, base: rnd(120, 260), ms: 0, trail: [], down: name === "Billing Agent", uptime: (99 + Math.random()).toFixed(2) }));
agents.forEach((a) => { a.ms = a.base; a.trail = Array.from({ length: 24 }, () => a.base + rnd(-25, 25)); });
let live = true;

function status(a) { return a.down ? ["down", "Down", "error"] : a.ms > 300 ? ["slow", "Slow", "idle"] : ["ok", "Healthy", "working"]; }

function render() {
  $("#tiles").innerHTML = agents.map((a) => {
    const [cls, label, chip] = status(a), max = 420;
    const pts = a.trail.map((v, i) => `${(i * 200) / 23},${42 - Math.min(v / max, 1) * 38}`).join(" ");
    return `<article class="card tile ${cls}"><div class="row"><b>${a.name}</b><span class="chip ${chip}">${label}</span></div>
      <div class="ms">${a.down ? "--" : a.ms}<small>ms</small></div>
      <svg class="live" viewBox="0 0 200 44" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}"/></svg>
      <small class="up">${a.uptime}% uptime</small></article>`;
  }).join("");
  const down = agents.filter((a) => a.down).length, slow = agents.filter((a) => !a.down && a.ms > 300).length, bad = down + slow;
  $("#banner").classList.toggle("warn", bad > 0);
  $("#bTitle").textContent = bad ? `${bad} agent${bad > 1 ? "s" : ""} need${bad > 1 ? "" : "s"} attention` : "All agents are healthy";
  $("#bSub").textContent = "Last checked " + new Date().toLocaleTimeString();
}

function tick() {
  if (!live) return;
  agents.forEach((a) => { if (a.down) return; a.ms = Math.max(60, Math.min(400, a.ms + rnd(-40, 40) + (a.base - a.ms) * 0.2)); a.trail.shift(); a.trail.push(a.ms); a.ms = Math.round(a.ms); });
  render();
}
setInterval(tick, 1500);

// 30-day history and incidents
$("#hist").innerHTML = Array.from({ length: 30 }, (_, i) => `<i class="${i === 21 ? "r" : i === 8 || i === 25 ? "y" : ""}" style="animation-delay:${i * 25}ms" title="Day ${i + 1}"></i>`).join("");
$("#inc").innerHTML = [["Billing Agent failed to sync invoices", "Today, retrying"], ["Support Agent was slow for 12 minutes", "9 days ago, resolved"], ["Data Agent lost its connection", "22 days ago, resolved"]].map((x) => `<li><div><b>${x[0]}</b><small>${x[1]}</small></div></li>`).join("");

function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2000); }
$("#refresh").addEventListener("click", () => { tick(); render(); toast("Checked all agents"); });
$("#pauseBtn").addEventListener("click", () => { live = !live; $("#pauseBtn").textContent = live ? "Pause live updates" : "Resume live updates"; toast(live ? "Live updates on" : "Live updates paused"); });

// Hero letters
(function () { const h = $("#kinetic"), ws = h.textContent.split(" "); let n = 0; h.textContent = "";
  ws.forEach((w, i) => { const s = document.createElement("span"); s.className = "w"; [...w].forEach((c) => { const k = document.createElement("span"); k.className = "ch" + (i >= 1 ? " hl" : ""); k.textContent = c; k.style.animationDelay = 0.2 + n++ * 0.045 + "s"; s.append(k); }); h.append(s, " "); }); })();

// Cursor
(function () { if (!matchMedia("(pointer:fine)").matches) return; const d = $("#cDot"), r = $("#cRing"); let x = 0, y = 0, rx = 0, ry = 0;
  addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; document.body.classList.add("cursor-on"); d.style.transform = `translate(${x}px,${y}px)`; document.body.classList.toggle("cursor-hover", !!e.target.closest("button,a")); });
  document.addEventListener("mouseleave", () => document.body.classList.remove("cursor-on"));
  (function f() { rx += (x - rx) * 0.16; ry += (y - ry) * 0.16; r.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(f); })(); })();

render();
