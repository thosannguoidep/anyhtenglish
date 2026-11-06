window.App = {
  state: {
    activeTab: "it_esp",
    activeUnit: "unit3",
    activeSubTab: "typing",
    vocabFilter: "ALL",
    searchQuery: "",
    selectedComponent: "cpu",
    user: { ...window.CoreData.user },
    srsCards: [],
    srsIndex: 0,
    srsFlipped: false,
    typingInputs: {},
    typingChecked: {},
    typingHintShown: {},
    typingFocusedKey: null,
    typingMode: "SINGLE",
    typingCursor: 0,
    typingShuffledOrder: {},
    typingFinished: {},
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
    const savedSrs = localStorage.getItem("lingopro_srs");
    this.state.srsCards = savedSrs ? JSON.parse(savedSrs) : [...window.CoreData.initialSrsCards];
    this.ensureShuffledOrder("unit1");
    this.ensureShuffledOrder("unit2");
    this.ensureShuffledOrder("unit3");
    this.updateSidebarStats();
    this.bindKeyboardShortcuts();
    this.switchTab("it_esp");
  },

  shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  },

  getUnitById(unitId) {
    if (unitId === "unit1") return window.Unit1Data;
    if (unitId === "unit2") return window.Unit2Data;
    return window.Unit3Data || window.Unit1Data;
  },

  ensureShuffledOrder(unitId, forceReshuffle = false) {
    const unit = this.getUnitById(unitId);
    if (!unit || !unit.vocabulary) return [];
    if (!this.state.typingShuffledOrder[unitId] || forceReshuffle) {
      const indices = unit.vocabulary.map((_, idx) => idx);
      this.state.typingShuffledOrder[unitId] = this.shuffleArray(indices);
    }
    return this.state.typingShuffledOrder[unitId];
  },

  restartUnitTyping(unitId) {
    const unit = this.getUnitById(unitId);
    if (!unit) return;

    unit.vocabulary.forEach(item => {
      const key = `${unitId}-type-${item.id}`;
      delete this.state.typingInputs[key];
      delete this.state.typingChecked[key];
      delete this.state.typingHintShown[key];
    });

    const newOrder = this.ensureShuffledOrder(unitId, true);
    this.state.typingCursor = 0;
    this.state.typingFinished[unitId] = false;

    const firstItem = unit.vocabulary[newOrder[0]];
    if (firstItem) {
      this.state.typingFocusedKey = `${unitId}-type-${firstItem.id}`;
    }

    this.render();
    this.toast("🔄 Đã trộn ngẫu nhiên bộ câu hỏi mới và quay lại từ đầu!", "info");
  },

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

  saveSrs() {
    localStorage.setItem("lingopro_srs", JSON.stringify(this.state.srsCards));
    this.updateSidebarStats();
  },

  updateSidebarStats() {
    const srsBadge = document.getElementById("srsBadge");
    if (srsBadge) srsBadge.textContent = this.state.srsCards.length;
    const xpEl = document.getElementById("xpCount");
    if (xpEl) xpEl.textContent = this.state.user.xp.toLocaleString();
    const roleEl = document.getElementById("userRoleBadge");
    if (roleEl) roleEl.textContent = `Role: ${this.state.user.role}`;
  },

  toast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const colors = {
      success: "border-emerald-500/40 bg-emerald-950/90 text-emerald-200",
      error: "border-rose-500/40 bg-rose-950/90 text-rose-200",
      info: "border-indigo-500/40 bg-slate-900/95 text-indigo-200"
    };
    const el = document.createElement("div");
    el.className = `px-4 py-2.5 rounded-xl border text-xs font-medium shadow-xl transition-all ${colors[type] || colors.info}`;
    el.innerHTML = message;
    container.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  },

  async toggleRole() {
    this.state.user.role = this.state.user.role === "ADMIN" ? "LEARNER" : "ADMIN";
    await window.ApiClient.request("PUT", "/api/auth/role", { role: this.state.user.role }, this.state.user.role);
    this.updateSidebarStats();
    this.toast(`Đã chuyển quyền JWT sang: <strong>${this.state.user.role}</strong>`, "info");
    if (this.state.activeTab === "admin") this.render();
  },

  resetAllProgress() {
    localStorage.removeItem("lingopro_srs");
    this.state.typingInputs = {};
    this.state.typingChecked = {};
    this.state.typingHintShown = {};
    this.state.typingFinished = {};
    this.ensureShuffledOrder("unit1", true);
    this.ensureShuffledOrder("unit2", true);
    this.ensureShuffledOrder("unit3", true);
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
    this.toast("Đã đặt lại toàn bộ tiến độ và trộn lại câu hỏi!", "info");
  },

  async switchTab(tab) {
    this.state.activeTab = tab;
    if (tab === "toeic") this.startToeicTimer();
    else this.stopToeicTimer();

    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });
    const titles = {
      dashboard: "Dashboard Phân Tích Học Tập",
      it_esp: "Tiếng Anh Chuyên Ngành CNTT (Unit 1, Unit 2 & Unit 3)",
      srs: "Flashcard Lặp Lại Ngắt Quãng (Thuật Toán SM-2)",
      toeic: "Phòng Thi Ảo TOEIC Reading Part 7",
      admin: "Admin CMS & Live REST API Inspector"
    };
    document.getElementById("pageTitle").textContent = titles[tab] || "LingoPro";
    await window.ApiClient.request("GET", `/api/views/${tab}`, null, this.state.user.role);
    this.render();
  },

  async switchEspUnit(unitId) {
    this.state.activeUnit = unitId;
    this.state.vocabFilter = "ALL";
    this.state.typingCursor = 0;
    this.ensureShuffledOrder(unitId);
    if (unitId !== "unit2" && this.state.activeSubTab === "lab") {
      this.state.activeSubTab = "typing";
    }
    await window.ApiClient.request("GET", `/api/units/${unitId}`, null, this.state.user.role);
    this.render();
  },

  switchEspSubTab(subTab) {
    this.state.activeSubTab = subTab;
    this.render();
  },

  getCurrentUnitData() {
    return this.getUnitById(this.state.activeUnit);
  },

  render() {
    const main = document.getElementById("mainView");
    if (!main) return;

    if (this.state.activeTab === "dashboard") main.innerHTML = this.renderDashboard();
    else if (this.state.activeTab === "it_esp") main.innerHTML = this.renderItEsp();
    else if (this.state.activeTab === "srs") main.innerHTML = this.renderSrs();
    else if (this.state.activeTab === "toeic") main.innerHTML = this.renderToeic();
    else if (this.state.activeTab === "admin") main.innerHTML = this.renderAdmin();

    if (this.state.activeTab === "it_esp" && this.state.activeSubTab === "typing" && this.state.typingFocusedKey) {
      const activeInput = document.getElementById(`input-${this.state.typingFocusedKey}`);
      if (activeInput) {
        activeInput.focus({ preventScroll: true });
        const len = activeInput.value.length;
        activeInput.setSelectionRange(len, len);
      }
    }
  },

  // ==========================================
  // 1. GIAO DIỆN DASHBOARD
  // ==========================================
  renderDashboard() {
    const u1Done = Object.keys(this.state.mcqAnswers).filter(k => k.startsWith("unit1-")).length;
    const u2Done = Object.keys(this.state.mcqAnswers).filter(k => k.startsWith("unit2-")).length;
    const typedDone = Object.values(this.state.typingChecked).filter(Boolean).length;

    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p class="text-xs text-slate-400">Tổng Từ Vựng CNTT</p>
          <p class="text-2xl font-black text-white mt-1">95 thuật ngữ</p>
          <p class="text-xs text-cyan-400 mt-1">Unit 1 (40) + Unit 2 (40) + Unit 3 (15)</p>
        </div>
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p class="text-xs text-slate-400">Đã Kiểm Tra Gõ Từ</p>
          <p class="text-2xl font-black text-emerald-400 mt-1">${typedDone} từ</p>
          <p class="text-xs text-slate-400 mt-1">Trộn ngẫu nhiên & làm lại</p>
        </div>
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p class="text-xs text-slate-400">Trắc Nghiệm Unit 1 & 2</p>
          <p class="text-2xl font-black text-indigo-400 mt-1">${u1Done + u2Done} / 60 câu</p>
          <p class="text-xs text-slate-400 mt-1">Kèm sửa lỗi bài khoanh trên giấy</p>
        </div>
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p class="text-xs text-slate-400">Bộ Thẻ Nhớ SM-2</p>
          <p class="text-2xl font-black text-amber-400 mt-1">${this.state.srsCards.length} thẻ</p>
          <p class="text-xs text-slate-400 mt-1">Ôn tập lặp lại ngắt quãng</p>
        </div>
      </div>

      <div class="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/60 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Mới Cập Nhật</span>
          <h3 class="text-xl font-bold text-white mt-2">Unit 3: Internet Browsing & Luyện Gõ Thẻ Ngẫu Nhiên</h3>
          <p class="text-sm text-slate-300 mt-1">Chỉ hiển thị màu Xanh/Đỏ sau khi hoàn thành câu và bấm Kiểm tra (hoặc nhấn phím Enter).</p>
        </div>
        <button onclick="App.switchEspUnit('unit3'); App.switchEspSubTab('typing'); App.switchTab('it_esp')" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shrink-0 transition shadow-lg shadow-emerald-600/30">
          Luyện Gõ Ngay <i class="fa-solid fa-keyboard ml-1.5"></i>
        </button>
      </div>
    `;
  },

  // ==========================================
  // 2. TIẾNG ANH CHUYÊN NGÀNH CNTT (UNIT 1, 2, 3)
  // ==========================================
  renderItEsp() {
    const unit = this.getCurrentUnitData();
    const subTabs = [
      { id: "typing", label: `✍️ Gõ Từ Vựng (${unit.vocabulary.length})`, icon: "fa-keyboard" },
      { id: "vocab", label: `I. Bảng Từ Vựng & IPA (${unit.vocabulary.length})`, icon: "fa-spell-check" },
      { id: "part1", label: `Part 1: Trắc Nghiệm (${unit.mcqs.length})`, icon: "fa-list-check" },
      { id: "part2", label: `Part 2: Điền Từ (${unit.cloze.title})`, icon: "fa-pen-to-square" },
      { id: "part3", label: `Part 3: Nối Từ (${unit.matching.length})`, icon: "fa-link" },
      { id: "part4", label: `Part 4: Dịch Thuật (${unit.translations.length})`, icon: "fa-language" }
    ];

    if (unit.id === "unit2") {
      subTabs.push({ id: "lab", label: "Lab: Sơ Đồ Phần Cứng", icon: "fa-microchip" });
    }

    return `
      <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">${unit.pages}</span>
            <h3 class="text-lg font-bold text-white">${unit.title}</h3>
          </div>
          <p class="text-xs text-slate-400 mt-1">${unit.description}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <button onclick="App.switchEspUnit('unit1')" class="px-3.5 py-2 rounded-xl text-xs font-bold transition ${this.state.activeUnit === 'unit1' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
            Unit 1: Working in IT (40 từ)
          </button>
          <button onclick="App.switchEspUnit('unit2')" class="px-3.5 py-2 rounded-xl text-xs font-bold transition ${this.state.activeUnit === 'unit2' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
            Unit 2: IT Systems (40 từ)
          </button>
          <button onclick="App.switchEspUnit('unit3')" class="px-3.5 py-2 rounded-xl text-xs font-bold transition ${this.state.activeUnit === 'unit3' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
            Unit 3: Internet Browsing (15 từ mới)
          </button>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        ${subTabs.map(t => `
          <button onclick="App.switchEspSubTab('${t.id}')" class="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${this.state.activeSubTab === t.id ? 'bg-slate-100 text-slate-900 shadow' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'}">
            <i class="fa-solid ${t.icon}"></i> ${t.label}
          </button>
        `).join("")}
      </div>

      <div>
        ${this.state.activeSubTab === "typing" ? this.renderEspTypingQuiz(unit) : ""}
        ${this.state.activeSubTab === "vocab" ? this.renderEspVocab(unit) : ""}
        ${this.state.activeSubTab === "part1" ? this.renderEspPart1(unit) : ""}
        ${this.state.activeSubTab === "part2" ? this.renderEspPart2(unit) : ""}
        ${this.state.activeSubTab === "part3" ? this.renderEspPart3(unit) : ""}
        ${this.state.activeSubTab === "part4" ? this.renderEspPart4(unit) : ""}
        ${this.state.activeSubTab === "lab" ? this.renderHardwareLab() : ""}
      </div>
    `;
  },

  // =========================================================================
  // CHẾ ĐỘ GÕ TỪNG CHỮ: CHỈ HIỆN MÀU XANH/ĐỎ SAU KHI BẤM "KIỂM TRA" / "ENTER"
  // =========================================================================
  normalizeAnswer(str) {
    return String(str || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  },

  getTargetCleanWord(rawWord) {
    return rawWord.replace(/\s*\([^)]*\)/g, "").trim();
  },

  focusTypingInput(key) {
    this.state.typingFocusedKey = key;
    const input = document.getElementById(`input-${key}`);
    if (input) {
      input.focus();
      const len = input.value.length;
      input.setSelectionRange(len, len);
    }
  },

  onInputFocus(unitId, itemId) {
    const key = `${unitId}-type-${itemId}`;
    this.state.typingFocusedKey = key;
    const unit = this.getCurrentUnitData();
    const item = unit.vocabulary.find(v => v.id === itemId);
    if (!item) return;
    const isChecked = Boolean(this.state.typingChecked[key]);
    const slotsContainer = document.getElementById(`slots-${key}`);
    if (slotsContainer) {
      slotsContainer.innerHTML = this.renderCharacterSlots(item.word, this.state.typingInputs[key] || "", true, isChecked);
    }
  },

  onInputBlur(unitId, itemId) {
    const key = `${unitId}-type-${itemId}`;
    if (this.state.typingFocusedKey === key) {
      this.state.typingFocusedKey = null;
    }
    const unit = this.getCurrentUnitData();
    const item = unit.vocabulary.find(v => v.id === itemId);
    if (!item) return;
    const isChecked = Boolean(this.state.typingChecked[key]);
    const slotsContainer = document.getElementById(`slots-${key}`);
    if (slotsContainer) {
      slotsContainer.innerHTML = this.renderCharacterSlots(item.word, this.state.typingInputs[key] || "", false, isChecked);
    }
  },

  // Hàm vẽ các ô chữ cái: chỉ tô màu xanh/đỏ khi isChecked === true
  renderCharacterSlots(targetWord, typedValue, isFocused = false, isChecked = false) {
    const cleanTarget = this.getTargetCleanWord(targetWord);
    const chars = cleanTarget.split("");
    const typedChars = String(typedValue || "").split("");
    const activeIndex = typedChars.length;

    return `
      <div class="flex flex-wrap items-center gap-1.5 mt-3 select-none cursor-text">
        ${chars.map((ch, idx) => {
          if (ch === " ") {
            return `<span class="w-4 h-9 inline-flex items-center justify-center text-slate-300 font-mono text-xs">␣</span>`;
          }
          const userCh = typedChars[idx];
          const isCurrentBox = isFocused && idx === activeIndex && !isChecked;
          let boxStyle = "border-slate-300 bg-slate-100 text-slate-400";
          let displayContent = "";

          if (userCh !== undefined) {
            displayContent = userCh;
            if (isChecked) {
              // ĐÃ BẤM KIỂM TRA: Mới xuất hiện màu Xanh lá (đúng) hoặc Đỏ (sai)
              if (userCh.toLowerCase() === ch.toLowerCase()) {
                boxStyle = "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold shadow-sm";
              } else {
                boxStyle = "border-rose-500 bg-rose-50 text-rose-600 font-bold shadow-sm";
              }
            } else {
              // ĐANG GÕ (CHƯA KIỂM TRA): Giữ màu trung tính, không báo xanh/đỏ
              boxStyle = "border-slate-400 bg-white text-slate-800 font-bold shadow-sm";
            }
          } else if (isChecked) {
            // Đã bấm Kiểm tra nhưng ô này bị bỏ trống chưa gõ đủ
            boxStyle = "border-rose-300 bg-rose-50/50 text-rose-400";
            displayContent = "_";
          } else if (isCurrentBox) {
            boxStyle = "border-indigo-600 bg-indigo-50/80 text-indigo-600 ring-2 ring-indigo-500/30";
            displayContent = `<span class="animate-pulse font-normal text-indigo-500">|</span>`;
          }

          return `
            <span class="w-8 h-9 rounded-md border-2 border-b-4 flex items-center justify-center text-sm font-mono transition-all ${boxStyle}">
              ${displayContent}
            </span>
          `;
        }).join("")}
      </div>
    `;
  },

  renderSingleShortAnswerCard(unit, item, displayIndex, totalCount) {
    const key = `${unit.id}-type-${item.id}`;
    const typedVal = this.state.typingInputs[key] || "";
    const isChecked = Boolean(this.state.typingChecked[key]);
    const showHint = this.state.typingHintShown[key];
    const isFocused = this.state.typingFocusedKey === key;

    const cleanTarget = this.getTargetCleanWord(item.word);
    const isCorrect =
      this.normalizeAnswer(typedVal) === this.normalizeAnswer(cleanTarget) ||
      this.normalizeAnswer(typedVal) === this.normalizeAnswer(item.word);

    return `
      <div id="card-${key}" class="rounded-2xl bg-white text-slate-900 p-6 shadow-xl border-2 ${isChecked ? (isCorrect ? 'border-emerald-500' : 'border-rose-500') : 'border-slate-200'} transition-all relative z-10">
        <!-- Hộp câu hỏi Tiếng Việt phía trên -->
        <div class="bg-slate-100 px-5 py-4 rounded-lg border-b-2 border-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
              THẺ NGẪU NHIÊN ${displayIndex + 1} / ${totalCount} • ${item.group || "Từ vựng"} ${item.ipa ? `• ${item.ipa}` : ""}
            </span>
            <h4 class="text-lg font-bold text-slate-900">${item.meaning}</h4>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <button type="button" onclick="AudioEngine.speak('${cleanTarget.replace(/'/g, "\\'")}', 1.0)" class="px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50 text-indigo-600 border border-slate-300 text-xs font-semibold shadow-sm transition">
              <i class="fa-solid fa-volume-high mr-1"></i> Nghe mẫu
            </button>
            <button type="button" onclick="App.toggleTypingHint('${key}')" class="px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-50 text-amber-600 border border-slate-300 text-xs font-semibold shadow-sm transition">
              <i class="fa-regular fa-lightbulb"></i> Gợi ý
            </button>
          </div>
        </div>

        ${showHint ? `
          <div class="mt-3 px-3.5 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <span>💡 Gợi ý: Bắt đầu bằng chữ <strong>"${cleanTarget[0]}"</strong> (${cleanTarget.length} ký tự): <code class="font-mono font-bold">${cleanTarget[0]}${cleanTarget.slice(1).replace(/[a-zA-Z]/g, "_")}</code></span>
            <button type="button" onclick="App.revealTypingAnswer('${unit.id}', ${item.id}, '${cleanTarget.replace(/'/g, "\\'")}')" class="text-indigo-600 font-bold hover:underline ml-2">Hiện đáp án</button>
          </div>
        ` : ""}

        <label for="input-${key}" onclick="App.focusTypingInput('${key}')" class="block mt-5 cursor-text">
          <div class="relative">
            <input
              id="input-${key}"
              type="text"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              placeholder="Nhấp vào đây hoặc ô vuông bên dưới để gõ (Văn bản câu trả lời ngắn)..."
              value="${typedVal.replace(/"/g, "&quot;")}"
              onfocus="App.onInputFocus('${unit.id}', ${item.id})"
              onblur="App.onInputBlur('${unit.id}', ${item.id})"
              oninput="App.onTypingInput('${unit.id}', ${item.id}, this.value)"
              onkeydown="if(event.key === 'Enter') { event.preventDefault(); App.handleTypingEnter('${unit.id}', ${item.id}); }"
              style="pointer-events: auto !important; user-select: text !important;"
              class="w-full px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-b-2 border-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/15 text-base font-medium text-slate-900 placeholder-slate-400 focus:outline-none transition"
            />
          </div>

          <div id="slots-${key}" title="Nhấp vào đây để gõ từng chữ cái">
            ${this.renderCharacterSlots(item.word, typedVal, isFocused, isChecked)}
          </div>
        </label>

        <div class="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div class="text-xs" id="feedback-${key}">
            ${isChecked ? (
              isCorrect
                ? `<span class="font-bold text-emerald-600"><i class="fa-solid fa-circle-check mr-1"></i> Chính xác tuyệt đối! (${item.word}) — Ấn <strong>Enter</strong> lần nữa để sang câu tiếp</span>`
                : `<span class="font-bold text-rose-600"><i class="fa-solid fa-circle-xmark mr-1"></i> Chưa khớp. Đáp án đúng là: <strong class="underline">${cleanTarget}</strong></span>`
            ) : `<span class="text-slate-500"><i class="fa-regular fa-keyboard mr-1 text-indigo-500"></i> Gõ xong câu rồi bấm <strong>Kiểm tra</strong> (hoặc ấn <strong>Enter</strong>) để hiện màu kết quả</span>`}
          </div>

          <div class="flex items-center gap-2">
            ${typedVal ? `
              <button type="button" onclick="App.clearTypingItem('${unit.id}', ${item.id})" class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-semibold transition">
                Xóa chữ
              </button>
            ` : ""}
            <button type="button" onclick="App.revealTypingAnswer('${unit.id}', ${item.id}, '${cleanTarget.replace(/'/g, "\\'")}')" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition">
              Điền mẫu
            </button>
            <button type="button" onclick="App.checkTypingItem('${unit.id}', ${item.id})" class="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition">
              Kiểm tra
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderTypingCompletionScreen(unit, correctCount, total) {
    const percent = Math.round((correctCount / total) * 100);
    const order = this.ensureShuffledOrder(unit.id);

    return `
      <div class="max-w-2xl mx-auto rounded-3xl bg-slate-900 border-2 border-emerald-500/40 p-8 text-center shadow-2xl space-y-6">
        <div class="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
          <i class="fa-solid fa-trophy"></i>
        </div>

        <div>
          <span class="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
            Hoàn thành lượt luyện thẻ ngẫu nhiên
          </span>
          <h3 class="text-2xl font-black text-white mt-3">Bạn đã hoàn thành ${total} / ${total} thẻ!</h3>
          <p class="text-sm text-slate-300 mt-1">
            Số câu gõ chính xác: <strong class="text-emerald-400">${correctCount} / ${total}</strong> từ (${percent}%)
          </p>
        </div>

        <div class="max-h-60 overflow-y-auto rounded-2xl bg-slate-950 border border-slate-800 p-4 text-left divide-y divide-slate-800/80">
          ${order.map((vocabIdx, stepIdx) => {
            const item = unit.vocabulary[vocabIdx];
            const key = `${unit.id}-type-${item.id}`;
            const userVal = this.state.typingInputs[key] || "";
            const clean = this.getTargetCleanWord(item.word);
            const ok =
              this.normalizeAnswer(userVal) === this.normalizeAnswer(clean) ||
              this.normalizeAnswer(userVal) === this.normalizeAnswer(item.word);
            return `
              <div class="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span class="text-slate-500 font-mono mr-1.5">#${stepIdx + 1}</span>
                  <strong class="text-white">${item.meaning}</strong>
                  <span class="text-indigo-300 ml-2">→ ${item.word}</span>
                </div>
                <span class="font-bold shrink-0 ${ok ? 'text-emerald-400' : 'text-rose-400'}">
                  ${ok ? '✓ Đúng' : `✗ (${userVal || 'Chưa gõ'})`}
                </span>
              </div>
            `;
          }).join("")}
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onclick="App.restartUnitTyping('${unit.id}')"
            class="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
          >
            <i class="fa-solid fa-rotate-left"></i> Quay lại làm lại từ đầu (Trộn ngẫu nhiên mới)
          </button>

          <button
            type="button"
            onclick="App.reviewCompletedCards('${unit.id}')"
            class="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
          >
            Xem lại các thẻ vừa gõ
          </button>
        </div>
      </div>
    `;
  },

  reviewCompletedCards(unitId) {
    this.state.typingFinished[unitId] = false;
    this.state.typingCursor = 0;
    this.render();
  },

  renderEspTypingQuiz(unit) {
    const vocabList = unit.vocabulary;
    const total = vocabList.length;
    const shuffledOrder = this.ensureShuffledOrder(unit.id);

    // Chỉ tính điểm các câu đã bấm Kiểm tra và gõ đúng
    const correctCount = vocabList.filter(item => {
      const key = `${unit.id}-type-${item.id}`;
      if (!this.state.typingChecked[key]) return false;
      const val = this.state.typingInputs[key] || "";
      const clean = this.getTargetCleanWord(item.word);
      return this.normalizeAnswer(val) === this.normalizeAnswer(clean) ||
             this.normalizeAnswer(val) === this.normalizeAnswer(item.word);
    }).length;

    const currentRandomIdx = shuffledOrder[this.state.typingCursor % total];
    const currentItem = vocabList[currentRandomIdx];
    const isLastCard = (this.state.typingCursor % total) === total - 1;

    return `
      <div class="space-y-5">
        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 class="text-sm font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-keyboard text-emerald-400"></i>
              Bài Tập Gõ Từ Vựng Tiếng Anh — Kiểu "Văn Bản Câu Trả Lời Ngắn"
            </h4>
            <p class="text-xs text-slate-400 mt-0.5">
              Đã kiểm tra & đúng: <strong class="text-emerald-400">${correctCount} / ${total}</strong> từ • Màu đúng/sai chỉ hiện sau khi bấm <strong>Kiểm tra</strong>.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <button type="button" onclick="App.restartUnitTyping('${unit.id}')" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition">
              <i class="fa-solid fa-shuffle mr-1"></i> Trộn Ngẫu Nhiên & Làm Lại
            </button>
            <button type="button" onclick="App.setTypingMode('FORM')" class="px-3 py-1.5 rounded-xl text-xs font-bold transition ${this.state.typingMode === 'FORM' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}">
              <i class="fa-solid fa-list mr-1"></i> Dạng Danh Sách
            </button>
            <button type="button" onclick="App.setTypingMode('SINGLE')" class="px-3 py-1.5 rounded-xl text-xs font-bold transition ${this.state.typingMode === 'SINGLE' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}">
              <i class="fa-solid fa-rectangle-list mr-1"></i> Luyện Từng Thẻ
            </button>
          </div>
        </div>

        ${this.state.typingMode === "FORM" ? `
          <div class="space-y-4 max-w-3xl mx-auto">
            ${shuffledOrder.map((vocabIdx, displayIdx) => this.renderSingleShortAnswerCard(unit, vocabList[vocabIdx], displayIdx, total)).join("")}
            <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span class="text-xs text-slate-300">Đã kiểm tra đúng: <strong class="text-emerald-400">${correctCount} / ${total}</strong> câu</span>
              <button type="button" onclick="App.restartUnitTyping('${unit.id}')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition">
                <i class="fa-solid fa-rotate-left mr-1"></i> Quay lại làm lại từ đầu (Trộn mới)
              </button>
            </div>
          </div>
        ` : (
          this.state.typingFinished[unit.id]
            ? this.renderTypingCompletionScreen(unit, correctCount, total)
            : `
              <div class="max-w-2xl mx-auto space-y-4">
                ${this.renderSingleShortAnswerCard(unit, currentItem, this.state.typingCursor % total, total)}

                <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onclick="App.moveTypingCursor(-1, ${total})"
                    ${this.state.typingCursor === 0 ? "disabled" : ""}
                    class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-slate-200 transition"
                  >
                    <i class="fa-solid fa-arrow-left mr-1"></i> Câu trước
                  </button>

                  <div class="flex items-center gap-3">
                    <span class="text-xs text-slate-400 font-mono">Từ ${(this.state.typingCursor % total) + 1} / ${total}</span>
                    <button
                      type="button"
                      onclick="App.restartUnitTyping('${unit.id}')"
                      class="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 text-xs font-semibold transition"
                    >
                      <i class="fa-solid fa-rotate-left mr-1"></i> Làm lại từ đầu
                    </button>
                  </div>

                  ${isLastCard ? `
                    <button
                      type="button"
                      onclick="App.finishTypingSession('${unit.id}')"
                      class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition"
                    >
                      Hoàn thành & Xem kết quả <i class="fa-solid fa-flag-checkered ml-1"></i>
                    </button>
                  ` : `
                    <button
                      type="button"
                      onclick="App.moveTypingCursor(1, ${total})"
                      class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition"
                    >
                      Câu tiếp theo <i class="fa-solid fa-arrow-right ml-1"></i>
                    </button>
                  `}
                </div>
              </div>
            `
        )}
      </div>
    `;
  },

  finishTypingSession(unitId) {
    this.state.typingFinished[unitId] = true;
    window.AudioEngine.playTone("success");
    this.render();
  },

  setTypingMode(mode) {
    this.state.typingMode = mode;
    this.render();
  },

  moveTypingCursor(step, total) {
    const nextCursor = this.state.typingCursor + step;
    if (nextCursor < 0) return;
    if (nextCursor >= total) {
      this.finishTypingSession(this.state.activeUnit);
      return;
    }
    this.state.typingCursor = nextCursor;
    const unit = this.getCurrentUnitData();
    const order = this.ensureShuffledOrder(unit.id);
    const currentItem = unit.vocabulary[order[this.state.typingCursor]];
    if (currentItem) {
      this.state.typingFocusedKey = `${unit.id}-type-${currentItem.id}`;
    }
    this.render();
  },

  // Khi đang gõ: đặt trạng thái về chưa kiểm tra (isChecked = false) để ẩn mọi màu xanh/đỏ
  onTypingInput(unitId, itemId, value) {
    const key = `${unitId}-type-${itemId}`;
    this.state.typingInputs[key] = value;
    this.state.typingChecked[key] = false;
    this.state.typingFocusedKey = key;

    const unit = this.getCurrentUnitData();
    const item = unit.vocabulary.find(v => v.id === itemId);
    if (!item) return;

    const slotsContainer = document.getElementById(`slots-${key}`);
    if (slotsContainer) {
      slotsContainer.innerHTML = this.renderCharacterSlots(item.word, value, true, false);
    }

    const cardEl = document.getElementById(`card-${key}`);
    if (cardEl) {
      cardEl.className = "rounded-2xl bg-white text-slate-900 p-6 shadow-xl border-2 border-slate-200 transition-all relative z-10";
    }

    const fb = document.getElementById(`feedback-${key}`);
    if (fb) {
      fb.innerHTML = `<span class="text-slate-500"><i class="fa-regular fa-keyboard mr-1 text-indigo-500"></i> Gõ xong câu rồi bấm <strong>Kiểm tra</strong> (hoặc ấn <strong>Enter</strong>) để hiện màu kết quả</span>`;
    }
  },

  // Xử lý phím Enter: Lần 1 -> Kiểm tra & hiện màu; Lần 2 (nếu đã kiểm tra và đúng) -> Qua thẻ tiếp theo
  handleTypingEnter(unitId, itemId) {
    const key = `${unitId}-type-${itemId}`;
    const unit = this.getCurrentUnitData();
    const order = this.ensureShuffledOrder(unitId);
    const item = unit.vocabulary.find(v => v.id === itemId);
    if (!item) return;

    const val = this.state.typingInputs[key] || "";
    const cleanTarget = this.getTargetCleanWord(item.word);
    const isCorrect =
      this.normalizeAnswer(val) === this.normalizeAnswer(cleanTarget) ||
      this.normalizeAnswer(val) === this.normalizeAnswer(item.word);

    // Nếu câu này ĐÃ bấm Kiểm tra rồi và đúng -> Ấn Enter sẽ chuyển sang câu tiếp theo
    if (this.state.typingChecked[key] && isCorrect) {
      if (this.state.typingMode === "SINGLE") {
        if (this.state.typingCursor + 1 >= order.length) {
          this.finishTypingSession(unitId);
        } else {
          this.moveTypingCursor(1, order.length);
        }
      } else {
        const currentPosInOrder = order.findIndex(vIdx => unit.vocabulary[vIdx].id === itemId);
        if (currentPosInOrder !== -1 && currentPosInOrder + 1 < order.length) {
          const nextItem = unit.vocabulary[order[currentPosInOrder + 1]];
          this.state.typingFocusedKey = `${unitId}-type-${nextItem.id}`;
          this.render();
        }
      }
      return;
    }

    // Nếu chưa kiểm tra -> Thực hiện kiểm tra và xuất hiện màu Xanh/Đỏ
    this.checkTypingItem(unitId, itemId);
  },

  clearTypingItem(unitId, itemId) {
    const key = `${unitId}-type-${itemId}`;
    delete this.state.typingInputs[key];
    delete this.state.typingChecked[key];
    this.state.typingFocusedKey = key;
    this.render();
  },

  checkTypingItem(unitId, itemId) {
    const key = `${unitId}-type-${itemId}`;
    this.state.typingChecked[key] = true;
    this.state.typingFocusedKey = key;

    const unit = this.getCurrentUnitData();
    const item = unit.vocabulary.find(v => v.id === itemId);
    if (!item) return;

    const val = this.state.typingInputs[key] || "";
    const cleanTarget = this.getTargetCleanWord(item.word);
    const isCorrect =
      this.normalizeAnswer(val) === this.normalizeAnswer(cleanTarget) ||
      this.normalizeAnswer(val) === this.normalizeAnswer(item.word);

    if (isCorrect) {
      window.AudioEngine.playTone("success");
      window.AudioEngine.speak(cleanTarget, 1.0);
      this.state.user.xp += 15;
      this.updateSidebarStats();
    } else {
      window.AudioEngine.playTone("error");
    }
    this.render();
  },

  toggleTypingHint(key) {
    this.state.typingHintShown[key] = !this.state.typingHintShown[key];
    this.state.typingFocusedKey = key;
    this.render();
  },

  revealTypingAnswer(unitId, itemId, answerText) {
    const key = `${unitId}-type-${itemId}`;
    this.state.typingInputs[key] = answerText;
    this.state.typingChecked[key] = true;
    this.state.typingFocusedKey = key;
    window.AudioEngine.speak(answerText, 1.0);
    this.render();
  },

  // ==========================================
  // BẢNG TỪ VỰNG & CÁC PHẦN KHÁC GIỮ NGUYÊN
  // ==========================================
  renderEspVocab(unit) {
    const groups = ["ALL", ...new Set(unit.vocabulary.map(v => v.group))];
    const filtered = unit.vocabulary.filter(v => {
      const matchGroup = this.state.vocabFilter === "ALL" || v.group === this.state.vocabFilter;
      const matchSearch = !this.state.searchQuery ||
        v.word.toLowerCase().includes(this.state.searchQuery.toLowerCase()) ||
        v.meaning.toLowerCase().includes(this.state.searchQuery.toLowerCase());
      return matchGroup && matchSearch;
    });

    return `
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex flex-wrap gap-1.5">
            ${groups.map(g => `
              <button onclick="App.setVocabFilter('${g}')" class="px-3 py-1 rounded-lg text-xs font-medium transition ${this.state.vocabFilter === g ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'}">
                ${g}
              </button>
            `).join("")}
          </div>
          <input type="text" placeholder="Tìm nhanh từ vựng..." value="${this.state.searchQuery}" oninput="App.setSearchQuery(this.value)" class="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 w-full sm:w-64" />
        </div>

        <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
          <table class="w-full text-left text-xs">
            <thead class="bg-cyan-500/20 text-cyan-200 uppercase border-b border-slate-800">
              <tr>
                <th class="py-3 px-4">#</th>
                <th class="py-3 px-4">Từ vựng / Cụm từ</th>
                <th class="py-3 px-4">Phiên âm (IPA)</th>
                <th class="py-3 px-4">Nghĩa tiếng Việt</th>
                <th class="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              ${filtered.map(item => `
                <tr class="hover:bg-slate-800/60 transition">
                  <td class="py-3 px-4 font-mono text-slate-400">${item.id}</td>
                  <td class="py-3 px-4 font-bold text-white text-sm">${item.word}</td>
                  <td class="py-3 px-4 font-mono text-indigo-300">${item.ipa || "/IT Term/"}</td>
                  <td class="py-3 px-4 text-emerald-400 font-medium">${item.meaning}</td>
                  <td class="py-3 px-4 text-right space-x-1">
                    <button onclick="AudioEngine.speak('${item.word.replace(/'/g, "\\'")}', 1.0)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 transition">
                      <i class="fa-solid fa-volume-high"></i>
                    </button>
                    <button onclick="AudioEngine.speak('${item.word.replace(/'/g, "\\'")}', 0.65)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-200 transition">
                      🐢
                    </button>
                    <button onclick="App.addWordToSrs('${item.word.replace(/'/g, "\\'")}', '${item.meaning.replace(/'/g, "\\'")}', '${unit.title}')" class="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition">
                      + SRS
                    </button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  setVocabFilter(group) {
    this.state.vocabFilter = group;
    this.render();
  },

  setSearchQuery(val) {
    this.state.searchQuery = val;
    this.render();
  },

  async addWordToSrs(word, meaning, unitTitle) {
    const exists = this.state.srsCards.some(c => c.word.toLowerCase() === word.toLowerCase());
    if (exists) {
      this.toast(`Từ <strong>${word}</strong> đã có trong bộ thẻ SRS!`, "info");
      return;
    }
    const newCard = {
      id: "srs-" + Date.now(),
      word,
      ipa: "/IT Term/",
      pos: "term",
      meaning,
      example: `Technical vocabulary from ${unitTitle}.`,
      unit: unitTitle,
      efactor: 2.5,
      interval: 1,
      repetitions: 0
    };
    this.state.srsCards.unshift(newCard);
    this.saveSrs();
    await window.ApiClient.request("POST", "/api/vocab/srs", newCard, this.state.user.role);
    this.toast(`Đã thêm <strong>${word}</strong> vào bộ thẻ nhớ SM-2!`, "success");
  },

  renderEspPart1(unit) {
    const correctionItems = unit.mcqs.filter(m => m.noteCorrection);
    return `
      <div class="space-y-4">
        ${correctionItems.length ? `
          <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <i class="fa-solid fa-magnifying-glass-chart"></i> Phân Tích Bài Khoanh Trên Giấy Của Bạn (${unit.title})
              </h4>
              <button onclick="App.fillPaperMcqAnswers('${unit.id}')" class="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold border border-amber-500/30 transition">
                Nạp đáp án bạn đã khoanh trên giấy
              </button>
            </div>
            ${correctionItems.map(c => `
              <p class="text-xs text-amber-100/90 leading-relaxed">• <strong>Câu ${c.id}:</strong> ${c.noteCorrection}</p>
            `).join("")}
          </div>
        ` : ""}

        <div class="space-y-3">
          ${unit.mcqs.map(item => {
            const key = `${unit.id}-${item.id}`;
            const chosen = this.state.mcqAnswers[key];
            const isAnswered = chosen !== undefined;
            return `
              <div class="p-4 rounded-2xl bg-slate-900 border ${isAnswered ? (chosen === item.correct ? 'border-emerald-500/40' : 'border-rose-500/40') : 'border-slate-800'} space-y-3">
                <div class="flex items-start justify-between gap-3">
                  <p class="font-semibold text-sm text-white">${item.q}</p>
                  <button onclick="AudioEngine.speak('${item.q.replace(/'/g, "\\'")}')" class="text-xs text-slate-400 hover:text-cyan-400 shrink-0">
                    <i class="fa-solid fa-volume-high"></i>
                  </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  ${item.options.map((opt, idx) => {
                    let btnClass = "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700";
                    if (isAnswered) {
                      if (idx === item.correct) btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-200 font-semibold";
                      else if (idx === chosen) btnClass = "bg-rose-500/20 border-rose-500 text-rose-200";
                    }
                    return `
                      <button onclick="App.answerMcq('${unit.id}', ${item.id}, ${idx}, ${item.correct})" class="text-left px-3.5 py-2.5 rounded-xl border text-xs transition ${btnClass}">
                        ${opt}
                      </button>
                    `;
                  }).join("")}
                </div>
                ${isAnswered ? `
                  <div class="text-xs p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-300">
                    <strong class="${chosen === item.correct ? 'text-emerald-400' : 'text-rose-400'}">${chosen === item.correct ? '✓ Chính xác!' : '✗ Chưa đúng.'}</strong> ${item.explanation}
                  </div>
                ` : ""}
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  },

  async answerMcq(unitId, qId, choiceIdx, correctIdx) {
    this.state.mcqAnswers[`${unitId}-${qId}`] = choiceIdx;
    if (choiceIdx === correctIdx) {
      window.AudioEngine.playTone("success");
      this.state.user.xp += 10;
    } else {
      window.AudioEngine.playTone("error");
    }
    this.updateSidebarStats();
    await window.ApiClient.request("POST", `/api/units/${unitId}/mcq`, { qId, choiceIdx }, this.state.user.role);
    this.render();
  },

  fillPaperMcqAnswers(unitId) {
    const unit = this.getCurrentUnitData();
    unit.mcqs.forEach(m => {
      this.state.mcqAnswers[`${unitId}-${m.id}`] = m.paperChoice;
    });
    this.render();
    this.toast("Đã nạp toàn bộ đáp án trên giấy của bạn để đối chiếu!", "info");
  },

  renderEspPart2(unit) {
    return `
      <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 class="font-bold text-base text-white">PART 2: TEXT COMPLETION — ${unit.cloze.title}</h4>
            <p class="text-xs text-slate-400">Chọn từ thích hợp trong hộp từ vựng cho các vị trí trống bên dưới.</p>
          </div>
          <button onclick="App.fillCorrectCloze('${unit.id}')" class="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition">
            Điền Đáp Án Chuẩn
          </button>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap gap-2">
          ${unit.cloze.wordBank.map(w => `
            <span class="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300">${w}</span>
          `).join("")}
        </div>

        <div class="space-y-3">
          ${unit.cloze.blanks.map(b => {
            const key = `${unit.id}-cloze-${b.index}`;
            const val = this.state.clozeAnswers[key] || "";
            const isCorrect = val.toLowerCase() === b.answer.toLowerCase();
            return `
              <div class="p-3.5 rounded-xl bg-slate-950/80 border ${val ? (isCorrect ? 'border-emerald-500/40' : 'border-rose-500/40') : 'border-slate-800'} flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p class="text-xs text-slate-200 leading-relaxed">${b.context}</p>
                <div class="flex items-center gap-2 shrink-0">
                  <select onchange="App.selectCloze('${unit.id}', ${b.index}, this.value)" class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white">
                    <option value="">-- Chọn từ (${b.index}) --</option>
                    ${unit.cloze.wordBank.map(w => `<option value="${w}" ${val === w ? "selected" : ""}>${w}</option>`).join("")}
                  </select>
                  ${val ? `<span class="text-xs font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}">${isCorrect ? '✓' : '✗'}</span>` : ""}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  },

  selectCloze(unitId, index, value) {
    this.state.clozeAnswers[`${unitId}-cloze-${index}`] = value;
    this.render();
  },

  fillCorrectCloze(unitId) {
    const unit = this.getCurrentUnitData();
    unit.cloze.blanks.forEach(b => {
      this.state.clozeAnswers[`${unitId}-cloze-${b.index}`] = b.answer;
    });
    this.render();
    this.toast("Đã điền đầy đủ từ khóa chính xác!", "success");
  },

  renderEspPart3(unit) {
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    return `
      <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 class="font-bold text-base text-white">PART 3: MATCHING (Nối Thuật Ngữ Với Định Nghĩa)</h4>
          </div>
          <button onclick="App.fillCorrectMatching('${unit.id}')" class="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition">
            Nạp Đáp Án Chuẩn
          </button>
        </div>

        <div class="space-y-2.5">
          ${unit.matching.map(m => {
            const key = `${unit.id}-match-${m.id}`;
            const val = this.state.matchingAnswers[key] || "";
            const isCorrect = val === m.correctLetter;
            return `
              <div class="p-3.5 rounded-xl bg-slate-950 border ${val ? (isCorrect ? 'border-emerald-500/40' : 'border-rose-500/40') : 'border-slate-800'} flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <span class="font-bold text-xs text-indigo-300 w-48 shrink-0">${m.term}</span>
                  <span class="text-xs text-slate-300">${m.definition}</span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <select onchange="App.selectMatching('${unit.id}', ${m.id}, this.value)" class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white">
                    <option value="">Chọn đáp án</option>
                    ${letters.slice(0, unit.matching.length).map(l => `<option value="${l}" ${val === l ? "selected" : ""}>Đáp án ${l}</option>`).join("")}
                  </select>
                  ${val ? `<span class="text-xs font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}">${isCorrect ? '✓ Đúng' : `✗ (Đúng: ${m.correctLetter})`}</span>` : ""}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  },

  selectMatching(unitId, id, letter) {
    this.state.matchingAnswers[`${unitId}-match-${id}`] = letter;
    this.render();
  },

  fillCorrectMatching(unitId) {
    const unit = this.getCurrentUnitData();
    unit.matching.forEach(m => {
      this.state.matchingAnswers[`${unitId}-match-${m.id}`] = m.correctLetter;
    });
    this.render();
    this.toast("Đã khớp toàn bộ câu nối từ chính xác!", "success");
  },

  renderEspPart4(unit) {
    return `
      <div class="space-y-4">
        ${unit.translations.map(item => {
          const res = this.state.translationResults[item.id];
          return `
            <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    ${item.direction === "EN_TO_VI" ? "Dịch Anh → Việt" : "Dịch Việt → Anh"}
                  </span>
                  <p class="font-semibold text-sm text-white mt-2">${item.source}</p>
                </div>
                <button onclick="AudioEngine.speak('${item.direction === 'EN_TO_VI' ? item.source.replace(/'/g, "\\'") : item.modelAnswer.replace(/'/g, "\\'")}')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 shrink-0">
                  <i class="fa-solid fa-volume-high mr-1"></i> Nghe câu tiếng Anh
                </button>
              </div>

              <textarea id="trans-input-${item.id}" rows="2" class="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500" placeholder="Nhập bản dịch của bạn hoặc bấm nạp bài mẫu...">${res ? res.userText : ""}</textarea>

              <div class="flex flex-wrap items-center gap-2">
                <button onclick="App.gradeTranslation('${unit.id}', '${item.id}')" class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition">
                  Chấm Điểm Từ Khóa
                </button>
                <button onclick="App.loadHandwritten('${unit.id}', '${item.id}')" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition">
                  <i class="fa-solid fa-pen-nib mr-1 text-amber-400"></i> Nạp Bài Dịch Mẫu Của Bạn
                </button>
              </div>

              ${res ? `
                <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <p class="font-bold ${res.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}">Độ khớp từ khóa: ${res.score}%</p>
                  <p class="text-slate-300"><strong>Đáp án chuẩn học thuật:</strong> ${item.modelAnswer}</p>
                </div>
              ` : ""}
            </div>
          `;
        }).join("")}
      </div>
    `;
  },

  loadHandwritten(unitId, itemId) {
    const unit = this.getCurrentUnitData();
    const item = unit.translations.find(t => t.id === itemId);
    if (!item) return;
    const textarea = document.getElementById(`trans-input-${itemId}`);
    if (textarea) textarea.value = item.handwritten;
    this.gradeTranslation(unitId, itemId);
  },

  gradeTranslation(unitId, itemId) {
    const unit = this.getCurrentUnitData();
    const item = unit.translations.find(t => t.id === itemId);
    const textarea = document.getElementById(`trans-input-${itemId}`);
    if (!item || !textarea) return;

    const userText = textarea.value.trim();
    const lower = userText.toLowerCase();
    const matched = item.keywords.filter(k => lower.includes(k.toLowerCase()));
    const score = Math.round((matched.length / item.keywords.length) * 100);

    this.state.translationResults[itemId] = { userText, score };
    window.AudioEngine.playTone(score >= 60 ? "success" : "error");
    this.render();
  },

  renderHardwareLab() {
    const specs = {
      cpu: {
        name: "Processor (CPU) & Control Unit",
        questionRef: "Câu 3, 20, 21, 32 (Unit 2)",
        desc: "Part of the internal hardware. Can be dual-core (2 cores) or quad-core (4 cores). The Control Unit examines instructions and activates other PC's components."
      },
      dimm: {
        name: "DIMM Slot (Dual In-Line Memory Module)",
        questionRef: "Câu 11, 16, 29 (Unit 2)",
        desc: "Where RAM is inserted on the motherboard. Memory (RAM) determines how many programs a computer can run simultaneously, and is NOT used for permanent storage."
      },
      pcie: {
        name: "Graphics Card Socket (PCIe)",
        questionRef: "Câu 18 (Unit 2)",
        desc: "The socket on the motherboard where the dedicated graphics card (GPU) is installed."
      },
      sata: {
        name: "SATA Socket & Solid State Drive (SSD)",
        questionRef: "Câu 5, 9, 19 (Unit 2)",
        desc: "Connects internal storage drives. A Solid State Drive (SSD) is faster and more durable than a traditional mechanical Hard Disk Drive (HDD)."
      }
    };
    const activeSpec = specs[this.state.selectedComponent] || specs.cpu;

    return `
      <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h4 class="font-bold text-sm text-white">Sơ Đồ Bo Mạch Chủ Tương Tác</h4>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          ${Object.entries(specs).map(([key, item]) => `
            <button onclick="App.selectHardware('${key}')" class="p-3 rounded-xl border text-left transition ${this.state.selectedComponent === key ? 'bg-cyan-500/20 border-cyan-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-300'}">
              <p class="text-xs font-bold">${item.name}</p>
              <p class="text-[10px] text-cyan-400 mt-1">${item.questionRef}</p>
            </button>
          `).join("")}
        </div>
        <div class="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs text-slate-300">
          ${activeSpec.desc}
        </div>
      </div>
    `;
  },

  selectHardware(key) {
    this.state.selectedComponent = key;
    this.render();
  },

  renderSrs() {
    const cards = this.state.srsCards;
    if (!cards.length) return `<div class="p-8 text-center text-slate-400">Chưa có thẻ từ vựng nào.</div>`;
    const card = cards[this.state.srsIndex % cards.length];
    return `
      <div class="max-w-xl mx-auto space-y-5">
        <div class="flex items-center justify-between text-xs text-slate-400">
          <span>Thẻ ${this.state.srsIndex + 1} / ${cards.length} (${card.unit})</span>
          <span>EFactor: <strong class="text-indigo-400">${card.efactor.toFixed(2)}</strong> • Chu kỳ: <strong class="text-emerald-400">${card.interval} ngày</strong></span>
        </div>

        <div onclick="App.flipSrsCard()" class="perspective-1000 cursor-pointer h-72">
          <div class="w-full h-full relative transform-style-3d ${this.state.srsFlipped ? 'rotate-y-180' : ''}">
            <div class="absolute inset-0 backface-hidden rounded-3xl bg-slate-900 border-2 border-slate-800 p-8 flex flex-col items-center justify-center text-center shadow-2xl">
              <span class="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 mb-3">${card.unit}</span>
              <h3 class="text-2xl font-black text-white">${card.word}</h3>
              <p class="text-sm text-slate-400 font-mono mt-1">${card.ipa}</p>
              <button onclick="event.stopPropagation(); AudioEngine.speak('${card.word.replace(/'/g, "\\'")}')" class="mt-4 px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-xs text-white transition">
                <i class="fa-solid fa-volume-high mr-1"></i> Phát âm US
              </button>
            </div>
            <div class="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border-2 border-indigo-500/40 p-8 flex flex-col items-center justify-center text-center shadow-2xl">
              <p class="text-lg font-bold text-emerald-400">${card.meaning}</p>
              <p class="text-xs text-slate-300 italic mt-3">"${card.example}"</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-2.5">
          <button onclick="App.rateSrsCard(1)" class="py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold">1. Quên (1d)</button>
          <button onclick="App.rateSrsCard(3)" class="py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">2. Khó (2d)</button>
          <button onclick="App.rateSrsCard(4)" class="py-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">3. Tốt (4d)</button>
          <button onclick="App.rateSrsCard(5)" class="py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">4. Dễ (7d)</button>
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
    if (quality < 3) {
      card.repetitions = 0;
      card.interval = 1;
    } else {
      card.repetitions += 1;
      card.interval = card.repetitions === 1 ? 1 : card.repetitions === 2 ? 4 : Math.round(card.interval * card.efactor);
    }
    card.efactor = Math.max(1.3, card.efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    this.state.srsFlipped = false;
    this.state.srsIndex = (this.state.srsIndex + 1) % this.state.srsCards.length;
    this.saveSrs();
    await window.ApiClient.request("PUT", `/api/vocab/${card.id}/sm2`, { quality, interval: card.interval }, this.state.user.role);
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
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 class="font-bold text-base text-white">${exam.title}</h3>
          ${exam.passageHtml}
        </div>
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono text-amber-300"><i class="fa-regular fa-clock mr-1"></i> <span id="toeicTimerDisplay">${this.formatTime(this.state.toeicTimeLeft)}</span></span>
            <button onclick="App.submitToeic()" class="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold">Nộp Bài</button>
          </div>
          ${exam.questions.map(q => {
            const chosen = this.state.toeicAnswers[q.id];
            return `
              <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <p class="text-xs font-bold text-white">${q.id}. ${q.q}</p>
                <div class="space-y-1.5">
                  ${q.options.map((opt, idx) => `
                    <button onclick="App.selectToeic(${q.id}, ${idx})" class="w-full text-left px-3 py-2 rounded-lg text-xs border ${chosen === idx ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-300'}">${opt}</button>
                  `).join("")}
                </div>
                ${this.state.toeicSubmitted ? `<p class="text-xs pt-2 ${chosen === q.correct ? 'text-emerald-400' : 'text-rose-400'}">${q.explanation}</p>` : ""}
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

  async submitToeic() {
    this.state.toeicSubmitted = true;
    await window.ApiClient.request("POST", "/api/exams/submit", this.state.toeicAnswers, this.state.user.role);
    this.render();
  },

  renderAdmin() {
    return `
      <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 class="font-bold text-base text-white">Live REST API & JWT Request Inspector</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs font-mono">
            <thead class="text-slate-400 border-b border-slate-800">
              <tr>
                <th class="py-2">Time</th>
                <th class="py-2">Method</th>
                <th class="py-2">Endpoint</th>
                <th class="py-2">Status</th>
                <th class="py-2">Latency</th>
                <th class="py-2">Role</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/70">
              ${window.ApiClient.logs.map(l => `
                <tr>
                  <td class="py-2 text-slate-400">${l.time}</td>
                  <td class="py-2 font-bold text-indigo-400">${l.method}</td>
                  <td class="py-2 text-slate-200">${l.endpoint}</td>
                  <td class="py-2 text-emerald-400">${l.status}</td>
                  <td class="py-2 text-amber-300">${l.latency}</td>
                  <td class="py-2 text-cyan-300">${l.role}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
};

window.addEventListener("DOMContentLoaded", () => window.App.init());