window.ApiClient = {
  logs: [],

  async request(method, endpoint, payload = null, role = "ADMIN") {
    const start = performance.now();
    const latency = Math.floor(Math.random() * 28) + 14;
    await new Promise(r => setTimeout(r, latency));

    let status = 200;
    if (method === "POST") status = 201;
    if (method === "DELETE" && role !== "ADMIN") status = 403;

    const logItem = {
      id: "req-" + Date.now() + "-" + Math.floor(Math.random() * 100),
      time: new Date().toLocaleTimeString("vi-VN"),
      method,
      endpoint,
      status,
      latency: `${Math.round(performance.now() - start)}ms`,
      role,
      payload: payload ? JSON.stringify(payload).slice(0, 120) : "null"
    };

    this.logs.unshift(logItem);
    if (this.logs.length > 30) this.logs.pop();

    const badge = document.getElementById("apiLatencyBadge");
    if (badge) {
      badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> ${method} ${endpoint} (${logItem.latency})`;
    }

    return { ok: status < 400, status, logItem };
  }
};