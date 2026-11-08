window.App = {
  state: {
    activeTab: "roadmap48",
    activeUnit: "unit3",
    activeStep: "step2_typing",
    practiceSubPart: "part1",
    vocabFilter: "ALL",
    vocabStatusFilter: "ALL",
    searchQuery: "",
    selectedComponent: "cpu",
    // State Lộ trình 48 Ngày
    activeRoadmapPhase: "phase1",
    activeRoadmapDay: 1,
    activeRoadmapSubTab: "vocab_parts",
    activeDayVocabPartIdx: 0,
    activeDayGrammarPartIdx: 0,
    activeDayTypingScope: "ALL",
    completedRoadmapDays: {},
    roadmapBestScores: {}, // <-- VỊ TRÍ 1: Đã thêm biến lưu kỷ lục điểm >= 80% tại đây
    roadmapQuizAnswers: {},
    roadmapTestInputs: {},
    roadmapTestChoices: {},
    roadmapTestSubmitted: {},
    // State User & SRS
    user: { ...window.CoreData.user },
    srsCards: [],
    srsIndex: 0,
    srsFlipped: false,
    // State Luyện Gõ Từ Vựng
    typingInputs: {},
    typingChecked: {},
    typingHintShown: {},
    typingFocusedKey: null,
    typingMode: "SINGLE",
    typingCursor: 0,
    typingShuffledOrder: {},
    typingFinished: {},
    // State Bài tập CNTT & TOEIC
    mcqAnswers: {},
    clozeAnswers: {},
    matchingAnswers: {},
    translationResults: {},
    toeicAnswers: {},
    toeicFlags: {},
    toeicSubmitted: false,
    toeicTimeLeft: 600,
    toeicTimerId: null,
    highlightMode: false
  },

  init() {
    this.ensureRoadmapSidebarButton();

    const savedSrs = localStorage.getItem("anyht_english_srs") || localStorage.getItem("lingopro_srs");
    this.state.srsCards = savedSrs ? JSON.parse(savedSrs) : [...window.CoreData.initialSrsCards];

    const saved48 = localStorage.getItem("anyht_roadmap48_done");
    if (saved48) {
      try {
        this.state.completedRoadmapDays = JSON.parse(saved48);
      } catch (e) {}
    }

    // <-- VỊ TRÍ 2: Đã thêm lệnh đọc kỷ lục điểm 80% từ localStorage tại đây
    const savedScores = localStorage.getItem("anyht_roadmap48_scores");
    if (savedScores) {
      try {
        this.state.roadmapBestScores = JSON.parse(savedScores);
      } catch (e) {}
    }

    this.ensureShuffledOrder("unit1");
    this.ensureShuffledOrder("unit2");
    this.ensureShuffledOrder("unit3");
    this.ensureShuffledOrder("day1");
    this.updateSidebarStats();
    this.bindKeyboardShortcuts();
    this.switchTab("roadmap48");
  },

  ensureRoadmapSidebarButton() {
    const nav = document.getElementById("sidebarNav");
    if (!nav) return;
    if (!nav.querySelector('[data-tab="roadmap48"]')) {
      const btn = document.createElement("button");
      btn.setAttribute("onclick", "App.switchTab('roadmap48')");
      btn.setAttribute("data-tab", "roadmap48");
      btn.className = "nav-btn w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 transition";
      btn.innerHTML = `
        <div class="flex items-center gap-2.5 min-w-0">
          <i class="fa-solid fa-stairs w-4 text-center text-emerald-600 shrink-0"></i>
          <span class="whitespace-nowrap truncate">48 Ngày Lấy Gốc</span>
        </div>
        <span id="roadmap48Badge" class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap shrink-0">0/48</span>
      `;
      const dashboardBtn = nav.querySelector('[data-tab="dashboard"]');
      if (dashboardBtn && dashboardBtn.nextSibling) {
        nav.insertBefore(btn, dashboardBtn.nextSibling);
      } else {
        nav.prepend(btn);
      }
    }
  },

  saveSrs() {
    localStorage.setItem("anyht_english_srs", JSON.stringify(this.state.srsCards));
    this.updateSidebarStats();
  },

  saveRoadmap48Progress() {
    localStorage.setItem("anyht_roadmap48_done", JSON.stringify(this.state.completedRoadmapDays));
    this.updateSidebarStats();
  },

  getUnitById(unitId) {
    if (String(unitId).startsWith("day")) {
      const raw = String(unitId);
      const [dayPart, partIdxStr] = raw.split("__part__");
      const dayNum = parseInt(dayPart.replace("day", ""), 10);
      const dayObj = (window.Roadmap48Data?.days || []).find(d => d.day === dayNum);
      if (dayObj) {
        const allVocab = dayObj.vocab || [];
        const groups = [...new Set(allVocab.map(v => v.group || `Từ vựng Ngày ${dayNum}`))];
        if (partIdxStr !== undefined && groups[parseInt(partIdxStr, 10)]) {
          const gName = groups[parseInt(partIdxStr, 10)];
          return {
            id: raw,
            title: `Ngày ${dayNum} • ${gName}`,
            vocabulary: allVocab.filter(v => (v.group || `Từ vựng Ngày ${dayNum}`) === gName)
          };
        }
        return {
          id: `day${dayNum}`,
          title: `Ngày ${dayNum}: ${dayObj.title}`,
          vocabulary: allVocab
        };
      }
    }
    if (unitId === "unit1") return window.Unit1Data;
    if (unitId === "unit2") return window.Unit2Data;
    return window.Unit3Data || window.Unit1Data;
  },

  getCurrentUnitData() {
    return this.getUnitById(this.state.activeUnit);
  },

  calculateUnitMetrics(unitId) {
    const unit = this.getUnitById(unitId);
    if (!unit) return { vocabMastered: 0, vocabTotal: 0, mcqCorrect: 0, mcqTotal: 0, overallPercent: 0 };

    const vocabTotal = unit.vocabulary.length;
    const vocabMastered = unit.vocabulary.filter(item => this.getWordMasteryStatus(unitId, item) === "MASTERED").length;

    const mcqTotal = (unit.mcqs || []).length;
    const mcqCorrect = (unit.mcqs || []).filter(m => this.state.mcqAnswers[`${unitId}-${m.id}`] === m.correct).length;

    const totalTasks = vocabTotal + mcqTotal;
    const doneTasks = vocabMastered + mcqCorrect;
    const overallPercent = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

    return { vocabMastered, vocabTotal, mcqCorrect, mcqTotal, overallPercent };
  },

  updateSidebarStats() {
    const srsBadge = document.getElementById("srsBadge");
    if (srsBadge) srsBadge.textContent = this.state.srsCards.length;

    const done48Count = Object.values(this.state.completedRoadmapDays).filter(Boolean).length;
    const roadmapBadge = document.getElementById("roadmap48Badge");
    if (roadmapBadge) roadmapBadge.textContent = `${done48Count}/48`;

    const xpEl = document.getElementById("xpCount");
    if (xpEl) xpEl.textContent = this.state.user.xp.toLocaleString();
    const roleEl = document.getElementById("userRoleBadge");
    if (roleEl) roleEl.textContent = `Role: ${this.state.user.role}`;

    const unitProgressEl = document.getElementById("sidebarUnitProgress");
    if (unitProgressEl) {
      const p48 = Math.round((done48Count / 48) * 100);
      const units = [
        { id: "unit1", name: "Unit 1: Working in IT", sub: "40 từ • 25 câu trắc nghiệm" },
        { id: "unit2", name: "Unit 2: IT Systems", sub: "40 từ • 35 câu trắc nghiệm" },
        { id: "unit3", name: "Unit 3: Internet Browsing", sub: "15 từ • Luyện gõ trọng tâm" }
      ];
      unitProgressEl.innerHTML = `
        <p class="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">Tiến độ các học phần</p>
        <div class="space-y-2.5">
          <div onclick="App.switchTab('roadmap48')" class="p-3 rounded-xl border cursor-pointer transition ${this.state.activeTab === 'roadmap48' ? 'bg-emerald-50/80 border-emerald-300' : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70'}">
            <div class="flex items-center justify-between gap-2 text-xs font-bold ${this.state.activeTab === 'roadmap48' ? 'text-emerald-800' : 'text-slate-800'}">
              <span class="whitespace-nowrap truncate">48 Ngày Lấy Gốc</span>
              <span class="font-mono text-[11px] whitespace-nowrap shrink-0">${done48Count}/48 (${p48}%)</span>
            </div>
            <p class="text-[11px] text-slate-500 mt-0.5 truncate">Yêu cầu đạt ≥ 80% để qua ngày</p>
            <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
              <div class="h-full bg-emerald-600 transition-all duration-300" style="width: ${p48}%"></div>
            </div>
          </div>

          ${units.map(u => {
            const m = this.calculateUnitMetrics(u.id);
            const isCurrent = this.state.activeTab === "it_esp" && this.state.activeUnit === u.id;
            return `
              <div onclick="App.switchEspUnit('${u.id}'); App.switchTab('it_esp')" class="p-3 rounded-xl border cursor-pointer transition ${isCurrent ? 'bg-blue-50/70 border-blue-300' : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70'}">
                <div class="flex items-center justify-between gap-2 text-xs font-bold ${isCurrent ? 'text-blue-700' : 'text-slate-800'}">
                  <span class="whitespace-nowrap truncate">${u.name}</span>
                  <span class="font-mono text-[11px] whitespace-nowrap shrink-0">${m.overallPercent}%</span>
                </div>
                <p class="text-[11px] text-slate-500 mt-0.5 truncate">${u.sub}</p>
                <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div class="h-full bg-blue-600 transition-all duration-300" style="width: ${m.overallPercent}%"></div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `;
    }
  },

  toast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const colors = {
      success: "border-emerald-300 bg-emerald-50 text-emerald-900",
      error: "border-rose-300 bg-rose-50 text-rose-900",
      info: "border-blue-300 bg-blue-50 text-blue-900"
    };
    const el = document.createElement("div");
    el.className = `px-4 py-3 rounded-xl border text-xs font-semibold shadow-lg transition-all ${colors[type] || colors.info}`;
    el.innerHTML = message;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  },

  async toggleRole() {
    this.state.user.role = this.state.user.role === "ADMIN" ? "LEARNER" : "ADMIN";
    await window.ApiClient.request("PUT", "/api/auth/role", { role: this.state.user.role }, this.state.user.role);
    this.updateSidebarStats();
    this.toast(`Đã chuyển quyền JWT sang: <strong>${this.state.user.role}</strong>`, "info");
    if (this.state.activeTab === "admin") this.render();
  },

  resetAllProgress() {
    localStorage.removeItem("anyht_english_srs");
    localStorage.removeItem("anyht_roadmap48_done");
    localStorage.removeItem("anyht_roadmap48_scores"); // <-- VỊ TRÍ 3: Xóa điểm khi bấm Reset
    this.state.completedRoadmapDays = {};
    this.state.roadmapBestScores = {};
    this.state.roadmapQuizAnswers = {};
    this.state.roadmapTestInputs = {};
    this.state.roadmapTestChoices = {};
    this.state.roadmapTestSubmitted = {};
    this.state.typingInputs = {};
    this.state.typingChecked = {};
    this.state.typingHintShown = {};
    this.state.typingFinished = {};
    this.ensureShuffledOrder("unit1", true);
    this.ensureShuffledOrder("unit2", true);
    this.ensureShuffledOrder("unit3", true);
    this.ensureShuffledOrder("day1", true);
    this.state.typingCursor = 0;
    this.state.mcqAnswers = {};
    this.state.clozeAnswers = {};
    this.state.matchingAnswers = {};
    this.state.translationResults = {};
    this.state.toeicAnswers = {};
    this.state.toeicFlags = {};
    this.state.toeicSubmitted = false;
    this.state.toeicTimeLeft = 600;
    this.state.srsCards = [...window.CoreData.initialSrsCards];
    this.updateSidebarStats();
    this.render();
    this.toast("Đã đặt lại toàn bộ dữ liệu học tập về trạng thái ban đầu!", "info");
  },

  async switchTab(tab) {
    this.ensureRoadmapSidebarButton();
    this.state.activeTab = tab;
    if (tab === "toeic") this.startToeicTimer();
    else this.stopToeicTimer();

    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });
    const titles = {
      dashboard: "Báo Cáo & Phân Tích Năng Lực Học Tập",
      roadmap48: "Lộ Trình 48 Ngày Lấy Gốc Tiếng Anh Toàn Diện",
      it_esp: "Lộ Trình 4 Bước Khoa Học — Tiếng Anh CNTT",
      srs: "Ôn Tập Lặp Lại Ngắt Quãng (Spaced Repetition SM-2)",
      toeic: "Phòng Thi Mô Phỏng TOEIC Reading Part 7",
      admin: "Quản Trị Học Liệu CMS & REST API Telemetry"
    };
    const titleEl = document.getElementById("pageTitle");
    if (titleEl) titleEl.textContent = titles[tab] || "AnyhtEnglish";
    this.updateSidebarStats();
    await window.ApiClient.request("GET", `/api/views/${tab}`, null, this.state.user.role);
    this.render();
  },

  render() {
    const main = document.getElementById("mainView");
    if (!main) return;

    if (this.state.activeTab === "dashboard") main.innerHTML = this.renderDashboard();
    else if (this.state.activeTab === "roadmap48") main.innerHTML = this.renderRoadmap48();
    else if (this.state.activeTab === "it_esp") main.innerHTML = this.renderItEsp();
    else if (this.state.activeTab === "srs") main.innerHTML = this.renderSrs();
    else if (this.state.activeTab === "toeic") main.innerHTML = this.renderToeic();
    else if (this.state.activeTab === "admin") main.innerHTML = this.renderAdmin();

    if (this.state.typingFocusedKey) {
      const activeInput = document.getElementById(`input-${this.state.typingFocusedKey}`);
      if (activeInput) {
        activeInput.focus({ preventScroll: true });
        const len = activeInput.value.length;
        activeInput.setSelectionRange(len, len);
      }
    }
  },

  renderDashboard() {
    const m1 = this.calculateUnitMetrics("unit1");
    const m2 = this.calculateUnitMetrics("unit2");
    const m3 = this.calculateUnitMetrics("unit3");
    const totalMastered = m1.vocabMastered + m2.vocabMastered + m3.vocabMastered;
    const totalMcq = m1.mcqCorrect + m2.mcqCorrect + m3.mcqCorrect;
    const done48Count = Object.values(this.state.completedRoadmapDays).filter(Boolean).length;

    return `
      <div class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="academic-card p-5 cursor-pointer hover:border-emerald-400 transition" onclick="App.switchTab('roadmap48')">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-500 uppercase">Tháp 48 Ngày Lấy Gốc</span>
              <span class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs"><i class="fa-solid fa-stairs"></i></span>
            </div>
            <p class="text-2xl font-extrabold text-slate-900 mt-2 font-mono">${done48Count} <span class="text-sm font-normal text-slate-400">/ 48 bậc</span></p>
            <p class="text-xs text-emerald-600 font-medium mt-1">Yêu cầu đạt ≥ 80% để qua ngày</p>
          </div>

          <div class="academic-card p-5 cursor-pointer hover:border-blue-400 transition" onclick="App.switchTab('it_esp')">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-500 uppercase">Từ vựng CNTT đã thuộc</span>
              <span class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs"><i class="fa-solid fa-check-double"></i></span>
            </div>
            <p class="text-2xl font-extrabold text-slate-900 mt-2 font-mono">${totalMastered} <span class="text-sm font-normal text-slate-400">/ 95 từ</span></p>
            <p class="text-xs text-blue-600 font-medium mt-1">Unit 1 (40) • Unit 2 (40) • Unit 3 (15)</p>
          </div>

          <div class="academic-card p-5 cursor-pointer hover:border-indigo-400 transition" onclick="App.switchTab('it_esp')">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-500 uppercase">Trắc nghiệm CNTT</span>
              <span class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs"><i class="fa-solid fa-list-check"></i></span>
            </div>
            <p class="text-2xl font-extrabold text-slate-900 mt-2 font-mono">${totalMcq} <span class="text-sm font-normal text-slate-400">/ 64 câu</span></p>
            <p class="text-xs text-indigo-600 font-medium mt-1">Kèm sửa lỗi bài khoanh trên giấy</p>
          </div>

          <div class="academic-card p-5 cursor-pointer hover:border-amber-400 transition" onclick="App.switchTab('srs')">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-500 uppercase">Thẻ nhớ SRS SM-2</span>
              <span class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs"><i class="fa-solid fa-layer-group"></i></span>
            </div>
            <p class="text-2xl font-extrabold text-slate-900 mt-2 font-mono">${this.state.srsCards.length} <span class="text-sm font-normal text-slate-400">thẻ</span></p>
            <p class="text-xs text-slate-500 mt-1">Thuật toán lặp lại SuperMemo-2</p>
          </div>
        </div>
      </div>
    `;
  }
};