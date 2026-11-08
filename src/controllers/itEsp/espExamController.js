Object.assign(window.App, {
  ensureEspUnitExamState() {
    if (this.state.espExamSchemaVersion !== 4) {
      this.state.espUnitExams = {};
      this.state.espExamSchemaVersion = 4;
    }
    if (!this.state.espUnitExams) this.state.espUnitExams = {};
    if (!this.state.espUnitExamChoices) this.state.espUnitExamChoices = {};
    if (!this.state.espUnitExamCloze) this.state.espUnitExamCloze = {};
    if (!this.state.espUnitExamInputs) this.state.espUnitExamInputs = {};
    if (!this.state.espUnitExamSubmitted) this.state.espUnitExamSubmitted = {};
    if (!this.state.showExamSideTranslation) this.state.showExamSideTranslation = {};
    if (!this.state.espUnitBestScores) {
      const saved = localStorage.getItem("anyht_esp_unit_best_scores");
      this.state.espUnitBestScores = saved ? JSON.parse(saved) : {};
    }
  },

  toggleExamPassageTranslation(unitId) {
    this.ensureEspUnitExamState();
    this.state.showExamSideTranslation[unitId] = !this.state.showExamSideTranslation[unitId];
    this.render();
  },

  gradeExamTranslationItem(q, rawUserText) {
    const userText = String(rawUserText || "").trim();
    const keywords = Array.isArray(q.keywords) ? q.keywords : [];

    if (!userText) {
      return {
        answered: false,
        passed: false,
        scorePercent: 0,
        matchedKeywords: [],
        missingKeywords: keywords
      };
    }

    const lowerUser = userText.toLowerCase();
    const matchedKeywords = [];
    const missingKeywords = [];

    keywords.forEach(kw => {
      if (lowerUser.includes(String(kw).toLowerCase())) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    let scorePercent = keywords.length
      ? Math.round((matchedKeywords.length / keywords.length) * 100)
      : (userText.length >= 10 ? 100 : 0);

    if (
      q.modelAnswer &&
      this.normalizeAnswer(userText) === this.normalizeAnswer(q.modelAnswer)
    ) {
      scorePercent = 100;
    }

    return {
      answered: true,
      passed: scorePercent >= 60,
      scorePercent,
      matchedKeywords,
      missingKeywords
    };
  },

  generateRandomEspUnitExam(unitId, forceNew = false) {
    this.ensureEspUnitExamState();
    if (this.state.espUnitExams[unitId] && !forceNew) {
      return this.state.espUnitExams[unitId];
    }

    const unit = this.getUnitById(unitId) || this.getCurrentUnitData();
    const passage = this.getClozePassageData(unit);
    const questions = [];
    const labels = ["A", "B", "C", "D"];

    // 1. Phần I: 5 câu Từ vựng ngẫu nhiên (MCQ)
    const vocabList = unit.vocabulary || [];
    const pickedVocab = this.shuffleArray([...vocabList]).slice(0, Math.min(5, vocabList.length));
    pickedVocab.forEach(v => {
      const cleanWord = this.getTargetCleanWord ? this.getTargetCleanWord(v.word) : v.word;
      const distractors = this.shuffleArray(
        vocabList.filter(item => item.id !== v.id)
      ).slice(0, 3);

      const rawPool = this.shuffleArray([v, ...distractors]);
      const correctIdx = rawPool.findIndex(item => item.id === v.id);
      const options = rawPool.map((item, i) => {
        const w = this.getTargetCleanWord ? this.getTargetCleanWord(item.word) : item.word;
        return `${labels[i]}. ${w}`;
      });

      const distractorNotes = distractors
        .map(d => `${this.getTargetCleanWord ? this.getTargetCleanWord(d.word) : d.word} (${d.meaning})`)
        .join("; ");

      questions.push({
        id: `${unitId}-ex-voc-${v.id}`,
        type: "MCQ",
        section: "Phần I: Từ Vựng & Thuật Ngữ Chuyên Ngành",
        badge: "Từ vựng",
        q: `Thuật ngữ tiếng Anh nào dưới đây có nghĩa là: "${v.meaning}"?`,
        options,
        correct: correctIdx,
        correctText: options[correctIdx],
        explanation: `Thuật ngữ "${cleanWord}" ${v.ipa || ""} có nghĩa tiếng Việt là "${v.meaning}". (Nghĩa các từ còn lại: ${distractorNotes}).`
      });
    });

    // 2. Phần II: 6 câu Trắc nghiệm Ngữ pháp & CNTT + 4 câu Nối định nghĩa
    const mcqList = unit.mcqs || [];
    const pickedMcqs = this.shuffleArray([...mcqList]).slice(0, Math.min(6, mcqList.length));
    pickedMcqs.forEach(m => {
      const cleanQ = String(m.q || "").replace(/^(Question\s*\d+[\.:]|\d+[\.:])\s*/i, "").trim();
      questions.push({
        id: `${unitId}-ex-mcq-${m.id}`,
        type: "MCQ",
        section: "Phần II: Trắc Nghiệm Ngữ Pháp & Định Nghĩa Thuật Ngữ",
        badge: "Trắc nghiệm",
        q: cleanQ,
        options: m.options || [],
        correct: m.correct,
        correctText: (m.options || [])[m.correct] || "",
        explanation: m.explanation || "Đối chiếu cấu trúc ngữ pháp và ngữ cảnh câu để chọn đáp án chính xác."
      });
    });

    const matchingList = unit.matching || [];
    const pickedMatching = this.shuffleArray([...matchingList]).slice(0, Math.min(4, matchingList.length));
    pickedMatching.forEach(m => {
      const cleanTerm = String(m.term || "").replace(/^\d+\.\s*/, "").trim();
      const cleanDef = String(m.definition || "").replace(/^[A-Z]\.\s*/i, "").trim();

      const otherTerms = this.shuffleArray(
        matchingList
          .map(x => String(x.term || "").replace(/^\d+\.\s*/, "").trim())
          .filter(t => t.toLowerCase() !== cleanTerm.toLowerCase())
      ).slice(0, 3);

      const rawOpts = this.shuffleArray([cleanTerm, ...otherTerms]);
      const correctIdx = rawOpts.findIndex(t => t.toLowerCase() === cleanTerm.toLowerCase());
      const options = rawOpts.map((t, i) => `${labels[i]}. ${t}`);
      const vnGuide = this.getVietnameseInfoForTerm(unit, cleanTerm);

      questions.push({
        id: `${unitId}-ex-mat-${m.id}`,
        type: "MCQ",
        section: "Phần II: Trắc Nghiệm Ngữ Pháp & Định Nghĩa Thuật Ngữ",
        badge: "Định nghĩa",
        q: `Định nghĩa tiếng Anh: "${cleanDef}" mô tả thuật ngữ nào sau đây?`,
        options,
        correct: correctIdx,
        correctText: options[correctIdx],
        explanation: `Đáp án đúng là "${cleanTerm}" (nghĩa tiếng Việt: ${vnGuide.vnTerm}). Dịch nghĩa định nghĩa: "${vnGuide.vnDef}".`
      });
    });

    // 3. Phần III: Giữ nguyên bài viết và rút ngẫu nhiên 5 chỗ trống (5 câu) để điền từ
    const pickedBlanks = this.shuffleArray([...(passage.blanks || [])])
      .slice(0, 5)
      .sort((a, b) => a.index - b.index);

    pickedBlanks.forEach((b, idx) => {
      questions.push({
        id: `${unitId}-ex-cloze-${b.index}`,
        type: "CLOZE_BLANK",
        blankIndex: b.index,
        displayBlankNum: idx + 1,
        section: `Phần III: Điền Từ Vào Bài Viết — "${passage.title}" (5 câu)`,
        badge: `Vị trí (${idx + 1})`,
        answer: b.answer,
        vnMeaning: b.vnMeaning,
        explanation: b.explain
      });
    });

    // 4. Phần IV: 5 câu Tự luận Dịch thuật (2 câu dịch nghĩa Tiếng Việt + 3 câu dịch sang Tiếng Anh)
    const { enToVi, viToEn } = this.getCategorizedTranslations(unit);
    const pickedEnToVi = this.shuffleArray([...enToVi]).slice(0, 2);
    const pickedViToEn = this.shuffleArray([...viToEn]).slice(0, 3);

    pickedEnToVi.forEach(t => {
      questions.push({
        id: `${unitId}-ex-tr-envi-${t.id}`,
        type: "TRANSLATION",
        direction: "EN_TO_VI",
        section: "Phần IV: Tự Luận Dịch Thuật (2 Câu Dịch Nghĩa Tiếng Việt & 3 Câu Dịch Tiếng Anh)",
        badge: "Anh → Việt",
        promptLabel: "DỊCH CÂU TIẾNG ANH SAU SANG NGHĨA TIẾNG VIỆT:",
        placeholder: "Nhập bản dịch nghĩa Tiếng Việt của bạn...",
        source: t.source,
        modelAnswer: t.modelAnswer,
        keywords: t.keywords || []
      });
    });

    pickedViToEn.forEach(t => {
      questions.push({
        id: `${unitId}-ex-tr-vien-${t.id}`,
        type: "TRANSLATION",
        direction: "VI_TO_EN",
        section: "Phần IV: Tự Luận Dịch Thuật (2 Câu Dịch Nghĩa Tiếng Việt & 3 Câu Dịch Tiếng Anh)",
        badge: "Việt → Anh",
        promptLabel: "DỊCH CÂU TIẾNG VIỆT SAU SANG TIẾNG ANH:",
        placeholder: "Nhập câu dịch Tiếng Anh của bạn...",
        source: t.source,
        modelAnswer: t.modelAnswer,
        keywords: t.keywords || []
      });
    });

    const numberedQuestions = questions.map((item, idx) => ({
      ...item,
      number: idx + 1
    }));

    this.state.espUnitExams[unitId] = numberedQuestions;
    this.state.espUnitExamCloze[unitId] = {};
    this.state.showExamSideTranslation[unitId] = false;
    delete this.state.espUnitExamSubmitted[unitId];
    numberedQuestions.forEach(q => {
      delete this.state.espUnitExamChoices[q.id];
      delete this.state.espUnitExamInputs[q.id];
    });

    return numberedQuestions;
  },

  selectEspUnitExamChoice(unitId, qId, optIdx) {
    this.ensureEspUnitExamState();
    if (this.state.espUnitExamSubmitted[unitId]) return;
    this.state.espUnitExamChoices[qId] = optIdx;
    this.render();
  },

  selectEspExamClozeBlank(unitId, blankIdx, value) {
    this.ensureEspUnitExamState();
    if (this.state.espUnitExamSubmitted[unitId]) return;
    if (!this.state.espUnitExamCloze[unitId]) this.state.espUnitExamCloze[unitId] = {};
    this.state.espUnitExamCloze[unitId][blankIdx] = value;
    this.render();
  },

  onEspUnitExamTranslationInput(unitId, qId, qNumber, value) {
    this.ensureEspUnitExamState();
    if (this.state.espUnitExamSubmitted[unitId]) return;
    this.state.espUnitExamInputs[qId] = value;

    const hasText = String(value || "").trim().length > 0;
    const cellEl = document.getElementById(`esp-exam-cell-${qNumber}`);
    if (cellEl) {
      cellEl.className = `h-9 rounded-lg border text-xs font-mono flex items-center justify-center transition ${
        hasText
          ? "bg-blue-600 text-white border-blue-600 font-bold"
          : "bg-slate-100 text-slate-600 border-slate-200 hover:border-blue-400"
      }`;
    }

    const cardEl = document.getElementById(`esp-exam-q-${qNumber}`);
    if (cardEl) {
      cardEl.classList.toggle("border-blue-300", hasText);
      cardEl.classList.toggle("bg-blue-50/20", hasText);
      cardEl.classList.toggle("border-slate-200", !hasText);
    }

    const scoreInfo = this.calculateEspUnitExamScore(unitId);
    const countEl = document.getElementById("esp-exam-answered-count");
    if (countEl) {
      countEl.innerHTML = `Đã làm: <strong>${scoreInfo.answered}/${scoreInfo.total} câu</strong> • Chưa nộp bài`;
    }
    const barEl = document.getElementById("esp-exam-progress-bar");
    if (barEl) {
      barEl.style.width = `${Math.round((scoreInfo.answered / scoreInfo.total) * 100)}%`;
    }
  },

  calculateEspUnitExamScore(unitId) {
    this.ensureEspUnitExamState();
    const questions = this.generateRandomEspUnitExam(unitId, false);
    const clozeMap = this.state.espUnitExamCloze[unitId] || {};
    const total = questions.length || 1;
    let answered = 0;
    let correct = 0;

    questions.forEach(q => {
      if (q.type === "TRANSLATION") {
        const res = this.gradeExamTranslationItem(q, this.state.espUnitExamInputs[q.id]);
        if (res.answered) answered++;
        if (res.passed) correct++;
      } else if (q.type === "CLOZE_BLANK") {
        const val = (clozeMap[q.blankIndex] || "").trim();
        if (val) {
          answered++;
          if (val.toLowerCase() === q.answer.toLowerCase()) correct++;
        }
      } else {
        const chosen = this.state.espUnitExamChoices[q.id];
        if (chosen !== undefined) {
          answered++;
          if (chosen === q.correct) correct++;
        }
      }
    });

    const percent = Math.round((correct / total) * 100);
    const grade10 = ((correct / total) * 10).toFixed(1);
    const minRequired = Math.ceil(total * 0.8);
    return { correct, total, answered, percent, grade10, minRequired };
  },

  submitEspUnitExam(unitId) {
    this.ensureEspUnitExamState();
    const scoreInfo = this.calculateEspUnitExamScore(unitId);

    if (scoreInfo.answered < scoreInfo.total) {
      const remaining = scoreInfo.total - scoreInfo.answered;
      this.toast(
        `⚠️ Bạn còn <strong>${remaining} câu chưa hoàn thành</strong>. Hệ thống vẫn chấm điểm và mở khóa toàn bộ đáp án + giải thích!`,
        "info"
      );
    }

    this.state.espUnitExamSubmitted[unitId] = true;

    const prevBest = this.state.espUnitBestScores[unitId] || 0;
    if (scoreInfo.percent > prevBest) {
      this.state.espUnitBestScores[unitId] = scoreInfo.percent;
      localStorage.setItem("anyht_esp_unit_best_scores", JSON.stringify(this.state.espUnitBestScores));
    }

    if (scoreInfo.percent >= 80) {
      window.AudioEngine.playTone("success");
      this.state.user.xp += 100;
      this.toast(
        `🎉 Xuất sắc! Bạn đạt <strong>${scoreInfo.percent}% (${scoreInfo.correct}/${scoreInfo.total} câu — ${scoreInfo.grade10}/10 điểm)</strong>!`,
        "success"
      );
    } else {
      window.AudioEngine.playTone("error");
      this.toast(
        `📊 Bạn đạt <strong>${scoreInfo.percent}% (${scoreInfo.correct}/${scoreInfo.total} câu)</strong>. Hãy xem kỹ lời giải và bản dịch chuẩn bên dưới nhé!`,
        "error"
      );
    }

    this.updateSidebarStats();
    this.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  retakeSameEspUnitExam(unitId) {
    this.ensureEspUnitExamState();
    const questions = this.state.espUnitExams[unitId] || [];
    delete this.state.espUnitExamSubmitted[unitId];
    this.state.espUnitExamCloze[unitId] = {};
    questions.forEach(q => {
      delete this.state.espUnitExamChoices[q.id];
      delete this.state.espUnitExamInputs[q.id];
    });
    this.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.toast("🔄 Đã xóa các câu trả lời cũ để bạn làm lại đề này!", "info");
  },

  newRandomEspUnitExam(unitId) {
    this.generateRandomEspUnitExam(unitId, true);
    this.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.toast("🎲 Đã tạo đề kiểm tra ngẫu nhiên mới!", "info");
  },

  renderStep5UnitExam(unit) {
    this.ensureEspUnitExamState();
    const questions = this.generateRandomEspUnitExam(unit.id, false);
    const passage = this.getClozePassageData(unit);
    const examClozeMap = this.state.espUnitExamCloze[unit.id] || {};
    const isSubmitted = Boolean(this.state.espUnitExamSubmitted[unit.id]);
    const showExamTrans = Boolean(this.state.showExamSideTranslation[unit.id]);
    const scoreInfo = this.calculateEspUnitExamScore(unit.id);
    const passed80 = scoreInfo.percent >= 80;

    const mcqSections = [
      "Phần I: Từ Vựng & Thuật Ngữ Chuyên Ngành",
      "Phần II: Trắc Nghiệm Ngữ Pháp & Định Nghĩa Thuật Ngữ"
    ];
    const clozeQuestions = questions.filter(q => q.type === "CLOZE_BLANK");
    const activeExamBlankIndices = clozeQuestions.map(q => q.blankIndex);
    const translationQuestions = questions.filter(q => q.type === "TRANSLATION");

    return `
      <div class="space-y-6">
        <div class="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono font-extrabold text-[11px] uppercase">
                <i class="fa-solid fa-shuffle mr-1"></i> ĐỀ KIỂM TRA TỔNG HỢP UNIT (${questions.length} CÂU)
              </span>
              <span class="px-2.5 py-0.5 rounded-md bg-white/10 text-cyan-300 font-mono text-xs font-semibold">
                Chỉ hiện Đáp án & Giải thích sau khi Nộp bài
              </span>
            </div>
            <h3 class="text-lg sm:text-xl font-extrabold text-white">
              Bài Kiểm Tra Đánh Giá Năng Lực — ${unit.title}
            </h3>
            <p class="text-xs text-slate-300">
              Cấu trúc đề: <strong>Từ vựng (5 câu)</strong> • <strong>Ngữ pháp & Định nghĩa (10 câu)</strong> • <strong>Điền từ bài viết "${passage.title}" (5 câu)</strong> • <strong>Dịch thuật (2 câu dịch nghĩa Tiếng Việt + 3 câu dịch Tiếng Anh)</strong>.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2 shrink-0">
            ${isSubmitted ? `
              <button
                type="button"
                onclick="App.retakeSameEspUnitExam('${unit.id}')"
                class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition whitespace-nowrap"
              >
                <i class="fa-solid fa-rotate-left mr-1"></i> Làm lại đề này
              </button>
            ` : ""}
            <button
              type="button"
              onclick="App.newRandomEspUnitExam('${unit.id}')"
              class="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-md transition whitespace-nowrap flex items-center gap-1.5"
            >
              <i class="fa-solid fa-dice"></i> Đổi Đề Ngẫu Nhiên Mới
            </button>
          </div>
        </div>

        ${isSubmitted ? `
          <div class="academic-card p-6 ${passed80 ? 'bg-gradient-to-r from-emerald-50 via-white to-blue-50 border-2 border-emerald-500' : 'bg-gradient-to-r from-rose-50 via-white to-amber-50 border-2 border-rose-400'} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl ${passed80 ? 'bg-emerald-600' : 'bg-rose-600'} text-white flex flex-col items-center justify-center font-mono shadow-md shrink-0">
                <span class="text-lg font-black leading-none">${scoreInfo.percent}%</span>
                <span class="text-[10px] opacity-90 mt-0.5">${scoreInfo.grade10}/10</span>
              </div>
              <div class="space-y-1">
                <span class="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full ${passed80 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                  <i class="fa-solid ${passed80 ? 'fa-award' : 'fa-circle-info'}"></i>
                  ${passed80 ? 'ĐẠT YÊU CẦU KIỂM TRA UNIT (≥ 80%)' : 'KẾT QUẢ BÀI KIỂM TRA — ĐÃ MỞ KHÓA TOÀN BỘ LỜI GIẢI CHI TIẾT'}
                </span>
                <h4 class="text-base font-extrabold text-slate-900">
                  Bạn hoàn thành đúng ${scoreInfo.correct} / ${scoreInfo.total} câu (${scoreInfo.grade10} / 10 điểm)
                </h4>
                <p class="text-xs text-slate-600">
                  Toàn bộ đáp án, giải thích 5 vị trí điền từ trong bài viết "${passage.title}" và 5 câu dịch chuẩn đã được hiển thị bên dưới.
                </p>
              </div>
            </div>

            <button
              type="button"
              onclick="App.newRandomEspUnitExam('${unit.id}')"
              class="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md whitespace-nowrap transition flex items-center gap-2"
            >
              <i class="fa-solid fa-shuffle"></i> Luyện Đề Ngẫu Nhiên Khác
            </button>
          </div>
        ` : ""}

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div class="lg:col-span-8 space-y-6">

            ${mcqSections.map(secTitle => {
              const secQuestions = questions.filter(q => q.section === secTitle);
              if (!secQuestions.length) return "";
              return `
                <div class="academic-card p-6 space-y-4">
                  <div class="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h4 class="font-extrabold text-sm text-indigo-700 uppercase tracking-wider">
                      ${secTitle} (${secQuestions.length} câu)
                    </h4>
                    <span class="text-[11px] font-semibold text-slate-400">
                      ${isSubmitted ? "Đã mở khóa đáp án & giải thích" : "Đang ẩn đáp án"}
                    </span>
                  </div>

                  <div class="space-y-4">
                    ${secQuestions.map(q => this.renderExamMcqCardHtml(unit.id, q, isSubmitted)).join("")}
                  </div>
                </div>
              `;
            }).join("")}

            ${clozeQuestions.length > 0 ? `
              <div id="esp-exam-q-${clozeQuestions[0].number}" class="academic-card p-6 space-y-5">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <h4 class="font-extrabold text-sm text-indigo-700 uppercase tracking-wider">
                      Phần III: Điền Từ Vào Bài Viết — "${passage.title}" (5 câu: Câu ${clozeQuestions[0].number} – Câu ${clozeQuestions[clozeQuestions.length - 1].number})
                    </h4>
                    <p class="text-xs text-slate-500 mt-0.5">
                      Chọn từ trong hộp từ vựng để điền trực tiếp vào 5 vị trí (1) &rarr; (5) ngay trong bài viết
                    </p>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    ${isSubmitted ? `
                      <button
                        type="button"
                        onclick="App.toggleExamPassageTranslation('${unit.id}')"
                        class="px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm ${
                          showExamTrans
                            ? "bg-emerald-600 text-white"
                            : "bg-amber-400 hover:bg-amber-300 text-slate-950"
                        }"
                      >
                        <i class="fa-solid fa-language"></i>
                        <span>${showExamTrans ? "Ẩn dịch văn bản" : "Dịch văn bản"}</span>
                      </button>
                    ` : `
                      <span class="text-[11px] font-semibold text-slate-400">
                        Đang ẩn đáp án & bản dịch
                      </span>
                    `}
                  </div>
                </div>

                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-300 space-y-2">
                  <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block">
                    <i class="fa-solid fa-box-open text-indigo-600 mr-1"></i> Words in the box (Ngân hàng từ cho sẵn):
                  </span>
                  <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    ${(passage.wordBank || []).map(w => {
                      const isPicked = Object.values(examClozeMap).some(
                        chosen => String(chosen || "").toLowerCase() === w.toLowerCase()
                      );
                      return `
                        <div class="px-3 py-1.5 rounded-xl font-mono text-xs font-bold border text-center ${
                          isPicked
                            ? "bg-blue-50 text-blue-700 border-blue-300"
                            : "bg-white text-slate-800 border-slate-300"
                        }">
                          ${w}
                        </div>
                      `;
                    }).join("")}
                  </div>
                </div>

                ${this.renderClozePassageWithSideTranslation(
                  unit.id,
                  passage,
                  examClozeMap,
                  "App.selectEspExamClozeBlank",
                  isSubmitted,
                  isSubmitted,
                  isSubmitted && showExamTrans,
                  activeExamBlankIndices
                )}

                ${isSubmitted ? `
                  <div class="space-y-3 pt-3 border-t border-slate-200">
                    <h5 class="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                      Giải thích chi tiết 5 vị trí điền từ trong bài viết "${passage.title}":
                    </h5>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      ${clozeQuestions.map(cq => {
                        const userVal = examClozeMap[cq.blankIndex] || "";
                        const isOk = userVal.toLowerCase() === cq.answer.toLowerCase();
                        return `
                          <div id="esp-exam-q-${cq.number}" class="p-3.5 rounded-xl border text-xs space-y-1 ${
                            isOk ? "bg-emerald-50/50 border-emerald-400" : "bg-rose-50/50 border-rose-400"
                          }">
                            <div class="flex items-center justify-between">
                              <span class="font-extrabold ${isOk ? "text-emerald-800" : "text-rose-800"}">
                                Câu ${cq.number} — Vị trí (${cq.displayBlankNum}): ${isOk ? "✓ Đúng" : `✗ Sai (${userVal || "Trống"})`}
                              </span>
                              <span class="px-2 py-0.5 rounded font-mono font-bold bg-white border border-slate-200 text-emerald-700">
                                Đáp án: ${cq.answer}
                              </span>
                            </div>
                            <p class="text-slate-700 leading-relaxed">
                              <strong>Nghĩa:</strong> <em>${cq.vnMeaning}</em> — ${cq.explanation}
                            </p>
                          </div>
                        `;
                      }).join("")}
                    </div>
                  </div>
                ` : ""}
              </div>
            ` : ""}

            ${translationQuestions.length > 0 ? `
              <div class="academic-card p-6 space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <h4 class="font-extrabold text-sm text-indigo-700 uppercase tracking-wider">
                      Phần IV: Tự Luận Dịch Thuật (2 Câu Dịch Nghĩa Tiếng Việt & 3 Câu Dịch Tiếng Anh)
                    </h4>
                    <p class="text-xs text-slate-500 mt-0.5">
                      Gồm 2 câu dịch từ Tiếng Anh sang Tiếng Việt và 3 câu dịch từ Tiếng Việt sang Tiếng Anh
                    </p>
                  </div>
                  <span class="text-[11px] font-semibold text-slate-400 shrink-0">
                    ${isSubmitted ? "Đã mở khóa bản dịch chuẩn" : "Đang ẩn đáp án"}
                  </span>
                </div>

                <div class="space-y-4">
                  ${translationQuestions.map(q => {
                    const userTrans = this.state.espUnitExamInputs[q.id] || "";
                    const gradeRes = this.gradeExamTranslationItem(q, userTrans);
                    const isEnToVi = q.direction === "EN_TO_VI";

                    let transBorder = "border-slate-200 bg-slate-50/70";
                    if (!isSubmitted && gradeRes.answered) {
                      transBorder = "border-blue-300 bg-blue-50/20";
                    } else if (isSubmitted) {
                      transBorder = gradeRes.passed
                        ? "border-emerald-500 bg-emerald-50/30"
                        : "border-rose-400 bg-rose-50/30";
                    }

                    return `
                      <div id="esp-exam-q-${q.number}" class="p-5 rounded-xl border-2 transition ${transBorder} space-y-3">
                        <div class="flex items-start justify-between gap-3">
                          <div class="space-y-1">
                            <div class="flex flex-wrap items-center gap-2">
                              <span class="inline-flex items-center justify-center px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-xs font-bold">
                                Câu ${q.number}
                              </span>
                              <span class="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase ${
                                isEnToVi
                                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                                  : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              }">
                                ${q.promptLabel}
                              </span>
                            </div>
                            <p class="font-bold text-xs sm:text-sm text-slate-900 leading-relaxed pt-1">
                              ${q.source}
                            </p>
                          </div>

                          ${isEnToVi ? `
                            <button
                              type="button"
                              onclick="AudioEngine.speak('${q.source.replace(/'/g, "\\'")}', 1.0)"
                              class="px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-600 hover:text-white text-slate-600 border border-slate-200 text-xs shrink-0 transition"
                              title="Nghe câu tiếng Anh"
                            >
                              <i class="fa-solid fa-volume-high"></i>
                            </button>
                          ` : ""}
                        </div>

                        <textarea
                          rows="3"
                          placeholder="${q.placeholder}"
                          ${isSubmitted ? "readonly" : ""}
                          oninput="App.onEspUnitExamTranslationInput('${unit.id}', '${q.id}', ${q.number}, this.value)"
                          class="w-full p-3.5 rounded-xl bg-white border border-slate-300 focus:border-blue-600 focus:outline-none text-xs sm:text-sm text-slate-900 leading-relaxed transition ${isSubmitted ? 'bg-slate-50 cursor-default' : ''}"
                        >${userTrans}</textarea>

                        ${isSubmitted ? `
                          <div class="p-4 rounded-xl bg-white border ${gradeRes.passed ? 'border-emerald-300' : 'border-rose-300'} text-xs space-y-2.5 shadow-sm">
                            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                              <span class="font-extrabold ${gradeRes.passed ? 'text-emerald-700' : 'text-rose-700'}">
                                ${gradeRes.passed
                                  ? `✓ Đạt yêu cầu dịch thuật (Khớp ${gradeRes.scorePercent}% từ khóa trọng tâm)`
                                  : gradeRes.answered
                                  ? `✗ Bản dịch chưa đủ ý (Mới khớp ${gradeRes.scorePercent}% từ khóa — Cần ≥ 60%)`
                                  : `⚠️ Bạn đã bỏ trống câu dịch này (0%)`}
                              </span>
                              <span class="px-2.5 py-0.5 rounded-full font-mono font-bold text-[11px] ${gradeRes.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                                Điểm từ khóa: ${gradeRes.scorePercent}%
                              </span>
                            </div>

                            <div class="space-y-1">
                              <p class="font-extrabold text-indigo-700">
                                ✓ ${isEnToVi ? "Bản dịch nghĩa Tiếng Việt chuẩn:" : "Câu dịch Tiếng Anh chuẩn:"}
                              </p>
                              <p class="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-slate-900 font-semibold leading-relaxed">
                                "${q.modelAnswer}"
                              </p>
                            </div>

                            <div class="space-y-1.5 pt-1">
                              <p class="font-bold text-slate-700">Các từ khóa bắt buộc cần có trong câu dịch:</p>
                              <div class="flex flex-wrap gap-1.5">
                                ${(q.keywords || []).map(kw => {
                                  const isHit = gradeRes.matchedKeywords.includes(kw);
                                  return `
                                    <span class="px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold border ${
                                      isHit
                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                        : 'bg-rose-50 text-rose-700 border-rose-300'
                                    }">
                                      ${isHit ? '✓ Đã có:' : '✗ Còn thiếu:'} "${kw}"
                                    </span>
                                  `;
                                }).join("")}
                              </div>
                            </div>
                          </div>
                        ` : ""}
                      </div>
                    `;
                  }).join("")}
                </div>
              </div>
            ` : ""}

          </div>

          <div class="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
            <div class="academic-card p-5 space-y-4 border-2 border-indigo-100">
              <div class="border-b border-slate-200 pb-3">
                <h4 class="font-extrabold text-sm text-slate-900">Phiếu Làm Bài Kiểm Tra Unit</h4>
                <p id="esp-exam-answered-count" class="text-[11px] text-slate-500 mt-0.5">
                  ${isSubmitted
                    ? `Kết quả: <strong class="text-emerald-600">Đúng ${scoreInfo.correct}/${scoreInfo.total} câu (${scoreInfo.percent}%)</strong>`
                    : `Đã làm: <strong>${scoreInfo.answered}/${scoreInfo.total} câu</strong> • Chưa nộp bài`}
                </p>
              </div>

              <div class="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  id="esp-exam-progress-bar"
                  class="h-full transition-all duration-300 ${isSubmitted ? (passed80 ? 'bg-emerald-500' : 'bg-rose-500') : 'bg-blue-600'}"
                  style="width: ${isSubmitted ? scoreInfo.percent : Math.round((scoreInfo.answered / scoreInfo.total) * 100)}%"
                ></div>
              </div>

              <div class="grid grid-cols-5 gap-2">
                ${questions.map(q => {
                  let isAnswered = false;
                  let isCorrect = false;

                  if (q.type === "TRANSLATION") {
                    const res = this.gradeExamTranslationItem(q, this.state.espUnitExamInputs[q.id]);
                    isAnswered = res.answered;
                    isCorrect = res.passed;
                  } else if (q.type === "CLOZE_BLANK") {
                    const val = (examClozeMap[q.blankIndex] || "").trim();
                    isAnswered = Boolean(val);
                    isCorrect = isAnswered && val.toLowerCase() === q.answer.toLowerCase();
                  } else {
                    const chosen = this.state.espUnitExamChoices[q.id];
                    isAnswered = chosen !== undefined;
                    isCorrect = chosen === q.correct;
                  }

                  let boxClass = "bg-slate-100 text-slate-600 border-slate-200 hover:border-blue-400";
                  if (!isSubmitted && isAnswered) {
                    boxClass = "bg-blue-600 text-white border-blue-600 font-bold";
                  } else if (isSubmitted) {
                    boxClass = isCorrect
                      ? "bg-emerald-500 text-white border-emerald-600 font-bold"
                      : "bg-rose-500 text-white border-rose-600 font-bold";
                  }

                  const targetAnchor = q.type === "CLOZE_BLANK" && !isSubmitted
                    ? `#esp-exam-q-${clozeQuestions[0].number}`
                    : `#esp-exam-q-${q.number}`;

                  return `
                    <a
                      id="esp-exam-cell-${q.number}"
                      href="${targetAnchor}"
                      title="${
                        q.type === 'TRANSLATION'
                          ? `Câu ${q.number}: Dịch thuật (${q.badge})`
                          : q.type === 'CLOZE_BLANK'
                          ? `Câu ${q.number}: ${q.badge} trong bài viết`
                          : `Câu ${q.number}: ${q.badge}`
                      }"
                      class="h-9 rounded-lg border text-xs font-mono flex items-center justify-center transition ${boxClass}"
                    >
                      ${q.number}${q.type === "TRANSLATION" ? "✍️" : ""}
                    </a>
                  `;
                }).join("")}
              </div>

              ${!isSubmitted ? `
                <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                  <i class="fa-solid fa-lock mr-1"></i> <strong>Chế độ Kiểm tra:</strong> Đáp án trắc nghiệm, 5 từ điền vào bài viết và 5 câu dịch chuẩn chỉ xuất hiện sau khi bạn bấm <strong>Nộp Bài</strong>.
                </div>

                <button
                  type="button"
                  onclick="App.submitEspUnitExam('${unit.id}')"
                  class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md transition flex items-center justify-center gap-2"
                >
                  <i class="fa-solid fa-paper-plane"></i> Nộp Bài & Xem Đáp Án + Giải Thích
                </button>
              ` : `
                <div class="space-y-2 pt-1">
                  <button
                    type="button"
                    onclick="App.newRandomEspUnitExam('${unit.id}')"
                    class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md transition flex items-center justify-center gap-2"
                  >
                    <i class="fa-solid fa-dice"></i> Tạo Đề Ngẫu Nhiên Mới
                  </button>
                  <button
                    type="button"
                    onclick="App.retakeSameEspUnitExam('${unit.id}')"
                    class="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    <i class="fa-solid fa-rotate-left mr-1"></i> Làm Lại Đề Này
                  </button>
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderExamMcqCardHtml(unitId, q, isSubmitted) {
    const chosen = this.state.espUnitExamChoices[q.id];
    const isAnswered = chosen !== undefined;
    const isCorrect = chosen === q.correct;

    let cardBorder = "border-slate-200 bg-slate-50/70";
    if (!isSubmitted && isAnswered) {
      cardBorder = "border-blue-300 bg-blue-50/20";
    } else if (isSubmitted) {
      cardBorder = isCorrect
        ? "border-emerald-500 bg-emerald-50/30"
        : "border-rose-400 bg-rose-50/30";
    }

    return `
      <div id="esp-exam-q-${q.number}" class="p-4 rounded-xl border-2 transition ${cardBorder} space-y-3">
        <div class="flex items-start justify-between gap-2">
          <p class="font-bold text-xs sm:text-sm text-slate-900 leading-relaxed">
            <span class="inline-flex items-center justify-center px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-xs mr-1.5">
              Câu ${q.number}
            </span>
            ${q.q}
          </p>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200/80 text-slate-700 shrink-0">
            ${q.badge}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${q.options.map((opt, optIdx) => {
            let btnStyle = "bg-white border-slate-200 text-slate-700 hover:border-blue-400";
            if (!isSubmitted) {
              if (chosen === optIdx) {
                btnStyle = "bg-blue-600 text-white border-blue-600 font-bold shadow-sm";
              }
            } else {
              if (optIdx === q.correct) {
                btnStyle = "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold";
              } else if (optIdx === chosen && chosen !== q.correct) {
                btnStyle = "bg-rose-100 border-rose-500 text-rose-900 font-semibold line-through";
              } else {
                btnStyle = "bg-white/60 border-slate-200 text-slate-400";
              }
            }

            return `
              <button
                type="button"
                onclick="App.selectEspUnitExamChoice('${unitId}', '${q.id}', ${optIdx})"
                ${isSubmitted ? "disabled" : ""}
                class="text-left px-4 py-2.5 rounded-xl border text-xs transition ${btnStyle} ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}"
              >
                ${opt}
              </button>
            `;
          }).join("")}
        </div>

        ${isSubmitted ? `
          <div class="p-3.5 rounded-xl bg-white border ${isCorrect ? 'border-emerald-300' : 'border-rose-300'} text-xs space-y-1.5 shadow-sm">
            <span class="font-extrabold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'} block">
              ${isCorrect
                ? '✓ Bạn đã trả lời chính xác!'
                : isAnswered
                ? `✗ Bạn chọn chưa đúng — Đáp án đúng là: ${q.correctText}`
                : `⚠️ Bạn bỏ trống câu này — Đáp án đúng là: ${q.correctText}`}
            </span>
            <p class="text-slate-700 leading-relaxed">
              <strong class="text-indigo-700">Giải thích chi tiết:</strong> ${q.explanation}
            </p>
          </div>
        ` : ""}
      </div>
    `;
  }
});