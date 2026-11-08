Object.assign(window.App, {
  shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  },

  normalizeAnswer(str) {
    return String(str || "").trim().toLowerCase().replace(/\s+/g, " ");
  },

  getTargetCleanWord(rawWord) {
    return rawWord.replace(/\s*\([^)]*\)/g, "").trim();
  },

  getVocabSourceByUnitId(unitId) {
    const unit = this.getUnitById(unitId);
    return unit ? unit.vocabulary : [];
  },

  ensureShuffledOrder(unitId, forceReshuffle = false) {
    const unit = this.getUnitById(unitId);
    if (!unit || !unit.vocabulary || unit.vocabulary.length === 0) return [];
    if (!this.state.typingShuffledOrder[unitId] || forceReshuffle) {
      const indices = unit.vocabulary.map((_, idx) => idx);
      this.state.typingShuffledOrder[unitId] = this.shuffleArray(indices);
    }
    return this.state.typingShuffledOrder[unitId];
  },

  getWordMasteryStatus(unitId, item) {
    const key = `${unitId}-type-${item.id}`;
    if (!this.state.typingChecked[key]) return "UNSEEN";
    const val = this.state.typingInputs[key] || "";
    const clean = this.getTargetCleanWord(item.word);
    const isOk =
      this.normalizeAnswer(val) === this.normalizeAnswer(clean) ||
      this.normalizeAnswer(val) === this.normalizeAnswer(item.word);
    return isOk ? "MASTERED" : "LEARNING";
  },

  restartUnitTyping(unitId) {
    const unit = this.getUnitById(unitId);
    if (!unit || !unit.vocabulary.length) return;

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

    this.updateSidebarStats();
    this.render();
    this.toast("🔄 Đã trộn ngẫu nhiên bộ từ vựng và bắt đầu lại từ đầu!", "info");
  },

  retryIncorrectTypingOnly(unitId) {
    const unit = this.getUnitById(unitId);
    if (!unit || !unit.vocabulary.length) return;

    const wrongIndices = [];
    unit.vocabulary.forEach((item, idx) => {
      if (this.getWordMasteryStatus(unitId, item) !== "MASTERED") {
        wrongIndices.push(idx);
        const key = `${unitId}-type-${item.id}`;
        delete this.state.typingInputs[key];
        delete this.state.typingChecked[key];
      }
    });

    if (wrongIndices.length === 0) {
      this.toast("🎉 Bạn đã gõ đúng 100% các từ! Hệ thống sẽ trộn lại toàn bộ.", "success");
      this.restartUnitTyping(unitId);
      return;
    }

    this.state.typingShuffledOrder[unitId] = this.shuffleArray(wrongIndices);
    this.state.typingCursor = 0;
    this.state.typingFinished[unitId] = false;

    const firstItem = unit.vocabulary[this.state.typingShuffledOrder[unitId][0]];
    if (firstItem) {
      this.state.typingFocusedKey = `${unitId}-type-${firstItem.id}`;
    }

    this.render();
    this.toast(`🎯 Đang luyện lại ${wrongIndices.length} từ chưa thuộc!`, "info");
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
    const list = this.getVocabSourceByUnitId(unitId);
    const item = list.find(v => v.id === itemId);
    if (!item) return;
    const isChecked = Boolean(this.state.typingChecked[key]);
    const slotsContainer = document.getElementById(`slots-${key}`);
    if (slotsContainer) {
      slotsContainer.innerHTML = this.renderCharacterSlots(item.word, this.state.typingInputs[key] || "", true, isChecked);
    }
  },

  onInputBlur(unitId, itemId) {
    const key = `${unitId}-type-${itemId}`;
    if (this.state.typingFocusedKey === key) this.state.typingFocusedKey = null;
    const list = this.getVocabSourceByUnitId(unitId);
    const item = list.find(v => v.id === itemId);
    if (!item) return;
    const isChecked = Boolean(this.state.typingChecked[key]);
    const slotsContainer = document.getElementById(`slots-${key}`);
    if (slotsContainer) {
      slotsContainer.innerHTML = this.renderCharacterSlots(item.word, this.state.typingInputs[key] || "", false, isChecked);
    }
  },

  renderCharacterSlots(targetWord, typedValue, isFocused = false, isChecked = false) {
    const cleanTarget = this.getTargetCleanWord(targetWord);
    const chars = cleanTarget.split("");
    const typedChars = String(typedValue || "").split("");
    const activeIndex = typedChars.length;

    return `
      <div class="flex flex-wrap items-center gap-1.5 mt-4 select-none cursor-text">
        ${chars.map((ch, idx) => {
          if (ch === " ") return `<span class="w-4 h-10 inline-flex items-center justify-center text-slate-300 font-mono text-xs">␣</span>`;
          const userCh = typedChars[idx];
          const isCurrentBox = isFocused && idx === activeIndex && !isChecked;
          let boxStyle = "border-slate-300 bg-slate-50 text-slate-400";
          let displayContent = "";

          if (userCh !== undefined) {
            displayContent = userCh;
            if (isChecked) {
              boxStyle = userCh.toLowerCase() === ch.toLowerCase()
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold"
                : "border-rose-500 bg-rose-50 text-rose-600 font-bold";
            } else {
              boxStyle = "border-slate-400 bg-white text-slate-900 font-bold";
            }
          } else if (isChecked) {
            boxStyle = "border-rose-300 bg-rose-50/50 text-rose-400";
            displayContent = "_";
          } else if (isCurrentBox) {
            boxStyle = "border-blue-600 bg-blue-50/60 text-blue-600 ring-2 ring-blue-500/20 char-slot-focus";
            displayContent = `<span class="animate-pulse font-normal text-blue-600">|</span>`;
          }

          return `<span class="char-slot w-8 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-mono ${boxStyle}">${displayContent}</span>`;
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
      <div id="card-${key}" class="academic-card p-5 sm:p-6 border-2 ${isChecked ? (isCorrect ? 'border-emerald-500' : 'border-rose-500') : 'border-slate-200'} transition-all">
        <div class="bg-slate-100/90 px-5 py-3.5 rounded-xl border-b-2 border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-600 text-white whitespace-nowrap">
                Từ ${displayIndex + 1} / ${totalCount}
              </span>
              <span class="text-xs font-semibold text-slate-500">
                ${item.group || "Thuật ngữ"} ${item.ipa ? `• <span class="font-mono text-slate-700">${item.ipa}</span>` : ""}
              </span>
            </div>
            <h4 class="text-lg font-extrabold text-slate-900">${item.meaning}</h4>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button type="button" onclick="AudioEngine.speak('${cleanTarget.replace(/'/g, "\\'")}', 1.0)" class="px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-blue-600 border border-slate-300 text-xs font-bold shadow-sm whitespace-nowrap">
              <i class="fa-solid fa-volume-high mr-1"></i> Nghe mẫu
            </button>
            <button type="button" onclick="App.toggleTypingHint('${key}')" class="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-50 text-amber-700 border border-slate-300 text-xs font-bold shadow-sm whitespace-nowrap">
              <i class="fa-regular fa-lightbulb mr-1"></i> Gợi ý
            </button>
          </div>
        </div>

        ${showHint ? `
          <div class="mt-3 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <span>💡 Gợi ý (${cleanTarget.length} ký tự, bắt đầu bằng chữ <strong>"${cleanTarget[0]}"</strong>): <code class="font-mono font-bold">${cleanTarget[0]}${cleanTarget.slice(1).replace(/[a-zA-Z]/g, "_")}</code></span>
          </div>
        ` : ""}

        <label for="input-${key}" onclick="App.focusTypingInput('${key}')" class="block mt-4 cursor-text">
          <input
            id="input-${key}"
            type="text"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            placeholder="Văn bản câu trả lời ngắn..."
            value="${typedVal.replace(/"/g, "&quot;")}"
            onfocus="App.onInputFocus('${unit.id}', ${item.id})"
            onblur="App.onInputBlur('${unit.id}', ${item.id})"
            oninput="App.onTypingInput('${unit.id}', ${item.id}, this.value)"
            onkeydown="if(event.key === 'Enter') { event.preventDefault(); App.handleTypingEnter('${unit.id}', ${item.id}); }"
            style="pointer-events: auto !important; user-select: text !important;"
            class="w-full px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white border-b-2 border-slate-300 focus:border-blue-600 text-base font-semibold text-slate-900 placeholder-slate-400 focus:outline-none transition"
          />
          <div id="slots-${key}">${this.renderCharacterSlots(item.word, typedVal, isFocused, isChecked)}</div>
        </label>

        <div class="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div class="text-xs" id="feedback-${key}">
            ${isChecked ? (
              isCorrect
                ? `<span class="font-bold text-emerald-600"><i class="fa-solid fa-circle-check mr-1"></i> Chính xác! (${item.word}) — Ấn <strong>Enter</strong> lần nữa để sang từ tiếp</span>`
                : `<span class="font-bold text-rose-600"><i class="fa-solid fa-circle-xmark mr-1"></i> Chưa khớp. Đáp án đúng: <strong class="underline font-mono">${cleanTarget}</strong></span>`
            ) : `<span class="text-slate-500"><i class="fa-regular fa-keyboard mr-1 text-blue-600"></i> Gõ xong từ rồi bấm <strong>Kiểm tra</strong> (hoặc ấn <strong>Enter</strong>) để hiện màu</span>`}
          </div>

          <div class="flex items-center gap-2">
            ${typedVal ? `
              <button type="button" onclick="App.clearTypingItem('${unit.id}', ${item.id})" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold">
                Xóa
              </button>
            ` : ""}
            <button type="button" onclick="App.checkTypingItem('${unit.id}', ${item.id})" class="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm">
              Kiểm tra
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderTypingCompletionScreen(unit, correctCount, wrongCount, total) {
    const percent = total ? Math.round((correctCount / total) * 100) : 0;
    return `
      <div class="academic-card p-8 max-w-2xl mx-auto space-y-5 text-center border-2 border-blue-200">
        <div class="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-black mx-auto shadow-md">
          ${percent}%
        </div>
        <h3 class="text-lg font-extrabold text-slate-900">Hoàn thành phần luyện gõ (${correctCount}/${total} từ đúng)</h3>
        <div class="flex flex-wrap items-center justify-center gap-2">
          ${wrongCount > 0 ? `
            <button type="button" onclick="App.retryIncorrectTypingOnly('${unit.id}')" class="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold">
              <i class="fa-solid fa-bullseye mr-1"></i> Chỉ luyện lại ${wrongCount} từ sai
            </button>
          ` : ""}
          <button type="button" onclick="App.restartUnitTyping('${unit.id}')" class="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold">
            <i class="fa-solid fa-rotate-left mr-1"></i> Làm lại từ đầu (Trộn ngẫu nhiên mới)
          </button>
        </div>
      </div>
    `;
  },

  renderStep2Typing(unit) {
    const vocabList = unit.vocabulary || [];
    if (!vocabList.length) return `<div class="academic-card p-8 text-center text-xs text-slate-500">Chưa có từ vựng.</div>`;
    const shuffledOrder = this.ensureShuffledOrder(unit.id);
    const total = shuffledOrder.length;

    let correctCount = 0;
    let wrongCount = 0;
    shuffledOrder.forEach(vocabIdx => {
      const item = vocabList[vocabIdx];
      const key = `${unit.id}-type-${item.id}`;
      if (this.state.typingChecked[key]) {
        const val = this.state.typingInputs[key] || "";
        const clean = this.getTargetCleanWord(item.word);
        if (this.normalizeAnswer(val) === this.normalizeAnswer(clean) || this.normalizeAnswer(val) === this.normalizeAnswer(item.word)) correctCount++;
        else wrongCount++;
      }
    });

    if (this.state.typingFinished[unit.id]) {
      return this.renderTypingCompletionScreen(unit, correctCount, total - correctCount, total);
    }

    const currentPos = this.state.typingCursor % total;
    const currentItem = vocabList[shuffledOrder[currentPos]];
    const isLastCard = currentPos === total - 1;

    return `
      <div class="space-y-4">
        <div class="academic-card p-3.5 flex flex-wrap items-center justify-between gap-2">
          <div class="text-xs">
            <span class="font-bold text-slate-800">${unit.title}:</span>
            <span class="text-emerald-600 font-bold ml-2">Đúng ${correctCount}</span> •
            <span class="text-rose-600 font-bold">Sai ${wrongCount}</span> •
            <span class="text-slate-500">Còn lại ${total - correctCount - wrongCount}</span>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" onclick="App.restartUnitTyping('${unit.id}')" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold whitespace-nowrap">
              <i class="fa-solid fa-shuffle mr-1 text-blue-600"></i> Trộn mới & Làm lại
            </button>
            <button type="button" onclick="App.setTypingMode('${this.state.typingMode === 'SINGLE' ? 'FORM' : 'SINGLE'}')" class="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold whitespace-nowrap">
              ${this.state.typingMode === "SINGLE" ? "Xem dạng Danh sách" : "Xem từng Thẻ"}
            </button>
          </div>
        </div>

        ${this.state.typingMode === "SINGLE" ? `
          ${this.renderSingleShortAnswerCard(unit, currentItem, currentPos, total)}

          <div class="academic-card p-4 flex items-center justify-between">
            <button type="button" onclick="App.moveTypingCursor(-1, ${total}, '${unit.id}')" ${currentPos === 0 ? "disabled" : ""} class="px-4 py-2 rounded-xl bg-slate-100 disabled:opacity-40 text-xs font-bold text-slate-700">
              <i class="fa-solid fa-arrow-left mr-1"></i> Từ trước
            </button>
            <span class="text-xs font-mono font-bold text-slate-600">Thẻ ${currentPos + 1} / ${total}</span>
            ${isLastCard ? `
              <button type="button" onclick="App.finishTypingSession('${unit.id}')" class="px-5 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white">
                Hoàn thành phần này <i class="fa-solid fa-check ml-1"></i>
              </button>
            ` : `
              <button type="button" onclick="App.moveTypingCursor(1, ${total}, '${unit.id}')" class="px-4 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white">
                Từ tiếp theo <i class="fa-solid fa-arrow-right ml-1"></i>
              </button>
            `}
          </div>
        ` : `
          <div class="space-y-4">
            ${shuffledOrder.map((vocabIdx, idx) => this.renderSingleShortAnswerCard(unit, vocabList[vocabIdx], idx, total)).join("")}
          </div>
        `}
      </div>
    `;
  },

  finishTypingSession(unitId) {
    this.state.typingFinished[unitId] = true;
    this.updateSidebarStats();
    window.AudioEngine.playTone("success");
    this.render();
  },

  setTypingMode(mode) {
    this.state.typingMode = mode;
    this.render();
  },

  moveTypingCursor(step, total, unitId = null) {
    const activeUId = unitId || this.state.activeUnit;
    const nextCursor = this.state.typingCursor + step;
    if (nextCursor < 0) return;
    if (nextCursor >= total) {
      this.finishTypingSession(activeUId);
      return;
    }
    this.state.typingCursor = nextCursor;
    const unit = this.getUnitById(activeUId);
    const order = this.ensureShuffledOrder(activeUId);
    const currentItem = unit.vocabulary[order[this.state.typingCursor]];
    if (currentItem) this.state.typingFocusedKey = `${activeUId}-type-${currentItem.id}`;
    this.render();
  },

  onTypingInput(unitId, itemId, value) {
    const key = `${unitId}-type-${itemId}`;
    this.state.typingInputs[key] = value;
    this.state.typingChecked[key] = false;
    this.state.typingFocusedKey = key;

    const list = this.getVocabSourceByUnitId(unitId);
    const item = list.find(v => v.id === itemId);
    if (!item) return;

    const slotsContainer = document.getElementById(`slots-${key}`);
    if (slotsContainer) slotsContainer.innerHTML = this.renderCharacterSlots(item.word, value, true, false);
  },

  handleTypingEnter(unitId, itemId) {
    const key = `${unitId}-type-${itemId}`;
    const list = this.getVocabSourceByUnitId(unitId);
    const item = list.find(v => v.id === itemId);
    if (!item) return;

    const val = this.state.typingInputs[key] || "";
    const cleanTarget = this.getTargetCleanWord(item.word);
    const isCorrect =
      this.normalizeAnswer(val) === this.normalizeAnswer(cleanTarget) ||
      this.normalizeAnswer(val) === this.normalizeAnswer(item.word);

    if (this.state.typingChecked[key] && isCorrect) {
      const order = this.ensureShuffledOrder(unitId);
      if (this.state.typingMode === "SINGLE") {
        if (this.state.typingCursor + 1 >= order.length) this.finishTypingSession(unitId);
        else this.moveTypingCursor(1, order.length, unitId);
      }
      return;
    }
    this.checkTypingItem(unitId, itemId);
  },

  clearTypingItem(unitId, itemId) {
    const key = `${unitId}-type-${itemId}`;
    delete this.state.typingInputs[key];
    delete this.state.typingChecked[key];
    this.state.typingFocusedKey = key;
    this.updateSidebarStats();
    this.render();
  },

  checkTypingItem(unitId, itemId) {
    const key = `${unitId}-type-${itemId}`;
    this.state.typingChecked[key] = true;
    this.state.typingFocusedKey = key;

    const list = this.getVocabSourceByUnitId(unitId);
    const item = list.find(v => v.id === itemId);
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
    } else {
      window.AudioEngine.playTone("error");
    }
    this.updateSidebarStats();
    this.render();
  },

  toggleTypingHint(key) {
    this.state.typingHintShown[key] = !this.state.typingHintShown[key];
    this.state.typingFocusedKey = key;
    this.render();
  }
});