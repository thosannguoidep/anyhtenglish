Object.assign(window.App, {
  bindKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      if (this.state.activeTab !== "srs") return;
      const tag = document.activeElement ? document.activeElement.tagName : "";
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;

      if (e.code === "Space") {
        e.preventDefault();
        this.flipSrsCard();
      } else if (e.key === "1") this.rateSrsCard(1);
      else if (e.key === "2") this.rateSrsCard(3);
      else if (e.key === "3") this.rateSrsCard(4);
      else if (e.key === "4") this.rateSrsCard(5);
    });
  },

  renderSrs() {
    const cards = this.state.srsCards;
    if (!cards.length) return `<div class="p-8 text-center text-slate-500">Chưa có thẻ từ vựng nào.</div>`;
    const card = cards[this.state.srsIndex % cards.length];
    return `
      <div class="max-w-xl mx-auto space-y-5">
        <div class="flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>THẺ ${this.state.srsIndex + 1} / ${cards.length} (${card.unit})</span>
          <span>EFactor: <strong class="text-blue-600">${card.efactor.toFixed(2)}</strong> • Chu kỳ: <strong class="text-emerald-600">${card.interval} ngày</strong></span>
        </div>

        <div onclick="App.flipSrsCard()" class="perspective-1000 cursor-pointer h-72">
          <div class="w-full h-full relative transform-style-3d ${this.state.srsFlipped ? 'rotate-y-180' : ''}">
            <div class="absolute inset-0 backface-hidden academic-card p-8 flex flex-col items-center justify-center text-center">
              <span class="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 mb-3">${card.unit}</span>
              <h3 class="text-2xl font-extrabold text-slate-900">${card.word}</h3>
              <p class="text-sm text-slate-500 font-mono mt-1">${card.ipa}</p>
              <button onclick="event.stopPropagation(); AudioEngine.speak('${card.word.replace(/'/g, "\\'")}')" class="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-xs font-bold text-slate-700 transition">
                <i class="fa-solid fa-volume-high mr-1"></i> Phát âm US
              </button>
            </div>
            <div class="absolute inset-0 backface-hidden rotate-y-180 academic-card border-2 border-blue-500 p-8 flex flex-col items-center justify-center text-center bg-blue-50/30">
              <p class="text-xl font-extrabold text-emerald-700">${card.meaning}</p>
              <p class="text-xs text-slate-600 italic mt-3">"${card.example}"</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-2.5">
          <button onclick="App.rateSrsCard(1)" class="py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">1. Quên (1d)</button>
          <button onclick="App.rateSrsCard(3)" class="py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">2. Khó (2d)</button>
          <button onclick="App.rateSrsCard(4)" class="py-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">3. Tốt (4d)</button>
          <button onclick="App.rateSrsCard(5)" class="py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">4. Dễ (7d)</button>
        </div>
      </div>
    `;
  },

  flipSrsCard() {
    this.state.srsFlipped = !this.state.srsFlipped;
    this.render();
  },

  async rateSrsCard(quality) {
    const card = this.state.srsCards[this.state.srsIndex % this.state.srsCards.length];
    card.interval = quality < 3 ? 1 : Math.round(card.interval * card.efactor);
    this.state.srsFlipped = false;
    this.state.srsIndex = (this.state.srsIndex + 1) % this.state.srsCards.length;
    this.saveSrs();
    this.render();
  },

  startToeicTimer() {
    if (this.state.toeicTimerId) return;
    this.state.toeicTimerId = setInterval(() => {
      if (this.state.toeicTimeLeft > 0 && !this.state.toeicSubmitted) {
        this.state.toeicTimeLeft -= 1;
        const timerEl = document.getElementById("toeicTimerDisplay");
        if (timerEl) timerEl.textContent = this.formatTime(this.state.toeicTimeLeft);
      }
    }, 1000);
  },

  stopToeicTimer() {
    if (this.state.toeicTimerId) {
      clearInterval(this.state.toeicTimerId);
      this.state.toeicTimerId = null;
    }
  },

  formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  },

  renderToeic() {
    const exam = window.CoreData.toeicExam;
    return `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="academic-card p-6 space-y-3">
          <h3 class="font-extrabold text-base text-slate-900">${exam.title}</h3>
          <div class="text-slate-700 leading-relaxed">
            ${exam.passageHtml.replace(/bg-slate-900/g, "bg-slate-50").replace(/border-slate-700/g, "border-slate-200")}
          </div>
        </div>
        <div class="academic-card p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <span class="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <i class="fa-regular fa-clock mr-1"></i> <span id="toeicTimerDisplay">${this.formatTime(this.state.toeicTimeLeft)}</span>
            </span>
            <button onclick="App.submitToeic()" class="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">Nộp Bài & Chấm Điểm</button>
          </div>
          ${exam.questions.map(q => {
            const chosen = this.state.toeicAnswers[q.id];
            return `
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p class="text-xs font-bold text-slate-900">${q.id}. ${q.q}</p>
                <div class="space-y-1.5">
                  ${q.options.map((opt, idx) => `
                    <button onclick="App.selectToeic(${q.id}, ${idx})" class="w-full text-left px-3.5 py-2 rounded-lg text-xs border ${chosen === idx ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-white text-slate-700 border-slate-200'}">${opt}</button>
                  `).join("")}
                </div>
                ${this.state.toeicSubmitted ? `<p class="text-xs pt-2 font-semibold text-emerald-700">${q.explanation}</p>` : ""}
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  },

  selectToeic(qId, idx) {
    this.state.toeicAnswers[qId] = idx;
    this.render();
  },

  submitToeic() {
    this.state.toeicSubmitted = true;
    this.render();
  },

  renderAdmin() {
    return `
      <div class="academic-card p-6 space-y-4">
        <h3 class="font-extrabold text-base text-slate-900">AnyhtEnglish — Live REST API & JWT Request Telemetry</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs font-mono">
            <thead class="text-slate-500 border-b border-slate-200 bg-slate-50">
              <tr>
                <th class="py-2.5 px-3">Time</th>
                <th class="py-2.5 px-3">Method</th>
                <th class="py-2.5 px-3">Endpoint</th>
                <th class="py-2.5 px-3">Status</th>
                <th class="py-2.5 px-3">Latency</th>
                <th class="py-2.5 px-3">Role</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              ${window.ApiClient.logs.map(l => `
                <tr>
                  <td class="py-2.5 px-3 text-slate-500">${l.time}</td>
                  <td class="py-2.5 px-3 font-bold text-blue-600">${l.method}</td>
                  <td class="py-2.5 px-3 text-slate-800">${l.endpoint}</td>
                  <td class="py-2.5 px-3 text-emerald-600 font-bold">${l.status}</td>
                  <td class="py-2.5 px-3 text-amber-600">${l.latency}</td>
                  <td class="py-2.5 px-3 text-indigo-600 font-semibold">${l.role}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
});

// Khởi chạy ứng dụng sau khi toàn bộ 5 file Controller đã nạp xong
window.addEventListener("DOMContentLoaded", () => window.App.init());