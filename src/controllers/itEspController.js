Object.assign(window.App, {
  // Khởi tạo sự kiện đóng/mở trên thanh Sidebar trái
  initEspSidebarEvents() {
    if (this._espSidebarEventsBound) return;
    const nav = document.getElementById("sidebarNav");
    if (!nav) return;

    this._espSidebarEventsBound = true;

    // Lắng nghe khi bấm vào các nút trên thanh menu trái
    nav.addEventListener(
      "click",
      (e) => {
        const navBtn = e.target.closest(".nav-btn");
        if (!navBtn) return;

        const targetTab = navBtn.dataset.tab;
        if (targetTab === "it_esp") {
          // Nếu đang ở tab Tiếng Anh CNTT mà bấm lại vào nút "Tiếng Anh CNTT" -> Đóng/Mở cây thư mục
          if (this.state.activeTab === "it_esp") {
            this.state.isEspTreeCollapsed = !this.state.isEspTreeCollapsed;
            this.renderSidebarEspFolders();
          } else {
            this.state.isEspTreeCollapsed = false;
            if (this.state.espExpandedUnit === undefined) {
              this.state.espExpandedUnit = this.state.activeUnit || "unit1";
            }
            setTimeout(() => this.renderSidebarEspFolders(), 0);
          }
        } else {
          // Khi bấm sang tab khác (ví dụ Lộ trình 48 ngày) -> Tự động ẩn cây thư mục CNTT
          const treeEl = document.getElementById("sidebarEspFolderTree");
          if (treeEl) treeEl.classList.add("hidden");
        }
      },
      true
    );
  },

  // Bấm vào từng thư mục Unit (Unit 1, Unit 2, Unit 3) trên Sidebar: Nếu đang mở thì đóng lại, đang đóng thì mở ra
  toggleSidebarEspUnit(unitId) {
    if (this.state.espExpandedUnit === undefined) {
      this.state.espExpandedUnit = this.state.activeUnit || "unit1";
    }

    if (this.state.activeTab === "it_esp" && this.state.espExpandedUnit === unitId) {
      // Đang mở thư mục này -> Thu gọn danh sách tệp con lại
      this.state.espExpandedUnit = null;
      this.renderSidebarEspFolders();
      return;
    }

    // Mở thư mục Unit được chọn
    this.state.activeTab = "it_esp";
    this.state.isEspTreeCollapsed = false;
    this.state.espExpandedUnit = unitId;
    this.switchEspUnit(unitId);
  },

  // Đóng/Mở toàn bộ cây 3 Unit từ nút thu gọn nhanh
  toggleEntireEspTree(event) {
    if (event) event.stopPropagation();
    this.state.isEspTreeCollapsed = !this.state.isEspTreeCollapsed;
    this.renderSidebarEspFolders();
  },

  async switchEspUnit(unitId) {
    this.state.activeUnit = unitId;
    this.state.espExpandedUnit = unitId;
    this.state.vocabFilter = "ALL";
    this.state.vocabStatusFilter = "ALL";
    this.state.typingCursor = 0;
    this.state.activeMatchingTermId = null;
    this.ensureShuffledOrder(unitId);
    this.updateSidebarStats();
    this.renderSidebarEspFolders();
    await window.ApiClient.request("GET", `/api/units/${unitId}`, null, this.state.user.role);
    this.render();
  },

  switchEspStep(stepId) {
    this.state.activeStep = stepId;
    this.renderSidebarEspFolders();
    this.render();
  },

  switchPracticeSubPart(partId) {
    this.state.practiceSubPart = partId;
    this.render();
  },

  openEspFolderModule(unitId, stepId) {
    this.state.activeTab = "it_esp";
    this.state.isEspTreeCollapsed = false;
    this.state.activeUnit = unitId;
    this.state.espExpandedUnit = unitId;
    this.state.activeStep = stepId || "step1_vocab";
    this.state.typingCursor = 0;
    this.state.activeMatchingTermId = null;
    this.ensureShuffledOrder(unitId);
    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === "it_esp");
    });
    this.updateSidebarStats();
    this.renderSidebarEspFolders();
    this.render();
  },

  renderSidebarEspFolders() {
    this.initEspSidebarEvents();

    const nav = document.getElementById("sidebarNav");
    if (!nav) return;
    const espBtn = nav.querySelector('[data-tab="it_esp"]');
    if (!espBtn) return;

    let treeEl = document.getElementById("sidebarEspFolderTree");
    if (!treeEl) {
      treeEl = document.createElement("div");
      treeEl.id = "sidebarEspFolderTree";
      espBtn.insertAdjacentElement("afterend", treeEl);
    }

    // Ẩn cây thư mục nếu người dùng đang ở tab khác hoặc đã bấm thu gọn toàn bộ cây
    if (this.state.activeTab !== "it_esp" || this.state.isEspTreeCollapsed) {
      treeEl.className = "hidden";
      treeEl.innerHTML = "";
      return;
    }

    if (this.state.espExpandedUnit === undefined) {
      this.state.espExpandedUnit = this.state.activeUnit || "unit1";
    }

    const folders = [
      { id: "unit1", folder: "unit01/", name: "Unit 1: Working in IT", count: "40 từ" },
      { id: "unit2", folder: "unit02/", name: "Unit 2: IT Systems", count: "40 từ" },
      { id: "unit3", folder: "unit03/", name: "Unit 3: Data Communication", count: "50 từ" }
    ];

    treeEl.className = "pl-3 pr-1 py-1.5 space-y-1 border-l-2 border-indigo-100 ml-4 my-1";
    treeEl.innerHTML = `
      <div class="flex items-center justify-between px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <span>Danh mục học phần</span>
        <button
          type="button"
          onclick="App.toggleEntireEspTree(event)"
          class="text-slate-400 hover:text-rose-600 font-bold flex items-center gap-1 transition"
          title="Đóng thanh danh mục này"
        >
          <span>Thu gọn</span>
          <i class="fa-solid fa-chevron-up text-[9px]"></i>
        </button>
      </div>

      ${folders.map(f => {
        const isCurrentUnit = this.state.activeUnit === f.id;
        const isExpanded = this.state.espExpandedUnit === f.id;

        return `
          <div class="space-y-1">
            <button
              type="button"
              onclick="App.toggleSidebarEspUnit('${f.id}')"
              class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                isCurrentUnit
                  ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-200"
                  : "text-slate-600 hover:bg-slate-100 font-medium"
              }"
            >
              <span class="flex items-center gap-2 min-w-0 truncate">
                <i class="fa-solid ${isExpanded ? "fa-folder-open text-indigo-600" : "fa-folder text-amber-500"} shrink-0"></i>
                <span class="truncate">${f.name}</span>
              </span>
              <span class="flex items-center gap-1.5 shrink-0 ml-1">
                <span class="text-[10px] font-mono text-slate-400">${f.count}</span>
                <i class="fa-solid ${isExpanded ? "fa-chevron-down text-indigo-600" : "fa-chevron-right text-slate-400"} text-[10px] transition-transform"></i>
              </span>
            </button>

            ${isExpanded ? `
              <div class="pl-5 space-y-0.5 text-[11px]">
                <button type="button" onclick="App.openEspFolderModule('${f.id}', 'step1_vocab')" class="w-full text-left px-2 py-1 rounded flex items-center gap-1.5 ${isCurrentUnit && this.state.activeStep === 'step1_vocab' ? 'text-blue-600 font-bold bg-blue-50/70' : 'text-slate-500 hover:text-slate-800'}">
                  <i class="fa-regular fa-file-code text-[10px]"></i> vocab.js (Từ vựng)
                </button>
                <button type="button" onclick="App.openEspFolderModule('${f.id}', 'step2_typing')" class="w-full text-left px-2 py-1 rounded flex items-center gap-1.5 ${isCurrentUnit && this.state.activeStep === 'step2_typing' ? 'text-blue-600 font-bold bg-blue-50/70' : 'text-slate-500 hover:text-slate-800'}">
                  <i class="fa-solid fa-keyboard text-[10px]"></i> Luyện gõ từ
                </button>
                <button type="button" onclick="App.openEspFolderModule('${f.id}', 'step3_practice')" class="w-full text-left px-2 py-1 rounded flex items-center gap-1.5 ${isCurrentUnit && this.state.activeStep === 'step3_practice' ? 'text-blue-600 font-bold bg-blue-50/70' : 'text-slate-500 hover:text-slate-800'}">
                  <i class="fa-regular fa-file-lines text-[10px]"></i> practice.js (Bài tập)
                </button>
                <button type="button" onclick="App.openEspFolderModule('${f.id}', 'step4_production')" class="w-full text-left px-2 py-1 rounded flex items-center gap-1.5 ${isCurrentUnit && this.state.activeStep === 'step4_production' ? 'text-blue-600 font-bold bg-blue-50/70' : 'text-slate-500 hover:text-slate-800'}">
                  <i class="fa-solid fa-language text-[10px]"></i> translation.js (10 câu dịch)
                </button>
                <button type="button" onclick="App.openEspFolderModule('${f.id}', 'step5_exam')" class="w-full text-left px-2 py-1 rounded flex items-center gap-1.5 ${isCurrentUnit && this.state.activeStep === 'step5_exam' ? 'text-amber-700 font-extrabold bg-amber-50' : 'text-amber-600 hover:text-amber-800 font-semibold'}">
                  <i class="fa-solid fa-trophy text-[10px]"></i> Kiểm tra Unit (25 câu)
                </button>
              </div>
            ` : ""}
          </div>
        `;
      }).join("")}
    `;
  },

  renderItEsp() {
    this.ensureEspUnitExamState();
    this.renderSidebarEspFolders();
    const unit = this.getCurrentUnitData();
    const m = this.calculateUnitMetrics(unit.id);
    const bestExamScore = this.state.espUnitBestScores[unit.id];
    const passage = this.getClozePassageData(unit);

    const folders = [
      {
        id: "unit1",
        path: "src/data/itEsp/unit01/",
        title: "Unit 1: Working in IT",
        desc: "Nghề nghiệp CNTT, bài đọc Apple Inc. (kèm nút Dịch bên cạnh) & dịch thuật",
        files: ["vocab.js (40 từ)", "practice.js (25 câu)", "Apple Inc. (10 từ)", "10 câu Dịch"]
      },
      {
        id: "unit2",
        path: "src/data/itEsp/unit02/",
        title: "Unit 2: IT Systems",
        desc: "Phần cứng, phần mềm, bài đọc IT Systems (kèm nút Dịch bên cạnh)",
        files: ["vocab.js (40 từ)", "practice.js (35 câu)", "IT Systems (10 từ)", "10 câu Dịch"]
      },
      {
        id: "unit3",
        path: "src/data/itEsp/unit03/",
        title: "Unit 3: Data Communication",
        desc: "Truyền thông dữ liệu, mạng LAN/WAN, cấu trúc mạng & giao thức Email",
        files: ["vocab.js (50 từ)", "practice.js (25 câu)", "Data Comm (10 từ)", "10 câu Dịch"]
      }
    ];

    const activeFolder = folders.find(f => f.id === this.state.activeUnit) || folders[0];

    const steps = [
      { id: "step1_vocab", file: "vocab.js", title: "1. Từ Vựng & IPA", sub: `${m.vocabMastered}/${unit.vocabulary.length} đã thuộc`, icon: "fa-book-open" },
      { id: "step2_typing", file: "typing", title: "2. Luyện Gõ Chủ Động", sub: "Trộn ngẫu nhiên & chấm màu", icon: "fa-keyboard" },
      { id: "step3_practice", file: "practice.js", title: "3. Bài Tập (Part 1–3)", sub: `MCQ • Bài đọc ${passage.title} • Nối từ`, icon: "fa-list-check" },
      { id: "step4_production", file: "translation.js", title: "4. Dịch Học Thuật", sub: "5 câu dịch Việt + 5 câu dịch Anh", icon: "fa-language" },
      { id: "step5_exam", file: "exam.js", title: "5. Kiểm Tra Unit", sub: bestExamScore !== undefined ? `Điểm cao nhất: ${bestExamScore}%` : "Đề ngẫu nhiên • Nộp mới hiện giải", icon: "fa-trophy" }
    ];

    return `
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${folders.map(f => {
            const isCurrent = this.state.activeUnit === f.id;
            const metrics = this.calculateUnitMetrics(f.id);
            const folderBestExam = this.state.espUnitBestScores[f.id];
            return `
              <div
                onclick="App.switchEspUnit('${f.id}')"
                class="academic-card p-5 cursor-pointer transition-all border-2 flex flex-col justify-between gap-4 ${
                  isCurrent
                    ? "border-indigo-600 bg-indigo-50/30 shadow-md"
                    : "border-slate-200 hover:border-indigo-300 bg-white"
                }"
              >
                <div class="space-y-2">
                  <div class="flex items-center justify-between gap-2">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold ${
                      isCurrent ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                    }">
                      <i class="fa-solid ${isCurrent ? "fa-folder-open" : "fa-folder text-amber-500"}"></i>
                      ${f.path}
                    </span>
                    <span class="text-xs font-mono font-extrabold ${isCurrent ? "text-indigo-700" : "text-slate-500"}">
                      ${folderBestExam !== undefined ? `Thi: ${folderBestExam}%` : `${metrics.overallPercent}%`}
                    </span>
                  </div>
                  <h3 class="text-base font-extrabold text-slate-900">${f.title}</h3>
                  <p class="text-xs text-slate-500 line-clamp-2">${f.desc}</p>
                </div>

                <div class="space-y-2 pt-2 border-t border-slate-200/80">
                  <div class="flex flex-wrap gap-1.5">
                    ${f.files.map(fileName => `
                      <span class="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-600">
                        <i class="fa-regular fa-file-code text-indigo-500 mr-1"></i>${fileName}
                      </span>
                    `).join("")}
                  </div>
                  <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div class="h-full bg-indigo-600 transition-all duration-300" style="width: ${metrics.overallPercent}%"></div>
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <div class="academic-card overflow-hidden">
          <div class="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 bg-slate-900 text-white">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-base font-bold shrink-0">
                <i class="fa-solid fa-folder-open"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-mono text-amber-300">${activeFolder.path}</span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-200">${unit.pages || "IT ESP"}</span>
                </div>
                <h3 class="text-base sm:text-lg font-extrabold text-white mt-0.5">${unit.title}</h3>
              </div>
            </div>

            <button
              type="button"
              onclick="App.switchEspStep('step5_exam')"
              class="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition whitespace-nowrap flex items-center gap-2 self-start lg:self-center"
            >
              <i class="fa-solid fa-trophy"></i> Làm Bài Kiểm Tra Unit (Đề Ngẫu Nhiên)
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-white">
            ${steps.map(s => `
              <button onclick="App.switchEspStep('${s.id}')" class="step-tab p-4 text-left flex items-start gap-3 ${this.state.activeStep === s.id ? 'active' : 'hover:bg-slate-50'}">
                <div class="w-8 h-8 rounded-lg ${this.state.activeStep === s.id ? 'bg-blue-600 text-white' : s.id === 'step5_exam' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'} flex items-center justify-center text-xs shrink-0">
                  <i class="fa-solid ${s.icon}"></i>
                </div>
                <div class="min-w-0">
                  <span class="text-[10px] font-mono font-bold ${s.id === 'step5_exam' ? 'text-amber-600' : 'text-blue-600'} block">${s.file}</span>
                  <span class="text-xs font-bold text-slate-900 block truncate">${s.title}</span>
                  <span class="text-[11px] text-slate-500 block truncate">${s.sub}</span>
                </div>
              </button>
            `).join("")}
          </div>
        </div>

        <div>
          ${this.state.activeStep === "step1_vocab" ? this.renderStep1Vocab(unit) : ""}
          ${this.state.activeStep === "step2_typing" ? this.renderStep2Typing(unit) : ""}
          ${this.state.activeStep === "step3_practice" ? this.renderStep3Practice(unit) : ""}
          ${this.state.activeStep === "step4_production" ? this.renderStep4Production(unit) : ""}
          ${this.state.activeStep === "step5_exam" ? this.renderStep5UnitExam(unit) : ""}
        </div>
      </div>
    `;
  },

  renderStep1Vocab(unit) {
    return `
      <div class="academic-card p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
        ${unit.vocabulary.map(item => `
          <div class="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2 hover:border-blue-400 transition">
            <div>
              <p class="font-bold text-sm text-slate-900">${item.id}. ${item.word} <span class="font-mono text-xs text-blue-600">${item.ipa || ""}</span></p>
              <p class="text-xs text-slate-600">${item.meaning}</p>
            </div>
            <button onclick="AudioEngine.speak('${item.word.replace(/'/g, "\\'")}', 1.0)" class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-xs shrink-0">
              <i class="fa-solid fa-volume-high"></i>
            </button>
          </div>
        `).join("")}
      </div>
    `;
  }
});