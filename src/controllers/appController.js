window.App = {
  state: {
    activeTab: "it_esp",
    activeUnit: "unit1",
    activeSubTab: "vocab",
    vocabFilter: "ALL",
    searchQuery: "",
    selectedComponent: "cpu",
    user: { ...window.CoreData.user },
    srsCards: [],
    srsIndex: 0,
    srsFlipped: false,
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
    this.updateSidebarStats();
    this.bindKeyboardShortcuts();
    this.switchTab("it_esp");
  },

  bindKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      if (this.state.activeTab !== "srs") return;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;
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
    this.toast("Đã đặt lại toàn bộ tiến độ làm bài!", "info");
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
      it_esp: "Tiếng Anh Chuyên Ngành CNTT (Unit 1 & Unit 2)",
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
    if (unitId === "unit1" && this.state.activeSubTab === "lab") {
      this.state.activeSubTab = "vocab";
    }
    await window.ApiClient.request("GET", `/api/units/${unitId}`, null, this.state.user.role);
    this.render();
  },

  switchEspSubTab(subTab) {
    this.state.activeSubTab = subTab;
    this.render();
  },

  getCurrentUnitData() {
    return this.state.activeUnit === "unit1" ? window.Unit1Data : window.Unit2Data;
  },

  render() {
    const main = document.getElementById("mainView");
    if (!main) return;

    if (this.state.activeTab === "dashboard") main.innerHTML = this.renderDashboard();
    else if (this.state.activeTab === "it_esp") main.innerHTML = this.renderItEsp();
    else if (this.state.activeTab === "srs") main.innerHTML = this.renderSrs();
    else if (this.state.activeTab === "toeic") main.innerHTML = this.renderToeic();
    else if (this.state.activeTab === "admin") main.innerHTML = this.renderAdmin();
  },

  renderDashboard() {
    const u1Done = Object.keys(this.state.mcqAnswers).filter(k => k.startsWith("unit1-")).length;
    const u2Done = Object.keys(this.state.mcqAnswers).filter(k => k.startsWith("unit2-")).length;
    const totalTrans = Object.keys(this.state.translationResults).length;

    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p class="text-xs text-slate-400">Tổng Từ Vựng CNTT</p>
          <p class="text-2xl font-black text-white mt-1">80 thuật ngữ</p>
          <p class="text-xs text-cyan-400 mt-1">Unit 1 (40) + Unit 2 (40)</p>
        </div>
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p class="text-xs text-slate-400">Trắc Nghiệm Unit 1</p>
          <p class="text-2xl font-black text-indigo-400 mt-1">${u1Done} / 25 câu</p>
          <p class="text-xs text-slate-400 mt-1">Working in IT (Trang 1–7)</p>
        </div>
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p class="text-xs text-slate-400">Trắc Nghiệm Unit 2</p>
          <p class="text-2xl font-black text-emerald-400 mt-1">${u2Done} / 35 câu</p>
          <p class="text-xs text-slate-400 mt-1">IT Systems (Trang 8–13)</p>
        </div>
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p class="text-xs text-slate-400">Câu Dịch Đã Chấm</p>
          <p class="text-2xl font-black text-amber-400 mt-1">${totalTrans} / 11 câu</p>
          <p class="text-xs text-slate-400 mt-1">Anh–Việt & Việt–Anh</p>
        </div>
      </div>

      <div class="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/60 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Lộ trình Tiếng Anh CNTT</span>
          <h3 class="text-xl font-bold text-white mt-2">Ôn Tập Trọn Bộ Unit 1 & Unit 2 (Trang 1 – Trang 13)</h3>
          <p class="text-sm text-slate-300 mt-1">Tích hợp đầy đủ 80 từ vựng phát âm US, 60 câu Trắc nghiệm kèm sửa lỗi bài khoanh trên giấy, Điền từ, Nối cột A–J, Dịch thuật tự động và Lab Sơ Đồ Bo Mạch Chủ.</p>
        </div>
        <button onclick="App.switchTab('it_esp')" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shrink-0 transition shadow-lg shadow-indigo-600/30">
          Vào Học Ngay <i class="fa-solid fa-arrow-right ml-1.5"></i>
        </button>
      </div>
    `;
  },

  renderItEsp() {
    const unit = this.getCurrentUnitData();
    const subTabs = [
      { id: "vocab", label: `I. Từ Vựng (${unit.vocabulary.length})`, icon: "fa-spell-check" },
      { id: "part1", label: `Part 1: Trắc Nghiệm (${unit.mcqs.length})`, icon: "fa-list-check" },
      { id: "part2", label: `Part 2: Điền Từ (${unit.cloze.title})`, icon: "fa-pen-to-square" },
      { id: "part3", label: "Part 3: Nối Từ A–J (10)", icon: "fa-link" },
      { id: "part4", label: `Part 4: Dịch Thuật (${unit.translations.length})`, icon: "fa-language" }
    ];

    if (unit.id === "unit2") {
      subTabs.push({ id: "lab", label: "Lab: Sơ Đồ Phần Cứng & Tiền Tố", icon: "fa-microchip" });
    }

    return `
      <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">${unit.pages}</span>
            <h3 class="text-lg font-bold text-white">${unit.title}</h3>
          </div>
          <p class="text-xs text-slate-400 mt-1">${unit.description}</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button onclick="App.switchEspUnit('unit1')" class="px-4 py-2 rounded-xl text-xs font-bold transition ${this.state.activeUnit === 'unit1' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
            Unit 1: Working in IT (Tr.1–7)
          </button>
          <button onclick="App.switchEspUnit('unit2')" class="px-4 py-2 rounded-xl text-xs font-bold transition ${this.state.activeUnit === 'unit2' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
            Unit 2: IT Systems (Tr.8–13)
          </button>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        ${subTabs.map(t => `
          <button onclick="App.switchEspSubTab('${t.id}')" class="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${this.state.activeSubTab === t.id ? 'bg-slate-100 text-slate-900' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'}">
            <i class="fa-solid ${t.icon}"></i> ${t.label}
          </button>
        `).join("")}
      </div>

      <div>
        ${this.state.activeSubTab === "vocab" ? this.renderEspVocab(unit) : ""}
        ${this.state.activeSubTab === "part1" ? this.renderEspPart1(unit) : ""}
        ${this.state.activeSubTab === "part2" ? this.renderEspPart2(unit) : ""}
        ${this.state.activeSubTab === "part3" ? this.renderEspPart3(unit) : ""}
        ${this.state.activeSubTab === "part4" ? this.renderEspPart4(unit) : ""}
        ${this.state.activeSubTab === "lab" ? this.renderHardwareLab() : ""}
      </div>
    `;
  },

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

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          ${filtered.map(item => `
            <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-3 transition">
              <div>
                <div class="flex items-start justify-between gap-2">
                  <span class="text-[11px] font-mono text-slate-400">#${item.id} • ${item.group}</span>
                  <div class="flex items-center gap-1">
                    <button onclick="AudioEngine.speak('${item.word.replace(/'/g, "\\'")}', 1.0)" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-indigo-600 text-xs text-slate-200 transition">
                      <i class="fa-solid fa-volume-high"></i>
                    </button>
                    <button onclick="AudioEngine.speak('${item.word.replace(/'/g, "\\'")}', 0.65)" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-cyan-600 text-xs text-slate-200 transition">
                      🐢
                    </button>
                  </div>
                </div>
                <h4 class="font-bold text-white text-sm mt-1">${item.word}</h4>
                <p class="text-xs text-emerald-400 mt-0.5">${item.meaning}</p>
              </div>
              <button onclick="App.addWordToSrs('${item.word.replace(/'/g, "\\'")}', '${item.meaning.replace(/'/g, "\\'")}', '${unit.title}')" class="w-full py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 hover:text-indigo-200 text-slate-300 text-[11px] font-medium border border-slate-700/70 transition">
                <i class="fa-solid fa-plus mr-1"></i> Đẩy vào Flashcard SRS
              </button>
            </div>
          `).join("")}
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
    const unit = unitId === "unit1" ? window.Unit1Data : window.Unit2Data;
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
            <p class="text-xs text-slate-400">Chọn từ thích hợp trong hộp từ vựng cho 10 vị trí trống bên dưới.</p>
          </div>
          <button onclick="App.fillCorrectCloze('${unit.id}')" class="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition">
            Điền Đáp Án Chuẩn (10/10)
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
    const unit = unitId === "unit1" ? window.Unit1Data : window.Unit2Data;
    unit.cloze.blanks.forEach(b => {
      this.state.clozeAnswers[`${unitId}-cloze-${b.index}`] = b.answer;
    });
    this.render();
    this.toast("Đã điền đầy đủ 10/10 từ khóa chính xác!", "success");
  },

  renderEspPart3(unit) {
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    return `
      <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 class="font-bold text-base text-white">PART 3: MATCHING (Nối Thuật Ngữ Với Định Nghĩa A–J)</h4>
            <p class="text-xs text-emerald-400">Bài làm trên giấy của bạn ở phần này đạt 10/10 tuyệt đối!</p>
          </div>
          <button onclick="App.fillCorrectMatching('${unit.id}')" class="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition">
            Nạp Đáp Án Trên Giấy (10/10)
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
                    <option value="">Chọn A–J</option>
                    ${letters.map(l => `<option value="${l}" ${val === l ? "selected" : ""}>Đáp án ${l}</option>`).join("")}
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
    const unit = unitId === "unit1" ? window.Unit1Data : window.Unit2Data;
    unit.matching.forEach(m => {
      this.state.matchingAnswers[`${unitId}-match-${m.id}`] = m.correctLetter;
    });
    this.render();
    this.toast("Đã khớp 10/10 câu nối từ chính xác!", "success");
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

              <textarea id="trans-input-${item.id}" rows="2" class="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500" placeholder="Nhập bản dịch của bạn hoặc bấm nạp bài viết tay trong vở...">${res ? res.userText : ""}</textarea>

              <div class="flex flex-wrap items-center gap-2">
                <button onclick="App.gradeTranslation('${unit.id}', '${item.id}')" class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition">
                  Chấm Điểm Từ Khóa
                </button>
                <button onclick="App.loadHandwritten('${unit.id}', '${item.id}')" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition">
                  <i class="fa-solid fa-pen-nib mr-1 text-amber-400"></i> Nạp Bài Viết Tay Trong Vở Của Bạn
                </button>
              </div>

              ${res ? `
                <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <p class="font-bold ${res.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}">Độ khớp từ khóa: ${res.score}%</p>
                  <p class="text-slate-300"><strong>Đáp án chuẩn học thuật:</strong> ${item.modelAnswer}</p>
                  <p class="text-slate-400"><strong>Bài viết tay trong vở của bạn:</strong> "${item.handwritten}"</p>
                </div>
              ` : ""}
            </div>
          `;
        }).join("")}
      </div>
    `;
  },

  loadHandwritten(unitId, itemId) {
    const unit = unitId === "unit1" ? window.Unit1Data : window.Unit2Data;
    const item = unit.translations.find(t => t.id === itemId);
    if (!item) return;
    const textarea = document.getElementById(`trans-input-${itemId}`);
    if (textarea) textarea.value = item.handwritten;
    this.gradeTranslation(unitId, itemId);
  },

  gradeTranslation(unitId, itemId) {
    const unit = unitId === "unit1" ? window.Unit1Data : window.Unit2Data;
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
      },
      ports: {
        name: "Ethernet Connector, USB Port & Audio Socket",
        questionRef: "Câu 15, 17, 19 (Unit 2)",
        desc: "Rear I/O ports: Ethernet connector for internet cable, USB port for external hard drives/peripherals, and Audio socket for headphones."
      },
      psu: {
        name: "Power Supply Unit (PSU)",
        questionRef: "Câu 13, Part 3 Câu 3 (Unit 2)",
        desc: "Converts electrical power from an outlet into usable DC power for the internal computer components."
      }
    };
    const activeSpec = specs[this.state.selectedComponent] || specs.cpu;

    return `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h4 class="font-bold text-sm text-white flex items-center gap-2">
            <i class="fa-solid fa-microchip text-cyan-400"></i> Sơ Đồ Bo Mạch Chủ Tương Tác (Click vào linh kiện)
          </h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            ${Object.entries(specs).map(([key, item]) => `
              <button onclick="App.selectHardware('${key}')" class="p-3 rounded-xl border text-left transition ${this.state.selectedComponent === key ? 'bg-cyan-500/20 border-cyan-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}">
                <p class="text-xs font-bold">${item.name}</p>
                <p class="text-[10px] text-cyan-400 mt-1">${item.questionRef}</p>
              </button>
            `).join("")}
          </div>
          <div class="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-cyan-300">${activeSpec.name}</span>
              <button onclick="AudioEngine.speak('${activeSpec.desc.replace(/'/g, "\\'")}')" class="text-xs text-slate-300 hover:text-white">
                <i class="fa-solid fa-volume-high mr-1"></i> Nghe định nghĩa
              </button>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">${activeSpec.desc}</p>
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h4 class="font-bold text-sm text-white flex items-center gap-2">
            <i class="fa-solid fa-calculator text-indigo-400"></i> Bảng Tiền Tố Đo Lường & Phép Tính (Câu 20–28 Trang 10–11)
          </h4>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <strong class="text-indigo-400">nano-</strong>: 0.000000001 (10⁻⁹) — Câu 22, 28
            </div>
            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <strong class="text-indigo-400">mega- / giga- / tera-</strong>: Triệu (10⁶) / Tỷ (10⁹) / Ngàn tỷ (10¹²)
            </div>
            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <strong class="text-emerald-400">dual- / quad-</strong>: Hai (2 nhân) / Bốn (4 nhân) — Câu 20, 21
            </div>
            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <strong class="text-amber-400">multiply / divide / subtract / sum</strong>:
              Nhân (by) / Chia (by) / Trừ (from) / Tổng (of) — Câu 24–27
            </div>
          </div>
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
    if (!cards.length) {
      return `<div class="p-8 text-center text-slate-400">Chưa có thẻ từ vựng nào.</div>`;
    }
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
              <p class="text-[11px] text-slate-500 mt-5">Nhấp vào thẻ hoặc ấn phím Space để lật mặt sau (3D)</p>
            </div>

            <div class="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border-2 border-indigo-500/40 p-8 flex flex-col items-center justify-center text-center shadow-2xl">
              <p class="text-lg font-bold text-emerald-400">${card.meaning}</p>
              <p class="text-xs text-slate-300 italic mt-3">"${card.example}"</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-2.5">
          <button onclick="App.rateSrsCard(1)" class="py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-bold">1. Quên (1d)</button>
          <button onclick="App.rateSrsCard(3)" class="py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-bold">2. Khó (2d)</button>
          <button onclick="App.rateSrsCard(4)" class="py-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold">3. Tốt (4d)</button>
          <button onclick="App.rateSrsCard(5)" class="py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold">4. Dễ (7d)</button>
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

  toggleHighlightMode() {
    this.state.highlightMode = !this.state.highlightMode;
    this.render();
  },

  applySelectionHighlight() {
    if (!this.state.highlightMode) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    try {
      const range = sel.getRangeAt(0);
      const mark = document.createElement("mark");
      mark.className = "hl-mark";
      range.surroundContents(mark);
      sel.removeAllRanges();
    } catch (e) {}
  },

  toggleToeicFlag(qId) {
    this.state.toeicFlags[qId] = !this.state.toeicFlags[qId];
    this.render();
  },

  renderToeic() {
    const exam = window.CoreData.toeicExam;
    return `
      <div class="space-y-4">
        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
              <i class="fa-regular fa-clock mr-1"></i> <span id="toeicTimerDisplay">${this.formatTime(this.state.toeicTimeLeft)}</span>
            </span>
            <button onclick="App.toggleHighlightMode()" class="px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${this.state.highlightMode ? 'bg-yellow-500/20 border-yellow-400 text-yellow-200' : 'bg-slate-800 border-slate-700 text-slate-300'}">
              <i class="fa-solid fa-highlighter mr-1"></i> Bút Highlight: ${this.state.highlightMode ? "BẬT" : "TẮT"}
            </button>
          </div>
          <div class="flex items-center gap-2">
            ${exam.questions.map(q => `
              <span class="px-2.5 py-1 rounded-lg text-xs font-mono border ${this.state.toeicFlags[q.id] ? 'border-amber-400 text-amber-300 bg-amber-500/10' : this.state.toeicAnswers[q.id] !== undefined ? 'border-indigo-500 text-indigo-300 bg-indigo-500/20' : 'border-slate-700 text-slate-400'}">
                #${q.id}
              </span>
            `).join("")}
            <button onclick="App.submitToeic()" class="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition">
              Nộp Bài & Chấm Điểm
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div onmouseup="App.applySelectionHighlight()" class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 class="font-bold text-base text-white">${exam.title}</h3>
            ${exam.passageHtml}
          </div>
          <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            ${exam.questions.map(q => {
              const chosen = this.state.toeicAnswers[q.id];
              const flagged = this.state.toeicFlags[q.id];
              return `
                <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-bold text-white">${q.id}. ${q.q}</p>
                    <button onclick="App.toggleToeicFlag(${q.id})" class="text-xs ${flagged ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}">
                      <i class="fa-solid fa-flag"></i>
                    </button>
                  </div>
                  <div class="space-y-1.5">
                    ${q.options.map((opt, idx) => `
                      <button onclick="App.selectToeic(${q.id}, ${idx})" class="w-full text-left px-3 py-2 rounded-lg text-xs border transition ${chosen === idx ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-300'}">
                        ${opt}
                      </button>
                    `).join("")}
                  </div>
                  ${this.state.toeicSubmitted ? `
                    <p class="text-xs pt-2 ${chosen === q.correct ? 'text-emerald-400' : 'text-rose-400'}">
                      ${q.explanation}
                    </p>
                  ` : ""}
                </div>
              `;
            }).join("")}
          </div>
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
    this.toast("Đã chấm điểm bài đọc TOEIC Part 7!", "success");
  },

  async adminCreateCard() {
    const wordEl = document.getElementById("adminNewWord");
    const meaningEl = document.getElementById("adminNewMeaning");
    if (!wordEl || !meaningEl || !wordEl.value.trim() || !meaningEl.value.trim()) {
      this.toast("Vui lòng nhập đầy đủ Từ vựng và Nghĩa!", "error");
      return;
    }
    const newCard = {
      id: "srs-" + Date.now(),
      word: wordEl.value.trim(),
      ipa: "/Custom IT/",
      pos: "n",
      meaning: meaningEl.value.trim(),
      example: "Added via Admin CMS.",
      unit: "Custom CMS",
      efactor: 2.5,
      interval: 1,
      repetitions: 0
    };
    this.state.srsCards.unshift(newCard);
    this.saveSrs();
    await window.ApiClient.request("POST", "/api/vocab", newCard, this.state.user.role);
    this.toast(`Đã thêm từ <strong>${newCard.word}</strong>!`, "success");
    this.render();
  },

  async adminDeleteCard(cardId) {
    const res = await window.ApiClient.request("DELETE", `/api/vocab/${cardId}`, null, this.state.user.role);
    if (!res.ok) {
      this.toast("Lỗi 403 Forbidden: Chỉ quyền ADMIN mới được phép xóa từ vựng!", "error");
      return;
    }
    this.state.srsCards = this.state.srsCards.filter(c => c.id !== cardId);
    this.saveSrs();
    this.toast("Đã xóa thẻ từ vựng thành công!", "info");
    this.render();
  },

  renderAdmin() {
    return `
      <div class="space-y-6">
        <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-base text-white">Quản Trị Kho Thẻ Từ Vựng SRS (CMS CRUD)</h3>
            <span class="text-xs font-mono px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400">JWT Role: ${this.state.user.role}</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input id="adminNewWord" type="text" placeholder="Nhập thuật ngữ tiếng Anh CNTT..." class="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white" />
            <input id="adminNewMeaning" type="text" placeholder="Nhập nghĩa tiếng Việt..." class="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white" />
            <button onclick="App.adminCreateCard()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition">
              <i class="fa-solid fa-plus mr-1"></i> Thêm Vào Database
            </button>
          </div>

          <div class="max-h-48 overflow-y-auto divide-y divide-slate-800 border border-slate-800 rounded-xl p-2 bg-slate-950">
            ${this.state.srsCards.map(c => `
              <div class="py-2 px-2 flex items-center justify-between text-xs">
                <div>
                  <strong class="text-white">${c.word}</strong>
                  <span class="text-slate-400 ml-2">— ${c.meaning}</span>
                </div>
                <button onclick="App.adminDeleteCard('${c.id}')" class="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20">
                  Xóa
                </button>
              </div>
            `).join("")}
          </div>
        </div>

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
                    <td class="py-2 ${l.status >= 400 ? 'text-rose-400' : 'text-emerald-400'}">${l.status}</td>
                    <td class="py-2 text-amber-300">${l.latency}</td>
                    <td class="py-2 text-cyan-300">${l.role}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
};

window.addEventListener("DOMContentLoaded", () => window.App.init());