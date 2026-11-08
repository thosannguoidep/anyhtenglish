Object.assign(window.App, {
  renderStep3Practice(unit) {
    const passage = this.getClozePassageData(unit);
    return `
      <div class="space-y-5">
        <div class="academic-card p-3 flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap gap-2">
            <button onclick="App.switchPracticeSubPart('part1')" class="px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${this.state.practiceSubPart === 'part1' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
              <i class="fa-solid fa-list-check"></i>
              <span>Part 1: Trắc Nghiệm (${(unit.mcqs || []).length} câu)</span>
            </button>
            <button onclick="App.switchPracticeSubPart('part2')" class="px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${this.state.practiceSubPart === 'part2' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
              <i class="fa-solid fa-file-lines"></i>
              <span>Part 2: Điền Từ Trong Bài Viết (${passage.title})</span>
            </button>
            <button onclick="App.switchPracticeSubPart('part3')" class="px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${this.state.practiceSubPart === 'part3' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
              <i class="fa-solid fa-link"></i>
              <span>Part 3: Nối Thuật Ngữ (${(unit.matching || []).length} câu)</span>
            </button>
          </div>
        </div>

        ${this.state.practiceSubPart === "part1" ? this.renderEspPart1(unit) : ""}
        ${this.state.practiceSubPart === "part2" ? this.renderEspPart2(unit) : ""}
        ${this.state.practiceSubPart === "part3" ? this.renderEspPart3(unit) : ""}
      </div>
    `;
  },

  // PART 1: TRẮC NGHIỆM
  renderEspPart1(unit) {
    return `
      <div class="space-y-4">
        ${(unit.mcqs || []).map(item => {
          const key = `${unit.id}-${item.id}`;
          const chosen = this.state.mcqAnswers[key];
          const isAnswered = chosen !== undefined;
          const isCorrect = chosen === item.correct;
          return `
            <div class="academic-card p-5 border-2 ${isAnswered ? (isCorrect ? 'border-emerald-500' : 'border-rose-400') : 'border-slate-200'} space-y-3">
              <p class="font-bold text-sm text-slate-900">${item.q}</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                ${item.options.map((opt, idx) => {
                  let btnClass = "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400";
                  if (isAnswered) {
                    if (idx === item.correct) btnClass = "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold";
                    else if (idx === chosen) btnClass = "bg-rose-50 border-rose-500 text-rose-800 font-semibold";
                  }
                  return `<button onclick="App.answerMcq('${unit.id}', ${item.id}, ${idx}, ${item.correct})" class="text-left px-4 py-3 rounded-xl border text-xs transition ${btnClass}">${opt}</button>`;
                }).join("")}
              </div>
              ${isAnswered ? `
                <div class="text-xs p-3.5 rounded-xl ${isCorrect ? 'bg-emerald-50/70 border border-emerald-200 text-emerald-950' : 'bg-rose-50/70 border border-rose-200 text-rose-950'} space-y-1">
                  <p class="font-extrabold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}">
                    ${isCorrect ? '✓ Giải thích đáp án đúng:' : '✗ Giải đáp lỗi sai (Bằng tiếng Việt):'}
                  </p>
                  <p class="leading-relaxed text-slate-700">${item.explanation}</p>
                </div>
              ` : ""}
            </div>
          `;
        }).join("")}
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
    this.render();
  },

  // PART 2: ĐIỀN TỪ TRONG BÀI VIẾT + NÚT "DỊCH VĂN BẢN" HIỂN THỊ BÊN CẠNH (SONG NGỮ 2 CỘT)
  toggleClozePassageTranslation(unitId) {
    if (!this.state.showClozeSideTranslation) this.state.showClozeSideTranslation = {};
    this.state.showClozeSideTranslation[unitId] = !this.state.showClozeSideTranslation[unitId];
    this.render();
  },

  renderSingleEnglishParagraphWithDropdowns(
    unitId,
    paragraphText,
    passageData,
    answersMap,
    onchangeFnName,
    isLocked = false,
    showResultColors = true,
    activeBlankIndices = null
  ) {
    const wordBank = passageData.wordBank || [];
    const blanks = passageData.blanks || [];

    const htmlParagraph = paragraphText.replace(/\{\{(\d+)\}\}/g, (_, numStr) => {
      const idx = Number(numStr);
      const blankObj = blanks.find(b => b.index === idx) || { index: idx, answer: "" };

      if (Array.isArray(activeBlankIndices) && !activeBlankIndices.includes(idx)) {
        return `<span class="font-semibold text-slate-800">${blankObj.answer}</span>`;
      }

      const displayNum = Array.isArray(activeBlankIndices)
        ? activeBlankIndices.indexOf(idx) + 1
        : idx;

      const val = answersMap[idx] || "";
      const isAnswered = Boolean(val);
      const isCorrect = isAnswered && val.toLowerCase() === blankObj.answer.toLowerCase();

      let selectStyle = "bg-amber-50/90 hover:bg-amber-100 text-slate-900 border-amber-400";
      let badgeStyle = "bg-slate-800 text-white";

      if (isAnswered) {
        if (!showResultColors) {
          selectStyle = "bg-blue-50 text-blue-900 border-blue-500 font-extrabold shadow-sm";
          badgeStyle = "bg-blue-600 text-white";
        } else if (isCorrect) {
          selectStyle = "bg-emerald-50 text-emerald-900 border-emerald-500 font-extrabold shadow-sm";
          badgeStyle = "bg-emerald-600 text-white";
        } else {
          selectStyle = "bg-rose-50 text-rose-900 border-rose-500 font-extrabold shadow-sm";
          badgeStyle = "bg-rose-600 text-white";
        }
      }

      return `
        <span class="inline-flex items-center gap-1 mx-1 my-0.5 align-baseline">
          <span class="px-1.5 py-0.5 rounded text-[11px] font-mono font-extrabold ${badgeStyle}">
            ${displayNum}
          </span>
          <select
            ${isLocked ? "disabled" : ""}
            onchange="${onchangeFnName}('${unitId}', ${idx}, this.value)"
            class="px-2.5 py-1 rounded-lg border-2 text-xs sm:text-sm font-bold transition focus:outline-none ${selectStyle} ${isLocked ? 'cursor-default' : 'cursor-pointer'}"
          >
            <option value="" class="bg-white text-slate-500">--- (${displayNum}) ---</option>
            ${wordBank.map(w => `
              <option value="${w}" class="bg-white text-slate-900 font-semibold" ${val.toLowerCase() === w.toLowerCase() ? "selected" : ""}>
                ${w}
              </option>
            `).join("")}
          </select>
        </span>
      `;
    });

    return `<p class="text-sm sm:text-[15px] text-slate-800 leading-8 text-justify">${htmlParagraph}</p>`;
  },

  renderClozePassageWithSideTranslation(
    unitId,
    passageData,
    answersMap,
    onchangeFnName,
    isLocked = false,
    showResultColors = true,
    showTranslation = false,
    activeBlankIndices = null
  ) {
    const paragraphs = passageData.paragraphs || [];
    const vnParagraphs = passageData.vnParagraphs || [];

    if (!showTranslation) {
      return `
        <div class="p-6 sm:p-8 rounded-2xl bg-white border-2 border-slate-200 shadow-inner space-y-4">
          <h3 class="text-center font-extrabold text-base sm:text-lg text-slate-900 underline decoration-indigo-500 decoration-2 underline-offset-4 pb-2">
            ${passageData.title}
          </h3>
          <div class="space-y-4">
            ${paragraphs.map(pText =>
              this.renderSingleEnglishParagraphWithDropdowns(
                unitId,
                pText,
                passageData,
                answersMap,
                onchangeFnName,
                isLocked,
                showResultColors,
                activeBlankIndices
              )
            ).join("")}
          </div>
        </div>
      `;
    }

    return `
      <div class="rounded-2xl bg-white border-2 border-indigo-200 shadow-md overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2 border-b border-indigo-100 bg-slate-50">
          <div class="px-6 py-3.5 flex items-center justify-between border-b lg:border-b-0 lg:border-r border-indigo-100">
            <span class="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span class="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-mono text-[11px]">EN</span>
              Văn bản Tiếng Anh — ${passageData.title}
            </span>
            <span class="text-[11px] text-slate-500 font-semibold">Điền từ trực tiếp</span>
          </div>
          <div class="px-6 py-3.5 flex items-center justify-between bg-emerald-50/50">
            <span class="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
              <span class="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-mono text-[11px]">VI</span>
              Bản dịch Tiếng Việt — ${passageData.title}
            </span>
            <span class="text-[11px] text-emerald-700 font-semibold">Dịch sát nghĩa từng đoạn</span>
          </div>
        </div>

        <div class="divide-y divide-slate-200">
          ${paragraphs.map((pText, pIdx) => {
            const vnText = typeof vnParagraphs[pIdx] === "string"
              ? vnParagraphs[pIdx]
              : (vnParagraphs[pIdx]?.text || "");
            return `
              <div class="grid grid-cols-1 lg:grid-cols-2">
                <div class="p-5 sm:p-6 lg:border-r border-slate-200 bg-white">
                  ${this.renderSingleEnglishParagraphWithDropdowns(
                    unitId,
                    pText,
                    passageData,
                    answersMap,
                    onchangeFnName,
                    isLocked,
                    showResultColors,
                    activeBlankIndices
                  )}
                </div>
                <div class="p-5 sm:p-6 bg-emerald-50/25 flex items-center">
                  <p class="text-sm sm:text-[15px] text-slate-800 leading-8 text-justify">
                    ${vnText}
                  </p>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  },

  renderEspPart2(unit) {
    const passage = this.getClozePassageData(unit);
    const blanks = passage.blanks || [];
    const wordBank = passage.wordBank || [];
    const showTranslation = Boolean((this.state.showClozeSideTranslation || {})[unit.id]);

    const currentAnswers = {};
    let correctCount = 0;
    let answeredCount = 0;

    blanks.forEach(b => {
      const val = this.state.clozeAnswers[`${unit.id}-cloze-${b.index}`] || "";
      currentAnswers[b.index] = val;
      if (val) {
        answeredCount++;
        if (val.toLowerCase() === b.answer.toLowerCase()) correctCount++;
      }
    });

    return `
      <div class="academic-card overflow-hidden">
        <div class="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span class="text-[11px] font-mono font-bold uppercase text-amber-400 block">
              PART 2: TEXT COMPLETION (ĐIỀN TỪ TRONG BÀI VIẾT)
            </span>
            <h4 class="font-extrabold text-base sm:text-lg text-white mt-0.5">
              Complete the text with the words in the box — ${passage.title}
            </h4>
          </div>
          <div class="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onclick="App.toggleClozePassageTranslation('${unit.id}')"
              class="px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 shadow-sm ${
                showTranslation
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-amber-400 hover:bg-amber-300 text-slate-950"
              }"
            >
              <i class="fa-solid fa-language text-sm"></i>
              <span>${showTranslation ? "Ẩn dịch văn bản" : "Dịch văn bản"}</span>
            </button>

            <span class="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-mono font-bold text-emerald-300">
              Đúng: ${correctCount} / ${blanks.length}
            </span>

            <button
              type="button"
              onclick="App.resetEspCloze('${unit.id}')"
              class="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-bold transition"
            >
              <i class="fa-solid fa-rotate-left mr-1"></i> Làm lại
            </button>
          </div>
        </div>

        <div class="p-6 space-y-6">
          <div class="p-4 rounded-2xl bg-slate-50 border-2 border-slate-300 space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                <i class="fa-solid fa-box-open text-indigo-600 mr-1"></i> Words in the box (Ngân hàng từ cho sẵn):
              </span>
              <span class="text-[11px] text-slate-500">Di chuột vào từ để xem nghĩa tiếng Việt</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              ${wordBank.map(w => {
                const isUsedCorrectly = blanks.some(b => {
                  const chosen = currentAnswers[b.index] || "";
                  return chosen.toLowerCase() === w.toLowerCase() && b.answer.toLowerCase() === w.toLowerCase();
                });
                const info = this.getVietnameseInfoForTerm(unit, w);
                return `
                  <div
                    title="Nghĩa: ${info.vnTerm}"
                    class="px-3 py-2 rounded-xl font-mono text-xs font-bold border text-center transition ${
                      isUsedCorrectly
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 line-through opacity-60"
                        : "bg-white text-slate-800 border-slate-300 shadow-sm hover:border-indigo-400"
                    }"
                  >
                    ${w} ${isUsedCorrectly ? "✓" : ""}
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          ${this.renderClozePassageWithSideTranslation(
            unit.id,
            passage,
            currentAnswers,
            "App.selectCloze",
            false,
            true,
            showTranslation,
            null
          )}

          ${answeredCount > 0 ? `
            <div class="space-y-3 pt-2 border-t border-slate-200">
              <h5 class="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                <i class="fa-solid fa-lightbulb mr-1"></i> Giải đáp & Dịch nghĩa Tiếng Việt cho các chỗ trống bạn đã chọn:
              </h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${blanks.map(b => {
                  const val = currentAnswers[b.index];
                  if (!val) return "";
                  const isCorrect = val.toLowerCase() === b.answer.toLowerCase();
                  const chosenInfo = this.getVietnameseInfoForTerm(unit, val);

                  return `
                    <div class="p-3.5 rounded-xl border-2 text-xs space-y-1 ${
                      isCorrect ? "bg-emerald-50/50 border-emerald-400" : "bg-rose-50/50 border-rose-400"
                    }">
                      <div class="flex items-center justify-between">
                        <span class="font-extrabold ${isCorrect ? "text-emerald-800" : "text-rose-800"}">
                          Vị trí (${b.index}): ${isCorrect ? `✓ Chính xác (${b.answer})` : `✗ Bạn chọn "${val}" chưa đúng`}
                        </span>
                        <span class="font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                          isCorrect ? "bg-emerald-200/70 text-emerald-900" : "bg-rose-200/70 text-rose-900"
                        }">
                          Đáp án: ${b.answer}
                        </span>
                      </div>
                      ${!isCorrect ? `
                        <p class="text-rose-700">
                          • Từ <strong>"${val}"</strong> nghĩa là <em>"${chosenInfo.vnTerm}"</em>, chưa phù hợp ở vị trí số (${b.index}).
                        </p>
                      ` : ""}
                      <p class="text-slate-700 leading-relaxed">
                        • <strong>Giải thích:</strong> Cần điền <strong>"${b.answer}"</strong> (<em>${b.vnMeaning}</em>) — ${b.explain}
                      </p>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          ` : ""}
        </div>
      </div>
    `;
  },

  selectCloze(unitId, index, value) {
    this.state.clozeAnswers[`${unitId}-cloze-${index}`] = value;
    const unit = this.getUnitById(unitId);
    const passage = this.getClozePassageData(unit);
    const blank = (passage.blanks || []).find(b => b.index === index);
    if (blank && value) {
      if (value.toLowerCase() === blank.answer.toLowerCase()) {
        window.AudioEngine.playTone("success");
      } else {
        window.AudioEngine.playTone("error");
      }
    }
    this.updateSidebarStats();
    this.render();
  },

  resetEspCloze(unitId) {
    const unit = this.getUnitById(unitId);
    const passage = this.getClozePassageData(unit);
    (passage.blanks || []).forEach(b => {
      delete this.state.clozeAnswers[`${unitId}-cloze-${b.index}`];
    });
    this.render();
    this.toast("🔄 Đã làm mới toàn bộ 10 chỗ trống trong bài viết!", "info");
  },

  // PART 3: NỐI THUẬT NGỮ 2 CỘT
  renderEspPart3(unit) {
    const matchingList = unit.matching || [];
    if (!matchingList.length) {
      return `<div class="academic-card p-6 text-center text-xs text-slate-500">Chưa có dữ liệu bài tập nối từ.</div>`;
    }

    const termsColumn = matchingList.map((m, idx) => {
      const cleanTerm = String(m.term || "").replace(/^\d+\.\s*/, "").trim();
      const rawDef = String(m.definition || "");
      const extractedLetter = (m.correctLetter || rawDef.match(/^([A-Z])\./i)?.[1] || "").toUpperCase();
      const cleanDef = rawDef.replace(/^[A-Z]\.\s*/i, "").trim();

      return {
        id: m.id,
        number: idx + 1,
        cleanTerm,
        correctLetter: extractedLetter,
        cleanDef
      };
    });

    const definitionsColumn = [...termsColumn]
      .map(item => ({
        letter: item.correctLetter,
        cleanDef: item.cleanDef,
        cleanTerm: item.cleanTerm,
        targetTermId: item.id,
        targetNumber: item.number
      }))
      .sort((a, b) => a.letter.localeCompare(b.letter));

    const allLetters = definitionsColumn.map(d => d.letter);

    let correctCount = 0;
    termsColumn.forEach(t => {
      const chosen = this.state.matchingAnswers[`${unit.id}-match-${t.id}`];
      if (chosen === t.correctLetter) correctCount++;
    });

    let activeTermId = this.state.activeMatchingTermId;
    const isActiveValid = termsColumn.some(t => t.id === activeTermId);
    if (!isActiveValid) {
      const firstUnfinished = termsColumn.find(
        t => this.state.matchingAnswers[`${unit.id}-match-${t.id}`] !== t.correctLetter
      );
      activeTermId = firstUnfinished ? firstUnfinished.id : termsColumn[0].id;
    }

    const activeTermObj = termsColumn.find(t => t.id === activeTermId);
    const percentDone = Math.round((correctCount / termsColumn.length) * 100);

    return `
      <div class="space-y-5">
        <div class="academic-card overflow-hidden">
          <div class="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono font-extrabold text-[11px] uppercase">
                  PART 3: NỐI THUẬT NGỮ 2 CỘT
                </span>
                <span class="px-2.5 py-0.5 rounded-md bg-white/10 text-cyan-300 font-mono text-xs font-semibold">
                  Đã nối đúng: ${correctCount} / ${termsColumn.length} (${percentDone}%)
                </span>
              </div>
              <h4 class="text-base sm:text-lg font-extrabold text-white">
                Nối Thuật Ngữ Chuyên Ngành (Cột A) Với Định Nghĩa Tương Ứng (Cột B)
              </h4>
              <p class="text-xs text-slate-300">
                💡 <strong>Hướng dẫn:</strong> Nhấp chọn 1 thuật ngữ ở <strong>Cột A</strong> rồi nhấp vào định nghĩa ở <strong>Cột B</strong>. Nếu chọn sai, hệ thống sẽ <strong>giải thích chi tiết bằng tiếng Việt</strong>.
              </p>
            </div>

            <div class="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onclick="App.resetEspMatching('${unit.id}')"
                class="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-bold transition whitespace-nowrap"
              >
                <i class="fa-solid fa-rotate-left mr-1"></i> Làm lại từ đầu
              </button>
            </div>
          </div>

          <div class="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2 text-xs">
              <span class="font-bold text-slate-700">Đang chọn để nối:</span>
              ${activeTermObj ? `
                <span class="px-3 py-1 rounded-lg bg-blue-600 text-white font-extrabold text-xs shadow-sm">
                  Câu ${activeTermObj.number}. ${activeTermObj.cleanTerm}
                </span>
                <span class="text-slate-500 hidden sm:inline">→ Hãy nhấp vào định nghĩa A–J phù hợp bên Cột B!</span>
              ` : ""}
            </div>
            <div class="w-full sm:w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500 transition-all duration-300" style="width: ${percentDone}%"></div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div class="lg:col-span-6 space-y-3">
            <div class="flex items-center justify-between px-1">
              <h5 class="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span class="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-mono text-[11px]">A</span>
                Cột A — Thuật ngữ chuyên ngành (1 – ${termsColumn.length})
              </h5>
              <span class="text-[11px] text-slate-500">Nhấp vào thẻ để chọn nối</span>
            </div>

            <div class="space-y-2.5">
              ${termsColumn.map(item => {
                const key = `${unit.id}-match-${item.id}`;
                const val = this.state.matchingAnswers[key] || "";
                const isCorrect = val === item.correctLetter;
                const isSelectedForClick = activeTermId === item.id;
                const vnGuide = this.getVietnameseInfoForTerm(unit, item.cleanTerm);

                let cardStyle = "bg-white border-slate-200 hover:border-blue-300";
                let numBadgeStyle = "bg-slate-100 text-slate-700";

                if (val) {
                  if (isCorrect) {
                    cardStyle = "bg-emerald-50/50 border-emerald-500 shadow-sm";
                    numBadgeStyle = "bg-emerald-600 text-white";
                  } else {
                    cardStyle = "bg-rose-50/50 border-rose-400";
                    numBadgeStyle = "bg-rose-600 text-white";
                  }
                }
                if (isSelectedForClick) {
                  cardStyle += " ring-2 ring-blue-600 ring-offset-1 border-blue-500";
                }

                return `
                  <div
                    onclick="App.selectMatchingTermForClick(${item.id})"
                    class="academic-card p-3.5 border-2 transition cursor-pointer ${cardStyle}"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex items-start gap-3 min-w-0 flex-1">
                        <span class="w-8 h-8 rounded-xl font-mono font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 ${numBadgeStyle}">
                          ${item.number}
                        </span>
                        <div class="min-w-0 flex-1">
                          <div class="flex items-center gap-2">
                            <span class="font-extrabold text-sm text-slate-900 truncate">${item.cleanTerm}</span>
                            <button
                              type="button"
                              onclick="event.stopPropagation(); AudioEngine.speak('${item.cleanTerm.replace(/'/g, "\\'")}', 1.0)"
                              class="w-6 h-6 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-500 text-[11px] flex items-center justify-center transition shrink-0"
                              title="Nghe phát âm"
                            >
                              <i class="fa-solid fa-volume-high"></i>
                            </button>
                          </div>

                          ${val ? (
                            isCorrect ? `
                              <div class="mt-2 p-3 rounded-xl bg-emerald-100/70 border border-emerald-300 text-xs text-emerald-950 space-y-1">
                                <p class="font-extrabold text-emerald-800">
                                  ✓ Chính xác [${item.correctLetter}] — Nghĩa tiếng Việt: ${vnGuide.vnTerm}
                                </p>
                                <p class="text-emerald-900 leading-relaxed">
                                  <strong>Dịch nghĩa câu [${item.correctLetter}]:</strong> ${vnGuide.vnDef}
                                </p>
                              </div>
                            ` : this.buildMatchingErrorExplanation(unit, item, val, termsColumn)
                          ) : `
                            <p class="text-[11px] ${isSelectedForClick ? "text-blue-600 font-bold" : "text-slate-400"} mt-0.5">
                              ${isSelectedForClick ? "● Đang chọn — Nhấp vào định nghĩa A–J bên phải" : "Chưa nối đáp án"}
                            </p>
                          `}
                        </div>
                      </div>

                      <div class="flex items-center gap-1.5 shrink-0" onclick="event.stopPropagation()">
                        <select
                          onchange="App.selectMatching('${unit.id}', ${item.id}, this.value)"
                          class="px-3 py-2 rounded-xl border text-xs font-mono font-extrabold transition focus:outline-none cursor-pointer ${
                            val
                              ? isCorrect
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                : "bg-rose-600 text-white border-rose-600 shadow-sm"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300"
                          }"
                        >
                          <option value="" class="bg-white text-slate-700">Chọn</option>
                          ${allLetters.map(l => `<option value="${l}" class="bg-white text-slate-900 font-bold" ${val === l ? "selected" : ""}>${l}</option>`).join("")}
                        </select>
                      </div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <div class="lg:col-span-6 space-y-3 lg:sticky lg:top-20">
            <div class="flex items-center justify-between px-1">
              <h5 class="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span class="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-mono text-[11px]">B</span>
                Cột B — Định nghĩa Tiếng Anh (A – ${allLetters[allLetters.length - 1] || "J"})
              </h5>
              <span class="text-[11px] text-indigo-600 font-semibold">Nhấp vào định nghĩa để gán cho Câu ${activeTermObj ? activeTermObj.number : ""}</span>
            </div>

            <div class="space-y-2.5">
              ${definitionsColumn.map(def => {
                const matchedCorrectTerm = termsColumn.find(
                  t => t.correctLetter === def.letter && this.state.matchingAnswers[`${unit.id}-match-${t.id}`] === def.letter
                );
                const isAssignedToActive =
                  activeTermObj && this.state.matchingAnswers[`${unit.id}-match-${activeTermObj.id}`] === def.letter;
                const defVnInfo = this.getVietnameseInfoForTerm(unit, def.cleanTerm);

                let defCardStyle = "bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30";
                let letterBadgeStyle = "bg-indigo-50 text-indigo-700 border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white";

                if (matchedCorrectTerm) {
                  defCardStyle = "bg-emerald-50/40 border-emerald-300 opacity-80";
                  letterBadgeStyle = "bg-emerald-600 text-white";
                } else if (isAssignedToActive) {
                  defCardStyle = "bg-rose-50/40 border-rose-400";
                  letterBadgeStyle = "bg-rose-600 text-white";
                }

                return `
                  <button
                    type="button"
                    onclick="App.clickDefinitionToMatch('${unit.id}', ${activeTermId}, '${def.letter}')"
                    class="w-full academic-card p-3.5 border-2 text-left transition flex items-start justify-between gap-3 group cursor-pointer ${defCardStyle}"
                  >
                    <div class="flex items-start gap-3 min-w-0">
                      <span class="w-8 h-8 rounded-xl font-mono font-extrabold text-xs flex items-center justify-center shrink-0 transition ${letterBadgeStyle}">
                        ${def.letter}
                      </span>
                      <div class="space-y-1 min-w-0">
                        <p class="text-xs sm:text-[13px] font-medium text-slate-800 leading-relaxed">
                          ${def.cleanDef}
                        </p>
                        ${matchedCorrectTerm ? `
                          <div class="pt-1 space-y-0.5">
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                              <i class="fa-solid fa-check"></i> Đã khớp Câu ${matchedCorrectTerm.number}: ${matchedCorrectTerm.cleanTerm} (${defVnInfo.vnTerm})
                            </span>
                            <p class="text-[11px] text-emerald-700 italic">Dịch: ${defVnInfo.vnDef}</p>
                          </div>
                        ` : ""}
                      </div>
                    </div>

                    <span class="text-[11px] font-mono font-bold text-slate-400 group-hover:text-indigo-600 shrink-0 self-center">
                      ${matchedCorrectTerm ? "✓" : `Gán → #${activeTermObj ? activeTermObj.number : ""}`}
                    </span>
                  </button>
                `;
              }).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  selectMatchingTermForClick(termId) {
    this.state.activeMatchingTermId = termId;
    this.render();
  },

  clickDefinitionToMatch(unitId, termId, letter) {
    if (!termId) return;
    this.selectMatching(unitId, termId, letter);
  },

  selectMatching(unitId, id, letter) {
    this.state.matchingAnswers[`${unitId}-match-${id}`] = letter;
    const unit = this.getUnitById(unitId);
    const item = (unit?.matching || []).find(m => m.id === id);

    if (item && letter) {
      const expected = (item.correctLetter || String(item.definition || "").match(/^([A-Z])\./i)?.[1] || "").toUpperCase();
      if (letter === expected) {
        window.AudioEngine.playTone("success");
        this.state.user.xp += 5;
        const nextUnfinished = (unit.matching || []).find(m => {
          const mExpected = (m.correctLetter || String(m.definition || "").match(/^([A-Z])\./i)?.[1] || "").toUpperCase();
          return this.state.matchingAnswers[`${unitId}-match-${m.id}`] !== mExpected;
        });
        if (nextUnfinished) {
          this.state.activeMatchingTermId = nextUnfinished.id;
        }
      } else {
        window.AudioEngine.playTone("error");
        this.state.activeMatchingTermId = id;
      }
    }
    this.updateSidebarStats();
    this.render();
  },

  resetEspMatching(unitId) {
    const unit = this.getUnitById(unitId);
    (unit?.matching || []).forEach(m => {
      delete this.state.matchingAnswers[`${unitId}-match-${m.id}`];
    });
    this.state.activeMatchingTermId = null;
    this.render();
    this.toast("🔄 Đã đặt lại toàn bộ bài tập Nối thuật ngữ!", "info");
  },

// BƯỚC 4: DỊCH HỌC THUẬT — HIỂN THỊ ĐẦY ĐỦ CÁC CÂU TRONG SÁCH GIÁO TRÌNH (PHẦN I: ANH -> VIỆT | PHẦN II: VIỆT -> ANH)
  renderStep4Production(unit) {
    const { enToVi, viToEn } = this.getCategorizedTranslations(unit);

    return `
      <div class="space-y-6">
        <div class="academic-card p-6 space-y-4">
          <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <span class="text-[11px] font-mono font-bold uppercase text-blue-600 block">
                PART 4 — I. TRANSLATE THE FOLLOWING SENTENCES INTO VIETNAMESE (${enToVi.length} CÂU)
              </span>
              <h4 class="font-extrabold text-sm sm:text-base text-slate-900">
                Phần I: Dịch các câu tiếng Anh chuyên ngành sau sang nghĩa Tiếng Việt
              </h4>
            </div>
            <span class="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-mono text-xs font-bold shrink-0">
              Anh &rarr; Việt (${enToVi.length} câu)
            </span>
          </div>

          <div class="space-y-4">
            ${enToVi.map((item, idx) => this.renderSinglePracticeTranslationCard(unit, item, idx + 1, "EN_TO_VI")).join("")}
          </div>
        </div>

        <div class="academic-card p-6 space-y-4">
          <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <span class="text-[11px] font-mono font-bold uppercase text-emerald-600 block">
                PART 4 — II. TRANSLATE THE FOLLOWING SENTENCES INTO ENGLISH (${viToEn.length} CÂU)
              </span>
              <h4 class="font-extrabold text-sm sm:text-base text-slate-900">
                Phần II: Dịch các câu tiếng Việt sau sang Tiếng Anh
              </h4>
            </div>
            <span class="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-mono text-xs font-bold shrink-0">
              Việt &rarr; Anh (${viToEn.length} câu)
            </span>
          </div>

          <div class="space-y-4">
            ${viToEn.map((item, idx) => this.renderSinglePracticeTranslationCard(unit, item, idx + 1, "VI_TO_EN")).join("")}
          </div>
        </div>
      </div>
    `;
  },

  renderSinglePracticeTranslationCard(unit, item, displayNum, direction) {
    const res = this.state.translationResults[item.id];
    const isEnToVi = direction === "EN_TO_VI";

    return `
      <div class="p-5 rounded-xl bg-slate-50 border-2 ${res ? (res.score >= 60 ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20') : 'border-slate-200'} space-y-3">
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-extrabold ${
              isEnToVi ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
            }">
              Câu ${displayNum} • ${isEnToVi ? "Dịch sang Tiếng Việt (Anh → Việt)" : "Dịch sang Tiếng Anh (Việt → Anh)"}
            </span>
            <p class="font-bold text-sm text-slate-900 leading-relaxed pt-1">${item.source}</p>
          </div>
          ${isEnToVi ? `
            <button
              type="button"
              onclick="AudioEngine.speak('${item.source.replace(/'/g, "\\'")}', 1.0)"
              class="px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-600 hover:text-white text-slate-600 border border-slate-200 text-xs shrink-0 transition"
              title="Nghe câu tiếng Anh"
            >
              <i class="fa-solid fa-volume-high"></i>
            </button>
          ` : ""}
        </div>

        <textarea
          id="trans-input-${item.id}"
          rows="2"
          class="w-full p-3.5 rounded-xl bg-white border border-slate-300 focus:border-blue-600 focus:outline-none text-xs sm:text-sm text-slate-900"
          placeholder="${isEnToVi ? 'Nhập bản dịch nghĩa Tiếng Việt của bạn...' : 'Nhập câu dịch Tiếng Anh của bạn...'}"
        >${res ? res.userText : ""}</textarea>

        <div class="flex items-center justify-between gap-2">
          <button
            type="button"
            onclick="App.gradeTranslation('${unit.id}', '${item.id}')"
            class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
          >
            <i class="fa-solid fa-check mr-1"></i> Chấm Điểm Từ Khóa
          </button>
          ${res ? `
            <span class="text-xs font-mono font-extrabold ${res.score >= 60 ? 'text-emerald-700' : 'text-rose-600'}">
              Độ khớp từ khóa: ${res.score}%
            </span>
          ` : ""}
        </div>

        ${res ? `
          <div class="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
            <p class="font-bold text-indigo-700">
              ✓ ${isEnToVi ? "Bản dịch nghĩa Tiếng Việt chuẩn:" : "Câu dịch Tiếng Anh chuẩn:"}
            </p>
            <p class="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-slate-900 font-semibold leading-relaxed">
              "${item.modelAnswer}"
            </p>
            <div class="flex flex-wrap gap-1.5 pt-1">
              ${(item.keywords || []).map(kw => {
                const hit = (res.userText || "").toLowerCase().includes(kw.toLowerCase());
                return `
                  <span class="px-2 py-0.5 rounded font-mono text-[11px] font-bold border ${
                    hit ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-rose-50 text-rose-700 border-rose-300"
                  }">
                    ${hit ? "✓" : "✗"} ${kw}
                  </span>
                `;
              }).join("")}
            </div>
          </div>
        ` : ""}
      </div>
    `;
  },

  gradeTranslation(unitId, itemId) {
    const unit = this.getUnitById(unitId) || this.getCurrentUnitData();
    const { all } = this.getCategorizedTranslations(unit);
    const item = all.find(t => t.id === itemId);
    const textarea = document.getElementById(`trans-input-${itemId}`);
    if (!item || !textarea) return;

    const userText = textarea.value.trim();
    const lower = userText.toLowerCase();
    const matched = (item.keywords || []).filter(k => lower.includes(k.toLowerCase()));
    const score = item.keywords?.length
      ? Math.round((matched.length / item.keywords.length) * 100)
      : (userText ? 100 : 0);

    this.state.translationResults[itemId] = { userText, score };
    if (score >= 60) window.AudioEngine.playTone("success");
    else window.AudioEngine.playTone("error");
    this.render();
  }
});