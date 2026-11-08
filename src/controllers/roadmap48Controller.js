Object.assign(window.App, {
  isRoadmapDayUnlocked(dayNumber) {
    if (dayNumber <= 1) return true;
    return Boolean(this.state.completedRoadmapDays[dayNumber - 1]);
  },

  ensureAudioExamData(dayObj) {
    if (!this.state.audioExamSets) this.state.audioExamSets = {};
    if (!this.state.audioExamMcqChoices) this.state.audioExamMcqChoices = {};
    if (!this.state.audioExamDictationInputs) this.state.audioExamDictationInputs = {};
    if (!this.state.audioExamSpeakingResults) this.state.audioExamSpeakingResults = {};
    if (!this.state.audioExamSubmitted) this.state.audioExamSubmitted = {};
    if (!this.state.audioBestScores) {
      const saved = localStorage.getItem("anyht_roadmap48_audio_scores");
      this.state.audioBestScores = saved ? JSON.parse(saved) : {};
    }

    const dayNum = dayObj.day;
    if (this.state.audioExamSets[dayNum]) {
      return this.state.audioExamSets[dayNum];
    }

    const vocabList = dayObj.vocab && dayObj.vocab.length ? dayObj.vocab : [
      { id: 1, word: "student", ipa: "/ˈstjuːdnt/", meaning: "Học sinh" },
      { id: 2, word: "teacher", ipa: "/ˈtiːtʃə(r)/", meaning: "Giáo viên" },
      { id: 3, word: "computer", ipa: "/kəmˈpjuːtər/", meaning: "Máy tính" },
      { id: 4, word: "schedule", ipa: "/ˈʃedjuːl/", meaning: "Lịch trình" },
      { id: 5, word: "meeting", ipa: "/ˈmiːtɪŋ/", meaning: "Cuộc họp" },
      { id: 6, word: "important", ipa: "/ɪmˈpɔːtnt/", meaning: "Quan trọng" }
    ];

    const shuffledVocab = this.shuffleArray([...vocabList]);

    const listeningMcq = shuffledVocab.slice(0, 5).map((item, idx) => {
      const distractors = this.shuffleArray(
        vocabList.filter(v => v.word !== item.word).map(v => v.meaning)
      ).slice(0, 3);
      while (distractors.length < 3) {
        distractors.push("Đáp án nhiễu " + (distractors.length + 1));
      }
      const rawOptions = this.shuffleArray([item.meaning, ...distractors]);
      const correctIdx = rawOptions.indexOf(item.meaning);
      const labels = ["A", "B", "C", "D"];

      return {
        id: `d${dayNum}-lmcq-${idx + 1}`,
        index: idx + 1,
        audioText: item.word,
        ipa: item.ipa || "",
        meaning: item.meaning,
        options: rawOptions.map((opt, i) => `${labels[i]}. ${opt}`),
        correct: correctIdx
      };
    });

    const dictationPool = shuffledVocab.slice(5, 10).length >= 5
      ? shuffledVocab.slice(5, 10)
      : this.shuffleArray([...vocabList]).slice(0, 5);

    const listeningDictation = dictationPool.map((item, idx) => ({
      id: `d${dayNum}-ldict-${idx + 1}`,
      index: idx + 6,
      audioText: item.word,
      ipa: item.ipa || "",
      meaning: item.meaning,
      answer: item.word
    }));

    const speakingWords = this.shuffleArray([...vocabList]).slice(0, 3).map((item, idx) => ({
      id: `d${dayNum}-spk-w${idx + 1}`,
      index: idx + 11,
      mode: "WORD",
      targetText: item.word,
      ipa: item.ipa || "",
      meaning: item.meaning
    }));

    const rawExamples = [];
    (dayObj.grammarSections || []).forEach(sec => {
      (sec.examples || []).forEach(ex => {
        ex.split("•").forEach(part => {
          const cleanEn = part
            .replace(/\([^)]*\)/g, "")
            .replace(/→.*$/, "")
            .replace(/=.*$/, "")
            .replace(/^[✓\s-]+/, "")
            .trim();
          if (cleanEn.split(" ").length >= 3 && cleanEn.length <= 55 && /^[A-Za-z]/.test(cleanEn)) {
            rawExamples.push(cleanEn);
          }
        });
      });
    });

    const fallbackSentences = [
      "He is a teacher.",
      "She is in the kitchen.",
      "They are our classmates.",
      "He plays football in the afternoon."
    ];
    const sentencePool = rawExamples.length >= 2 ? rawExamples : fallbackSentences;
    const speakingSentences = sentencePool.slice(0, 2).map((sen, idx) => ({
      id: `d${dayNum}-spk-s${idx + 1}`,
      index: idx + 14,
      mode: "SENTENCE",
      targetText: sen,
      ipa: "Câu giao tiếp thực hành trong bài",
      meaning: "Hãy bấm Thu âm và đọc to cả câu tiếng Anh này"
    }));

    const examSet = {
      listeningMcq,
      listeningDictation,
      speakingItems: [...speakingWords, ...speakingSentences]
    };

    this.state.audioExamSets[dayNum] = examSet;
    return examSet;
  },

  isGatekeeperInputCorrect(q, userRawText) {
    const cleanUser = this.normalizeAnswer(String(userRawText || "").replace(/[.!?]+$/, ""));
    if (!cleanUser) return false;
    if (Array.isArray(q.acceptedAnswers)) {
      return q.acceptedAnswers.some(ans =>
        this.normalizeAnswer(String(ans).replace(/[.!?]+$/, "")) === cleanUser
      );
    }
    const cleanTarget = this.normalizeAnswer(String(q.answer || "").replace(/[.!?]+$/, ""));
    return cleanUser === cleanTarget;
  },

  getGatekeeperQuestions(dayObj) {
    if (!dayObj) return [];
    if (dayObj.assessment && dayObj.assessment.gatekeeperExam) {
      return dayObj.assessment.gatekeeperExam;
    }
    if (dayObj.assessment) {
      const list = [];
      (dayObj.assessment.quiz1 || []).forEach(q => {
        list.push({
          id: q.id,
          type: "INPUT",
          section: "Phần I: Tự luận chuyển đổi cụm từ",
          prompt: `Câu ${list.length + 1}: ${q.prompt} (${q.hint})`,
          answer: q.answer,
          explain: `Đáp án chuẩn: ${q.answer}`
        });
      });
      [
        ...(dayObj.assessment.quiz2 || []),
        ...(dayObj.assessment.quiz3 || []),
        ...(dayObj.assessment.quiz4 || []),
        ...(dayObj.assessment.practice || [])
      ].forEach(q => {
        list.push({
          id: q.id,
          type: "MCQ",
          section: "Phần II: Trắc nghiệm sát hạch tổng hợp",
          q: `Câu ${list.length + 1}: ${q.q.replace(/^Question \d+\.\s*/i, "")}`,
          options: q.options,
          correct: q.correct,
          explain: q.explain
        });
      });
      return list;
    }
    return (dayObj.quiz || []).map((q, idx) => ({
      id: `d${dayObj.day}-q${idx}`,
      type: "MCQ",
      section: "Phần Kiểm Tra Sát Hạch",
      q: `Câu ${idx + 1}: ${q.q}`,
      options: q.options,
      correct: q.correct,
      explain: q.explain
    }));
  },

  selectRoadmapPhase(phaseId) {
    this.state.activeRoadmapPhase = phaseId;
    const rm = window.Roadmap48Data;
    const phaseDays = rm.days.filter(d => d.phaseId === phaseId);
    const firstUnlocked = phaseDays.find(d => this.isRoadmapDayUnlocked(d.day)) || phaseDays[0];
    if (firstUnlocked && this.isRoadmapDayUnlocked(firstUnlocked.day)) {
      this.state.activeRoadmapDay = firstUnlocked.day;
      this.state.activeRoadmapSubTab = "vocab_parts";
      this.state.activeDayVocabPartIdx = 0;
      this.state.activeDayGrammarPartIdx = 0;
      this.state.typingCursor = 0;
      this.state.isExamModalOpen = false;
    } else if (firstUnlocked) {
      this.toast(
        `🔒 Chặng này đang khóa! Bạn cần vượt qua <strong>Phòng Thi Ngày ${firstUnlocked.day - 1}</strong> với điểm số <strong>≥ 80%</strong> trước.`,
        "error"
      );
      return;
    }
    this.render();
  },

  selectRoadmapDay(dayNumber) {
    const rm = window.Roadmap48Data;
    const dayObj = rm.days.find(d => d.day === dayNumber);
    if (!dayObj) return;

    if (!this.isRoadmapDayUnlocked(dayNumber)) {
      window.AudioEngine.playTone("error");
      this.toast(
        `🔒 <strong>Ngày ${dayNumber} đang khóa!</strong> Bạn phải vượt qua Phòng Thi <strong>Ngày ${dayNumber - 1} đạt tối thiểu 80%</strong> để mở khóa.`,
        "error"
      );
      return;
    }

    this.state.activeRoadmapDay = dayNumber;
    this.state.activeRoadmapPhase = dayObj.phaseId;
    this.state.activeRoadmapSubTab = "vocab_parts";
    this.state.activeDayVocabPartIdx = 0;
    this.state.activeDayGrammarPartIdx = 0;
    this.state.activeDayTypingScope = "ALL";
    this.state.typingCursor = 0;
    this.state.typingFocusedKey = null;
    this.state.isExamModalOpen = false;
    this.ensureShuffledOrder(`day${dayNumber}`);
    this.render();
  },

  switchRoadmapSubTab(subTab) {
    this.state.isExamModalOpen = false;
    this.state.activeRoadmapSubTab = subTab;
    if (subTab === "typing") {
      const targetUnitId = this.getActiveDayTypingUnitId();
      this.ensureShuffledOrder(targetUnitId);
    }
    this.render();
  },

  openGatekeeperExam(mode = "WRITTEN") {
    this.state.isExamModalOpen = true;
    this.state.activeExamType = mode;
    this.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  switchExamMode(mode) {
    this.state.activeExamType = mode;
    this.render();
  },

  closeGatekeeperExam() {
    this.state.isExamModalOpen = false;
    this.render();
  },

  selectDayVocabPart(partIdx) {
    this.state.activeDayVocabPartIdx = partIdx;
    this.render();
  },

  selectDayGrammarPart(partIdx) {
    this.state.activeDayGrammarPartIdx = partIdx;
    this.render();
  },

  practiceSpecificVocabPart(dayNum, partIdx) {
    this.state.activeRoadmapDay = dayNum;
    this.state.activeDayTypingScope = String(partIdx);
    this.state.activeRoadmapSubTab = "typing";
    this.state.isExamModalOpen = false;
    this.state.typingCursor = 0;
    const unitId = `day${dayNum}__part__${partIdx}`;
    this.ensureShuffledOrder(unitId, true);
    const unit = this.getUnitById(unitId);
    if (unit && unit.vocabulary.length) {
      const firstIdx = this.state.typingShuffledOrder[unitId][0];
      this.state.typingFocusedKey = `${unitId}-type-${unit.vocabulary[firstIdx].id}`;
    }
    this.render();
    this.toast(`⌨️ Đang luyện gõ riêng <strong>${unit.title} (${unit.vocabulary.length} từ)</strong>!`, "info");
  },

  setDayTypingScope(scopeVal) {
    this.state.activeDayTypingScope = scopeVal;
    this.state.typingCursor = 0;
    const unitId = this.getActiveDayTypingUnitId();
    this.ensureShuffledOrder(unitId);
    this.render();
  },

  getActiveDayTypingUnitId() {
    const dayNum = this.state.activeRoadmapDay;
    if (this.state.activeDayTypingScope === "ALL") return `day${dayNum}`;
    return `day${dayNum}__part__${this.state.activeDayTypingScope}`;
  },

  checkInlineGrammarQuiz(dayNumber) {
    if (!this.state.inlineGrammarChecked) this.state.inlineGrammarChecked = {};
    this.state.inlineGrammarChecked[dayNumber] = true;
    window.AudioEngine.playTone("success");
    this.render();
    this.toast("Đã kiểm tra đáp án bài tập ngữ pháp tại chỗ!", "success");
  },

  selectAudioExamMcq(qId, optIdx) {
    this.ensureAudioExamData({ day: this.state.activeRoadmapDay });
    this.state.audioExamMcqChoices[qId] = optIdx;
    this.render();
  },

  onAudioDictationInput(qId, val) {
    this.ensureAudioExamData({ day: this.state.activeRoadmapDay });
    this.state.audioExamDictationInputs[qId] = val;
  },

  recordSpeakingItem(dayNum, itemId, targetText) {
    const rm = window.Roadmap48Data;
    const dayObj = rm.days.find(d => d.day === dayNum);
    this.ensureAudioExamData(dayObj);

    this.state.recordingItemId = itemId;
    this.render();

    window.AudioEngine.startListening({
      onStart: () => {
        this.toast(`🎤 <strong>Đang lắng nghe...</strong> Hãy đọc to: <em>"${targetText}"</em>`, "info");
      },
      onResult: (transcript) => {
        this.state.recordingItemId = null;
        const result = window.AudioEngine.gradePronunciation(targetText, transcript);
        this.state.audioExamSpeakingResults[itemId] = {
          spokenText: transcript,
          score: result.score,
          passed: result.passed,
          wordBreakdown: result.wordBreakdown
        };
        if (result.passed) {
          window.AudioEngine.playTone("success");
          this.toast(`✓ Phát âm chuẩn <strong>${result.score}%</strong>! Máy nghe được: "${transcript}"`, "success");
        } else {
          window.AudioEngine.playTone("error");
          this.toast(`Độ khớp: <strong>${result.score}%</strong>. Máy nghe được: "${transcript}". Hãy thử đọc lại rõ hơn!`, "error");
        }
        this.render();
      },
      onError: (errMsg) => {
        this.state.recordingItemId = null;
        this.toast(`⚠️ ${errMsg}`, "error");
        this.render();
      },
      onEnd: () => {
        this.state.recordingItemId = null;
        this.render();
      }
    });
  },

  resetAudioExam(dayNumber) {
    const dayObj = (window.Roadmap48Data?.days || []).find(d => d.day === dayNumber);
    if (!dayObj) return;
    delete this.state.audioExamSubmitted[dayNumber];
    delete this.state.audioExamSets[dayNumber];
    const freshSet = this.ensureAudioExamData(dayObj);

    freshSet.listeningMcq.forEach(q => delete this.state.audioExamMcqChoices[q.id]);
    freshSet.listeningDictation.forEach(q => delete this.state.audioExamDictationInputs[q.id]);
    freshSet.speakingItems.forEach(item => delete this.state.audioExamSpeakingResults[item.id]);

    this.render();
    this.toast("🔄 Đã trộn đề Kiểm tra Nghe & Nói mới!", "info");
  },

  calculateAudioExamScore(dayNumber) {
    const dayObj = (window.Roadmap48Data?.days || []).find(d => d.day === dayNumber);
    if (!dayObj) return { correct: 0, total: 15, answered: 0, minRequired: 12, percent: 0, grade10: "0.0" };

    const examSet = this.ensureAudioExamData(dayObj);
    let correct = 0;
    let answered = 0;
    const total =
      examSet.listeningMcq.length +
      examSet.listeningDictation.length +
      examSet.speakingItems.length;

    examSet.listeningMcq.forEach(q => {
      if (this.state.audioExamMcqChoices[q.id] !== undefined) answered++;
      if (this.state.audioExamMcqChoices[q.id] === q.correct) correct++;
    });

    examSet.listeningDictation.forEach(q => {
      const val = (this.state.audioExamDictationInputs[q.id] || "").trim();
      if (val.length > 0) answered++;
      if (this.normalizeAnswer(val) === this.normalizeAnswer(q.answer)) correct++;
    });

    examSet.speakingItems.forEach(item => {
      const spk = this.state.audioExamSpeakingResults[item.id];
      if (spk) {
        answered++;
        if (spk.passed) correct++;
      }
    });

    const minRequired = Math.ceil(total * 0.8);
    const percent = Math.round((correct / total) * 100);
    const grade10 = ((correct / total) * 10).toFixed(1);
    return { correct, total, answered, minRequired, percent, grade10 };
  },

  submitAudioExam(dayNumber) {
    this.state.audioExamSubmitted[dayNumber] = true;
    const scoreInfo = this.calculateAudioExamScore(dayNumber);

    const prevBest = this.state.audioBestScores[dayNumber] || 0;
    if (scoreInfo.percent > prevBest) {
      this.state.audioBestScores[dayNumber] = scoreInfo.percent;
      localStorage.setItem("anyht_roadmap48_audio_scores", JSON.stringify(this.state.audioBestScores));
    }

    if (scoreInfo.percent >= 80) {
      const wasDone = Boolean(this.state.completedRoadmapDays[dayNumber]);
      this.state.completedRoadmapDays[dayNumber] = true;
      if (!wasDone) this.state.user.xp += 100;
      this.saveRoadmap48Progress();
      window.AudioEngine.playTone("success");
      this.toast(
        `🎉 Xuất sắc! Bạn đạt <strong>${scoreInfo.percent}% (${scoreInfo.correct}/${scoreInfo.total} câu)</strong> bài Kiểm tra Nghe & Nói và mở khóa <strong>Ngày ${dayNumber + 1}</strong>!`,
        "success"
      );
    } else {
      window.AudioEngine.playTone("error");
      this.toast(
        `⚠️ Chưa đạt! Bạn được <strong>${scoreInfo.percent}% (${scoreInfo.correct}/${scoreInfo.total} câu)</strong>. Cần đạt tối thiểu <strong>80% (${scoreInfo.minRequired}/${scoreInfo.total} câu)</strong>.`,
        "error"
      );
    }

    this.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  renderListeningSpeakingExamView(currentDayObj) {
    const dayNum = currentDayObj.day;
    const examSet = this.ensureAudioExamData(currentDayObj);
    const isSubmitted = Boolean(this.state.audioExamSubmitted[dayNum]);
    const scoreInfo = this.calculateAudioExamScore(dayNum);
    const passed80 = scoreInfo.percent >= 80;
    const neededMore = Math.max(0, scoreInfo.minRequired - scoreInfo.correct);

    return `
      <div class="space-y-6">
        <div class="rounded-2xl bg-slate-900 text-white p-6 shadow-xl border border-slate-800 space-y-4">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-md bg-cyan-400 text-slate-950 font-mono font-extrabold text-[11px] uppercase">
                  <i class="fa-solid fa-headphones-simple mr-1"></i> LISTENING & SPEAKING TEST • NGÀY ${dayNum}
                </span>
                <span class="px-2.5 py-0.5 rounded-md bg-white/10 text-amber-300 font-mono text-xs font-semibold">
                  Yêu cầu đạt ≥ 80% (${scoreInfo.minRequired}/${scoreInfo.total} câu)
                </span>
              </div>
              <h3 class="text-lg sm:text-xl font-extrabold text-white">
                Phòng Kiểm Tra Nghe & Nói AI — Ngày ${dayNum}: ${currentDayObj.title}
              </h3>
              <p class="text-xs text-slate-300">
                Kiểm tra toàn diện kỹ năng <strong>Nghe phản xạ (5 câu)</strong>, <strong>Nghe chép chính tả (5 câu)</strong> và <strong>Phát âm qua Microphone (5 câu)</strong>.
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onclick="App.closeGatekeeperExam()"
                class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition whitespace-nowrap"
              >
                <i class="fa-solid fa-arrow-left mr-1"></i> Quay lại 3 mục bài học
              </button>
              <button
                type="button"
                onclick="App.resetAudioExam(${dayNum})"
                class="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition whitespace-nowrap"
              >
                <i class="fa-solid fa-rotate-left mr-1"></i> Trộn đề mới
              </button>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-800 flex flex-wrap gap-2">
            <button
              type="button"
              onclick="App.switchExamMode('WRITTEN')"
              class="px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              <i class="fa-solid fa-file-pen"></i> 1. Đề Thi Đọc & Viết (PDF)
            </button>
            <button
              type="button"
              onclick="App.switchExamMode('AUDIO')"
              class="px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 bg-cyan-500 text-slate-950 shadow-md"
            >
              <i class="fa-solid fa-microphone-lines"></i> 2. Đề Kiểm Tra Nghe & Nói AI (15 câu)
            </button>
          </div>
        </div>

        ${isSubmitted ? `
          <div class="academic-card p-6 ${passed80 ? 'bg-gradient-to-r from-emerald-50 via-white to-cyan-50 border-2 border-emerald-500' : 'bg-gradient-to-r from-rose-50 via-white to-amber-50 border-2 border-rose-400'} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl ${passed80 ? 'bg-emerald-600' : 'bg-rose-600'} text-white flex flex-col items-center justify-center font-mono shadow-md shrink-0">
                <span class="text-lg font-black leading-none">${scoreInfo.percent}%</span>
                <span class="text-[10px] opacity-90 mt-0.5">${scoreInfo.grade10}/10</span>
              </div>
              <div class="space-y-1">
                <span class="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full ${passed80 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                  <i class="fa-solid ${passed80 ? 'fa-award' : 'fa-circle-exclamation'}"></i>
                  ${passed80 ? 'ĐẠT CHUẨN NGHE & NÓI (PASSED ≥ 80%)' : 'CHƯA ĐẠT 80% — HÃY LUYỆN LẠI'}
                </span>
                <h4 class="text-base font-extrabold text-slate-900">
                  Kết quả Nghe & Nói: Đúng ${scoreInfo.correct} / ${scoreInfo.total} câu (${scoreInfo.percent}%)
                </h4>
                <p class="text-xs text-slate-600">
                  ${passed80
                    ? `Chúc mừng! Bạn đã vượt qua bài sát hạch Nghe & Nói và mở khóa Ngày ${dayNum + 1}.`
                    : `Bạn cần hoàn thành đúng thêm ${neededMore} câu nữa để đạt mốc 80% (${scoreInfo.minRequired}/${scoreInfo.total} câu).`}
                </p>
              </div>
            </div>

            ${passed80 && dayNum < 48 ? `
              <button
                type="button"
                onclick="App.selectRoadmapDay(${dayNum + 1})"
                class="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md whitespace-nowrap transition flex items-center gap-2"
              >
                <i class="fa-solid fa-unlock"></i> Học Tiếp Ngày ${dayNum + 1} <i class="fa-solid fa-arrow-right"></i>
              </button>
            ` : ""}
          </div>
        ` : ""}

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div class="lg:col-span-8 space-y-6">
            <div class="academic-card p-6 space-y-4">
              <div class="border-b border-slate-200 pb-3">
                <span class="text-[11px] font-bold uppercase text-blue-600 block">PHẦN I — LISTENING COMPREHENSION (5 CÂU)</span>
                <h4 class="font-extrabold text-sm text-slate-900">Bấm nút Loa để nghe từ tiếng Anh và chọn nghĩa tiếng Việt chính xác</h4>
              </div>

              <div class="space-y-4">
                ${examSet.listeningMcq.map(q => {
                  const chosen = this.state.audioExamMcqChoices[q.id];
                  const isOk = chosen === q.correct;
                  return `
                    <div id="audio-q-${q.index}" class="p-4 rounded-xl bg-slate-50 border ${isSubmitted ? (isOk ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20') : 'border-slate-200'} space-y-3">
                      <div class="flex flex-wrap items-center justify-between gap-2">
                        <span class="font-extrabold text-xs sm:text-sm text-slate-900">
                          Câu ${q.index}: Nghe phát âm và chọn nghĩa đúng
                        </span>
                        <div class="flex items-center gap-2">
                          <button
                            type="button"
                            onclick="AudioEngine.speak('${q.audioText.replace(/'/g, "\\'")}', 1.0)"
                            class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                          >
                            <i class="fa-solid fa-volume-high"></i> Nghe chuẩn (1.0x)
                          </button>
                          <button
                            type="button"
                            onclick="AudioEngine.speak('${q.audioText.replace(/'/g, "\\'")}', 0.65)"
                            class="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition"
                          >
                            🐢 Nghe chậm
                          </button>
                        </div>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        ${q.options.map((opt, optIdx) => {
                          let btnStyle = "bg-white border-slate-200 text-slate-700 hover:border-blue-400";
                          if (!isSubmitted && chosen === optIdx) {
                            btnStyle = "bg-blue-600 text-white border-blue-600 font-bold";
                          } else if (isSubmitted) {
                            if (optIdx === q.correct) btnStyle = "bg-emerald-100 border-emerald-500 text-emerald-900 font-bold";
                            else if (optIdx === chosen) btnStyle = "bg-rose-100 border-rose-500 text-rose-900 font-semibold";
                          }
                          return `
                            <button
                              type="button"
                              onclick="App.selectAudioExamMcq('${q.id}', ${optIdx})"
                              class="text-left px-4 py-2.5 rounded-lg border text-xs transition ${btnStyle}"
                            >
                              ${opt}
                            </button>
                          `;
                        }).join("")}
                      </div>

                      ${isSubmitted ? `
                        <div class="text-xs p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700">
                          <strong class="${isOk ? 'text-emerald-600' : 'text-rose-600'}">${isOk ? '✓ Chính xác:' : '✗ Đáp án âm thanh:'}</strong>
                          <span class="font-mono font-bold text-blue-700 ml-1">${q.audioText}</span> ${q.ipa} → <strong>${q.meaning}</strong>
                        </div>
                      ` : ""}
                    </div>
                  `;
                }).join("")}
              </div>
            </div>

            <div class="academic-card p-6 space-y-4">
              <div class="border-b border-slate-200 pb-3">
                <span class="text-[11px] font-bold uppercase text-indigo-600 block">PHẦN II — AUDIO DICTATION (5 CÂU NGHE CHÉP CHÍNH TẢ)</span>
                <h4 class="font-extrabold text-sm text-slate-900">Nghe âm thanh và gõ lại chính xác từ vựng tiếng Anh bạn nghe được</h4>
              </div>

              <div class="space-y-4">
                ${examSet.listeningDictation.map(q => {
                  const userVal = this.state.audioExamDictationInputs[q.id] || "";
                  const isOk = this.normalizeAnswer(userVal) === this.normalizeAnswer(q.answer);
                  return `
                    <div id="audio-q-${q.index}" class="p-4 rounded-xl bg-slate-50 border ${isSubmitted ? (isOk ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20') : 'border-slate-200'} space-y-2.5">
                      <div class="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span class="font-extrabold text-xs sm:text-sm text-slate-900">Câu ${q.index}: Nghe và gõ lại từ tiếng Anh</span>
                          <span class="text-xs text-slate-500 ml-2">(Gợi ý nghĩa: <strong>${q.meaning}</strong>)</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                          <button
                            type="button"
                            onclick="AudioEngine.speak('${q.audioText.replace(/'/g, "\\'")}', 1.0)"
                            class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition"
                          >
                            <i class="fa-solid fa-volume-high mr-1"></i> Nghe từ
                          </button>
                          <button
                            type="button"
                            onclick="AudioEngine.speak('${q.audioText.replace(/'/g, "\\'")}', 0.65)"
                            class="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold"
                          >
                            🐢
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Gõ từ tiếng Anh bạn nghe được..."
                        value="${userVal.replace(/"/g, "&quot;")}"
                        oninput="App.onAudioDictationInput('${q.id}', this.value)"
                        class="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                      />

                      ${isSubmitted ? `
                        <p class="text-xs font-bold ${isOk ? 'text-emerald-600' : 'text-rose-600'}">
                          ${isOk ? `✓ Chính xác (${q.answer} ${q.ipa})` : `✗ Đáp án đúng: ${q.answer} ${q.ipa}`}
                        </p>
                      ` : ""}
                    </div>
                  `;
                }).join("")}
              </div>
            </div>

            <div class="academic-card p-6 space-y-4">
              <div class="border-b border-slate-200 pb-3">
                <span class="text-[11px] font-bold uppercase text-emerald-600 block">PHẦN III — AI SPEAKING & PRONUNCIATION (5 CÂU LUYỆN NÓI)</span>
                <h4 class="font-extrabold text-sm text-slate-900">Bấm "Bấm để Nói (Mic)" và đọc to từ/câu tiếng Anh bên dưới (Yêu cầu độ khớp ≥ 80%)</h4>
              </div>

              <div class="space-y-4">
                ${examSet.speakingItems.map(item => {
                  const spkRes = this.state.audioExamSpeakingResults[item.id];
                  const isRecording = this.state.recordingItemId === item.id;

                  return `
                    <div id="audio-q-${item.index}" class="p-4 rounded-xl bg-slate-50 border ${spkRes ? (spkRes.passed ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20') : 'border-slate-200'} space-y-3">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded ${item.mode === 'WORD' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}">
                            Câu ${item.index} • ${item.mode === "WORD" ? "Phát âm Từ vựng" : "Nói cả câu giao tiếp"}
                          </span>
                          <h5 class="text-base font-extrabold text-slate-900 mt-1">${item.targetText}</h5>
                          <p class="text-xs text-slate-500 font-mono">${item.ipa} — <span class="font-sans text-slate-600">${item.meaning}</span></p>
                        </div>

                        <div class="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onclick="AudioEngine.speak('${item.targetText.replace(/'/g, "\\'")}', 1.0)"
                            class="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition"
                          >
                            <i class="fa-solid fa-volume-high mr-1 text-blue-600"></i> Nghe mẫu
                          </button>

                          <button
                            type="button"
                            onclick="App.recordSpeakingItem(${dayNum}, '${item.id}', '${item.targetText.replace(/'/g, "\\'")}')"
                            class="px-4 py-2 rounded-xl text-xs font-extrabold text-white shadow-sm transition flex items-center gap-1.5 ${isRecording ? 'bg-rose-600 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'}"
                          >
                            <i class="fa-solid ${isRecording ? 'fa-microphone-lines' : 'fa-microphone'}"></i>
                            <span>${isRecording ? "Đang nghe bạn nói..." : "Bấm để Nói (Mic)"}</span>
                          </button>
                        </div>
                      </div>

                      ${spkRes ? `
                        <div class="p-3 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div class="space-y-1">
                            <p class="text-slate-600">
                              <strong>Giọng đọc nhận diện được:</strong> <span class="font-mono font-bold text-slate-900">"${spkRes.spokenText}"</span>
                            </p>
                            <div class="flex flex-wrap gap-1.5 pt-0.5">
                              ${(spkRes.wordBreakdown || []).map(w => `
                                <span class="px-2 py-0.5 rounded font-mono text-[11px] font-bold ${w.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                                  ${w.ok ? '✓' : '✗'} ${w.word}
                                </span>
                              `).join("")}
                            </div>
                          </div>
                          <span class="px-3 py-1 rounded-lg font-mono font-extrabold text-xs shrink-0 ${spkRes.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                            Độ chuẩn: ${spkRes.score}%
                          </span>
                        </div>
                      ` : ""}
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          </div>

          <div class="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
            <div class="academic-card p-5 space-y-4 border-2 border-cyan-200">
              <div class="border-b border-slate-200 pb-3">
                <h4 class="font-extrabold text-sm text-slate-900">Phiếu Kết Quả Nghe & Nói</h4>
                <p class="text-[11px] text-slate-500">Đã làm: <strong>${scoreInfo.answered}/${scoreInfo.total}</strong> câu • Cần đạt: <strong>≥ ${scoreInfo.minRequired} câu (80%)</strong></p>
              </div>

              <div class="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden relative">
                <div
                  class="h-full transition-all duration-300 ${isSubmitted ? (passed80 ? 'bg-emerald-500' : 'bg-rose-500') : 'bg-cyan-600'}"
                  style="width: ${isSubmitted ? scoreInfo.percent : Math.round((scoreInfo.answered / scoreInfo.total) * 100)}%"
                ></div>
                <div class="absolute top-0 bottom-0 left-[80%] w-0.5 bg-slate-900"></div>
              </div>

              <div class="grid grid-cols-5 gap-2">
                ${[
                  ...examSet.listeningMcq.map(q => ({
                    idx: q.index,
                    done: this.state.audioExamMcqChoices[q.id] !== undefined,
                    ok: this.state.audioExamMcqChoices[q.id] === q.correct
                  })),
                  ...examSet.listeningDictation.map(q => ({
                    idx: q.index,
                    done: Boolean((this.state.audioExamDictationInputs[q.id] || "").trim()),
                    ok: this.normalizeAnswer(this.state.audioExamDictationInputs[q.id] || "") === this.normalizeAnswer(q.answer)
                  })),
                  ...examSet.speakingItems.map(item => ({
                    idx: item.index,
                    done: Boolean(this.state.audioExamSpeakingResults[item.id]),
                    ok: Boolean(this.state.audioExamSpeakingResults[item.id]?.passed)
                  }))
                ].map(cell => {
                  let cls = "bg-slate-100 text-slate-600 border-slate-200";
                  if (!isSubmitted && cell.done) cls = "bg-cyan-600 text-white border-cyan-600 font-bold";
                  else if (isSubmitted) {
                    cls = cell.ok
                      ? "bg-emerald-500 text-white border-emerald-600 font-bold"
                      : "bg-rose-500 text-white border-rose-600 font-bold";
                  }
                  return `<a href="#audio-q-${cell.idx}" class="h-9 rounded-lg border text-xs font-mono flex items-center justify-center ${cls}">${cell.idx}</a>`;
                }).join("")}
              </div>

              <button
                type="button"
                onclick="App.submitAudioExam(${dayNum})"
                class="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-extrabold shadow-md transition"
              >
                <i class="fa-solid fa-check-double mr-1.5"></i> Nộp Bài Nghe & Nói (≥ 80%)
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  onRoadmapTestInput(qId, value) {
    this.state.roadmapTestInputs[qId] = value;
  },

  selectRoadmapTestChoice(qId, optIdx) {
    this.state.roadmapTestChoices[qId] = optIdx;
    this.render();
  },

  resetRoadmapTest(dayNumber) {
    const dayObj = (window.Roadmap48Data?.days || []).find(d => d.day === dayNumber);
    if (!dayObj) return;
    delete this.state.roadmapTestSubmitted[dayNumber];
    const questions = this.getGatekeeperQuestions(dayObj);
    questions.forEach(q => {
      delete this.state.roadmapTestInputs[q.id];
      delete this.state.roadmapTestChoices[q.id];
    });
    this.render();
    this.toast("🔄 Đã tạo lại phiếu làm bài mới! Hãy đạt tối thiểu 80% để qua ngày.", "info");
  },

  submitRoadmapTest(dayNumber) {
    this.state.roadmapTestSubmitted[dayNumber] = true;
    const scoreInfo = this.calculateRoadmapTestScore(dayNumber);

    if (!this.state.roadmapBestScores) this.state.roadmapBestScores = {};
    const prevBest = this.state.roadmapBestScores[dayNumber] || 0;
    if (scoreInfo.percent > prevBest) {
      this.state.roadmapBestScores[dayNumber] = scoreInfo.percent;
      localStorage.setItem("anyht_roadmap48_scores", JSON.stringify(this.state.roadmapBestScores));
    }

    if (scoreInfo.percent >= 80) {
      const wasAlreadyDone = Boolean(this.state.completedRoadmapDays[dayNumber]);
      this.state.completedRoadmapDays[dayNumber] = true;
      if (!wasAlreadyDone) {
        this.state.user.xp += 100;
      }
      this.saveRoadmap48Progress();
      window.AudioEngine.playTone("success");
      this.toast(
        `🎉 Chúc mừng! Bạn đạt <strong>${scoreInfo.percent}% (${scoreInfo.correct}/${scoreInfo.total} câu) ≥ 80%</strong>. Chính thức mở khóa <strong>Ngày ${dayNumber + 1}</strong>!`,
        "success"
      );
    } else {
      if ((this.state.roadmapBestScores[dayNumber] || 0) < 80) {
        this.state.completedRoadmapDays[dayNumber] = false;
        this.saveRoadmap48Progress();
      }
      window.AudioEngine.playTone("error");
      this.toast(
        `⚠️ Chưa đạt! Bạn được <strong>${scoreInfo.percent}% (${scoreInfo.correct}/${scoreInfo.total} câu)</strong>. Cần tối thiểu <strong>80% (${scoreInfo.minRequired}/${scoreInfo.total} câu)</strong> để mở khóa Ngày ${dayNumber + 1}.`,
        "error"
      );
    }

    this.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  calculateRoadmapTestScore(dayNumber) {
    const dayObj = (window.Roadmap48Data?.days || []).find(d => d.day === dayNumber);
    if (!dayObj) return { correct: 0, total: 1, answered: 0, minRequired: 1, percent: 0, grade10: "0.0" };

    const questions = this.getGatekeeperQuestions(dayObj);
    let correct = 0;
    let answered = 0;
    const total = questions.length || 1;

    questions.forEach(q => {
      if (q.type === "INPUT") {
        const rawVal = (this.state.roadmapTestInputs[q.id] || "").trim();
        if (rawVal.length > 0) answered++;
        if (this.isGatekeeperInputCorrect(q, rawVal)) correct++;
      } else {
        if (this.state.roadmapTestChoices[q.id] !== undefined) answered++;
        if (this.state.roadmapTestChoices[q.id] === q.correct) correct++;
      }
    });

    const minRequired = Math.ceil(total * 0.8);
    const percent = Math.round((correct / total) * 100);
    const grade10 = ((correct / total) * 10).toFixed(1);
    return { correct, total, answered, minRequired, percent, grade10 };
  },

  renderVisualStaircaseSelector(phaseObj, phaseDays) {
    return `
      <div class="academic-card p-5 bg-gradient-to-b from-white to-slate-50/90">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shadow-sm shrink-0">
              <i class="fa-solid fa-stairs"></i>
            </span>
            <div>
              <h4 class="text-sm font-extrabold text-slate-900">
                Tháp Bậc Thang Chinh Phục — ${phaseObj.name}: ${phaseObj.title}
              </h4>
              <p class="text-[11px] text-slate-500">
                Học xong 3 mục (Từ Vựng • Ngữ Pháp • Luyện Gõ) rồi vượt qua <strong>Phòng Thi Sát Hạch (≥ 80%)</strong> để leo lên bậc tiếp theo
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3 text-[11px] font-semibold text-slate-600 shrink-0">
            <span class="inline-flex items-center gap-1.5 whitespace-nowrap"><span class="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Đã qua (≥80%)</span>
            <span class="inline-flex items-center gap-1.5 whitespace-nowrap"><span class="w-2.5 h-2.5 rounded-sm bg-blue-600"></span> Đang học</span>
            <span class="inline-flex items-center gap-1.5 whitespace-nowrap"><span class="w-2.5 h-2.5 rounded-sm bg-slate-200 border border-slate-300"></span> Đang khóa 🔒</span>
          </div>
        </div>

        <div class="overflow-x-auto pb-2 pt-7">
          <div class="min-w-[680px] h-36 flex items-end justify-between gap-2 px-2 border-b-2 border-slate-300 relative">
            ${phaseDays.map((d, idx) => {
              const heightPercent = 34 + idx * 6;
              const isDone = Boolean(this.state.completedRoadmapDays[d.day]);
              const isUnlocked = this.isRoadmapDayUnlocked(d.day);
              const isCurrent = this.state.activeRoadmapDay === d.day;
              const bestScore = (this.state.roadmapBestScores || {})[d.day];

              let barStyle = "bg-slate-100 border-slate-300 text-slate-400 opacity-75 cursor-not-allowed";
              if (isUnlocked) barStyle = "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 cursor-pointer";
              if (isDone) barStyle = "bg-gradient-to-t from-emerald-600 to-emerald-500 border-emerald-600 text-white shadow-sm cursor-pointer";
              if (isCurrent) barStyle = "bg-gradient-to-t from-blue-700 via-blue-600 to-indigo-500 border-blue-700 text-white stair-bar-active ring-2 ring-blue-500 ring-offset-2 cursor-pointer";

              return `
                <button
                  type="button"
                  onclick="App.selectRoadmapDay(${d.day})"
                  style="height: ${heightPercent}%;"
                  title="${isUnlocked ? `Ngày ${d.day}: ${d.title}` : `🔒 Cần đạt ≥ 80% bài sát hạch Ngày ${d.day - 1} để mở khóa`}"
                  class="stair-bar flex-1 rounded-t-xl border-2 border-b-0 flex flex-col items-center justify-between p-1.5 ${barStyle}"
                >
                  <div class="w-full flex flex-col items-center">
                    ${isCurrent ? `
                      <span class="-mt-7 mb-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] shadow whitespace-nowrap flex items-center gap-1">
                        <i class="fa-solid fa-crown text-[9px]"></i> Bậc ${d.day}
                      </span>
                    ` : isDone ? `
                      <span class="text-[10px] font-mono font-extrabold bg-white/20 px-1.5 py-0.5 rounded">${bestScore || 100}%</span>
                    ` : isUnlocked ? `
                      <span class="text-[10px] font-bold text-blue-600"><i class="fa-solid fa-unlock"></i></span>
                    ` : `
                      <span class="text-[11px] text-slate-400"><i class="fa-solid fa-lock"></i></span>
                    `}
                  </div>
                  <div class="text-center leading-tight pb-0.5">
                    <span class="text-[10px] font-mono opacity-75 block whitespace-nowrap">Ngày</span>
                    <span class="text-xs sm:text-sm font-mono font-extrabold block whitespace-nowrap">${String(d.day).padStart(2, "0")}</span>
                  </div>
                </button>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;
  },

  renderRoadmapDayVocabParts(currentDayObj) {
    if (currentDayObj.isPlaceholder) {
      return `
        <div class="academic-card p-8 text-center space-y-4">
          <h4 class="font-extrabold text-base text-slate-900">${currentDayObj.title}</h4>
          <p class="text-xs text-slate-600 max-w-lg mx-auto">${currentDayObj.theory}</p>
        </div>
      `;
    }

    const groups = [...new Set(currentDayObj.vocab.map(v => v.group || `Từ vựng Ngày ${currentDayObj.day}`))];
    const activeIdx = Math.min(this.state.activeDayVocabPartIdx, groups.length - 1);
    const activeGroupName = groups[activeIdx];
    const activeItems = currentDayObj.vocab.filter(v => (v.group || `Từ vựng Ngày ${currentDayObj.day}`) === activeGroupName);

    return `
      <div class="academic-card overflow-hidden">
        <div class="p-5 bg-slate-50/70 border-b border-slate-200 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">A. VOCABULARY & B. PRONUNCIATION</span>
              <h4 class="text-base font-extrabold text-slate-900 mt-0.5">
                Đang học: <span class="text-blue-600">${activeGroupName}</span> (${activeItems.length} từ)
              </h4>
            </div>
            <button
              type="button"
              onclick="App.practiceSpecificVocabPart(${currentDayObj.day}, ${activeIdx})"
              class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm whitespace-nowrap shrink-0"
            >
              <i class="fa-solid fa-keyboard mr-1.5"></i> Luyện Gõ Riêng Phần Này (${activeItems.length} từ)
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(4, groups.length)} gap-2">
            ${groups.map((gName, idx) => {
              const count = currentDayObj.vocab.filter(v => (v.group || `Từ vựng Ngày ${currentDayObj.day}`) === gName).length;
              const isCurrent = idx === activeIdx;
              return `
                <button
                  type="button"
                  onclick="App.selectDayVocabPart(${idx})"
                  class="p-3 rounded-xl border text-left transition flex items-center justify-between gap-2 ${isCurrent ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-bold' : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50/50'}"
                >
                  <span class="text-xs truncate">${gName}</span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 ${isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}">${count} từ</span>
                </button>
              `;
            }).join("")}
          </div>
        </div>

        <div class="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          ${activeItems.map((v, i) => `
            <div class="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <span class="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 font-mono font-bold text-xs flex items-center justify-center shrink-0">${i + 1}</span>
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-extrabold text-slate-900 text-sm">${v.word}</span>
                    <span class="font-mono text-xs text-blue-600">${v.ipa}</span>
                  </div>
                  <p class="text-xs font-medium text-slate-600 truncate">${v.meaning}</p>
                </div>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                <button type="button" onclick="AudioEngine.speak('${v.word.replace(/'/g, "\\'")}', 1.0)" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs flex items-center justify-center">
                  <i class="fa-solid fa-volume-high"></i>
                </button>
                <button type="button" onclick="AudioEngine.speak('${v.word.replace(/'/g, "\\'")}', 0.65)" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs flex items-center justify-center">
                  🐢
                </button>
              </div>
            </div>
          `).join("")}
        </div>

        <div class="px-5 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button type="button" onclick="App.selectDayVocabPart(${Math.max(0, activeIdx - 1)})" ${activeIdx === 0 ? "disabled" : ""} class="px-4 py-2 rounded-xl bg-white border border-slate-300 disabled:opacity-40 text-xs font-bold text-slate-700">
            <i class="fa-solid fa-arrow-left mr-1"></i> Phần trước
          </button>
          <span class="text-xs font-mono font-bold text-slate-500">Phần ${activeIdx + 1} / ${groups.length}</span>
          ${activeIdx < groups.length - 1 ? `
            <button type="button" onclick="App.selectDayVocabPart(${activeIdx + 1})" class="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">
              Sang ${groups[activeIdx + 1]} <i class="fa-solid fa-arrow-right ml-1"></i>
            </button>
          ` : `
            <button type="button" onclick="App.switchRoadmapSubTab('grammar_parts')" class="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">
              Sang Mục 2: Ngữ Pháp <i class="fa-solid fa-arrow-right ml-1"></i>
            </button>
          `}
        </div>
      </div>
    `;
  },

  renderRoadmapDayGrammarParts(currentDayObj) {
    const sections = currentDayObj.grammarSections || [];
    if (!sections.length) return `<div class="academic-card p-6 text-xs text-slate-600">${currentDayObj.theory}</div>`;

    const activeGIdx = Math.min(this.state.activeDayGrammarPartIdx, sections.length - 1);
    const activeSec = sections[activeGIdx];
    const isInlineChecked = Boolean((this.state.inlineGrammarChecked || {})[currentDayObj.day]);
    const quizItems = (currentDayObj.assessment && activeSec.quizKey) ? (currentDayObj.assessment[activeSec.quizKey] || []) : [];
    const isInputQuiz = quizItems.length > 0 && quizItems[0].prompt !== undefined;

    return `
      <div class="academic-card overflow-hidden">
        <div class="p-5 bg-slate-50/70 border-b border-slate-200 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">C. GRAMMAR & PRACTICE TRONG FILE PDF</span>
              <h4 class="text-base font-extrabold text-slate-900 mt-0.5">${activeSec.title}</h4>
            </div>
            <span class="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              Phần ${activeGIdx + 1} / ${sections.length}
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-${Math.min(5, sections.length)} gap-2">
            ${sections.map((sec, idx) => `
              <button
                type="button"
                onclick="App.selectDayGrammarPart(${idx})"
                class="p-2.5 rounded-xl border text-left text-xs font-bold transition ${idx === activeGIdx ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50/50'}"
              >
                ${sec.shortTab || sec.title}
              </button>
            `).join("")}
          </div>
        </div>

        <div class="p-6 space-y-5">
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h5 class="text-xs font-extrabold uppercase text-slate-500">Lý thuyết & Quy tắc:</h5>
            <ul class="space-y-1.5 text-xs sm:text-sm text-slate-800 list-disc list-inside leading-relaxed">
              ${activeSec.rules.map(r => `<li>${r}</li>`).join("")}
            </ul>
          </div>

          <div class="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
            <span class="text-[11px] font-bold uppercase text-blue-700 block">Ví dụ minh họa:</span>
            ${activeSec.examples.map(ex => `<p class="text-xs sm:text-sm font-mono font-bold text-slate-900">• ${ex}</p>`).join("")}
          </div>

          ${quizItems.length > 0 ? `
            <div class="pt-4 border-t border-slate-200 space-y-3">
              <div class="flex items-center justify-between">
                <h5 class="text-xs font-extrabold uppercase text-indigo-600">
                  <i class="fa-solid fa-pen-clip mr-1"></i> Bài tập trong tài liệu PDF (${activeSec.quizKey.toUpperCase()})
                </h5>
                <button
                  type="button"
                  onclick="App.checkInlineGrammarQuiz(${currentDayObj.day})"
                  class="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition"
                >
                  Kiểm tra đáp án phần này
                </button>
              </div>

              ${isInputQuiz ? `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  ${quizItems.map(q => {
                    const userVal = this.state.roadmapTestInputs[q.id] || "";
                    const isOk = this.isGatekeeperInputCorrect(q, userVal);
                    return `
                      <div class="p-3.5 rounded-xl bg-slate-50 border ${isInlineChecked ? (isOk ? 'border-emerald-500 bg-emerald-50/30' : 'border-rose-400 bg-rose-50/30') : 'border-slate-200'} space-y-1.5">
                        <div class="flex justify-between text-xs"><strong class="text-slate-900">${q.prompt}</strong><span class="text-slate-400">${q.hint || ""}</span></div>
                        <input
                          type="text"
                          placeholder="Nhập đáp án tiếng Anh..."
                          value="${userVal.replace(/"/g, "&quot;")}"
                          oninput="App.onRoadmapTestInput('${q.id}', this.value)"
                          class="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold"
                        />
                        ${isInlineChecked ? `<p class="text-xs font-bold ${isOk ? 'text-emerald-600' : 'text-rose-600'}">${isOk ? `✓ Chính xác (${q.answer})` : `✗ Đáp án đúng: ${q.answer}`}</p>` : ""}
                      </div>
                    `;
                  }).join("")}
                </div>
              ` : `
                <div class="space-y-2.5">
                  ${quizItems.map(q => this.renderAssessmentMcqItem(q, isInlineChecked)).join("")}
                </div>
              `}
            </div>
          ` : ""}
        </div>

        <div class="px-5 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button type="button" onclick="App.selectDayGrammarPart(${Math.max(0, activeGIdx - 1)})" ${activeGIdx === 0 ? "disabled" : ""} class="px-4 py-2 rounded-xl bg-white border border-slate-300 disabled:opacity-40 text-xs font-bold text-slate-700">
            <i class="fa-solid fa-arrow-left mr-1"></i> Phần trước
          </button>
          ${activeGIdx < sections.length - 1 ? `
            <button type="button" onclick="App.selectDayGrammarPart(${activeGIdx + 1})" class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">
              Sang ${sections[activeGIdx + 1].shortTab} <i class="fa-solid fa-arrow-right ml-1"></i>
            </button>
          ` : `
            <button type="button" onclick="App.switchRoadmapSubTab('typing')" class="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm">
              Sang Mục 3: Luyện Gõ Từ Vựng <i class="fa-solid fa-arrow-right ml-1"></i>
            </button>
          `}
        </div>
      </div>
    `;
  },

  renderDistinctGatekeeperExamView(currentDayObj) {
    if (this.state.activeExamType === "AUDIO") {
      return this.renderListeningSpeakingExamView(currentDayObj);
    }

    const dayNum = currentDayObj.day;
    const questions = this.getGatekeeperQuestions(currentDayObj);
    const isSubmitted = Boolean(this.state.roadmapTestSubmitted[dayNum]);
    const scoreInfo = this.calculateRoadmapTestScore(dayNum);
    const passed80 = scoreInfo.percent >= 80;
    const neededMore = Math.max(0, scoreInfo.minRequired - scoreInfo.correct);
    const sections = [...new Set(questions.map(q => q.section))];

    return `
      <div class="space-y-6">
        <div class="rounded-2xl bg-slate-900 text-white p-6 shadow-xl border border-slate-800 space-y-4">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono font-extrabold text-[11px] uppercase">
                  <i class="fa-solid fa-trophy mr-1"></i> PHÒNG THI SÁT HẠCH QUA NGÀY ${dayNum}
                </span>
                <span class="px-2.5 py-0.5 rounded-md bg-white/10 text-cyan-300 font-mono text-xs font-semibold">
                  Điều kiện mở khóa Ngày ${dayNum + 1}: Đạt ≥ 80% (${scoreInfo.minRequired}/${scoreInfo.total} câu)
                </span>
              </div>
              <h3 class="text-lg sm:text-xl font-extrabold text-white">${currentDayObj.title} — Đề Thi Đánh Giá Năng Lực</h3>
              <p class="text-xs text-slate-300">
                Đề thi gồm <strong>${scoreInfo.total} câu hỏi sát hạch độc lập</strong> kiểm tra khả năng vận dụng thực tế.
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onclick="App.closeGatekeeperExam()"
                class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition whitespace-nowrap"
              >
                <i class="fa-solid fa-arrow-left mr-1"></i> Quay lại 3 mục bài học
              </button>
              <button
                type="button"
                onclick="App.resetRoadmapTest(${dayNum})"
                class="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition whitespace-nowrap"
              >
                <i class="fa-solid fa-rotate-left mr-1"></i> Làm mới đề
              </button>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-800 flex flex-wrap gap-2">
            <button
              type="button"
              onclick="App.switchExamMode('WRITTEN')"
              class="px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 bg-amber-400 text-slate-950 shadow-md"
            >
              <i class="fa-solid fa-file-pen"></i> 1. Đề Thi Đọc & Viết (PDF)
            </button>
            <button
              type="button"
              onclick="App.switchExamMode('AUDIO')"
              class="px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-cyan-500/30"
            >
              <i class="fa-solid fa-microphone-lines"></i> 2. Chuyển sang Kiểm Tra Nghe & Nói AI (15 câu)
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
                  <i class="fa-solid ${passed80 ? 'fa-award' : 'fa-circle-exclamation'}"></i>
                  ${passed80 ? 'CHỨNG NHẬN VƯỢT BẬC THANG (PASSED ≥ 80%)' : 'CHƯA ĐỦ 80% — CHƯA MỞ KHÓA NGÀY TIẾP THEO'}
                </span>
                <h4 class="text-base font-extrabold text-slate-900">
                  Bạn trả lời đúng ${scoreInfo.correct} / ${scoreInfo.total} câu (${scoreInfo.percent}%)
                </h4>
                <p class="text-xs text-slate-600">
                  ${passed80
                    ? `Xuất sắc! Bạn đã mở khóa thành công Bậc thang Ngày ${dayNum + 1}.`
                    : `Bạn cần đúng thêm ${neededMore} câu nữa để chạm mốc ${scoreInfo.minRequired}/${scoreInfo.total} câu (80%).`}
                </p>
              </div>
            </div>

            ${passed80 && dayNum < 48 ? `
              <button
                type="button"
                onclick="App.selectRoadmapDay(${dayNum + 1})"
                class="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md whitespace-nowrap transition flex items-center gap-2"
              >
                <i class="fa-solid fa-unlock"></i> Học Tiếp Ngày ${dayNum + 1} <i class="fa-solid fa-arrow-right"></i>
              </button>
            ` : `
              <button
                type="button"
                onclick="App.resetRoadmapTest(${dayNum})"
                class="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md whitespace-nowrap transition"
              >
                Làm Lại Đề Thi
              </button>
            `}
          </div>
        ` : ""}

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div class="lg:col-span-8 space-y-5">
            ${sections.map(secTitle => {
              const secQuestions = questions.filter(q => q.section === secTitle);
              return `
                <div class="academic-card p-6 space-y-4">
                  <h4 class="font-extrabold text-sm text-indigo-700 uppercase tracking-wider border-b border-slate-200 pb-2.5">
                    ${secTitle} (${secQuestions.length} câu)
                  </h4>

                  <div class="space-y-4">
                    ${secQuestions.map(q => {
                      if (q.type === "INPUT") {
                        const userVal = this.state.roadmapTestInputs[q.id] || "";
                        const isOk = this.isGatekeeperInputCorrect(q, userVal);
                        return `
                          <div id="exam-q-${q.id}" class="p-4 rounded-xl bg-slate-50 border ${isSubmitted ? (isOk ? 'border-emerald-500 bg-emerald-50/30' : 'border-rose-400 bg-rose-50/30') : 'border-slate-200'} space-y-2.5">
                            ${q.imageHtml || ""}
                            <p class="font-bold text-xs sm:text-sm text-slate-900">${q.prompt}</p>
                            <input
                              type="text"
                              placeholder="Nhập đáp án tiếng Anh của bạn..."
                              value="${userVal.replace(/"/g, "&quot;")}"
                              oninput="App.onRoadmapTestInput('${q.id}', this.value)"
                              class="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                            />
                            ${isSubmitted ? `
                              <div class="text-xs p-2.5 rounded-lg bg-white border border-slate-200">
                                <strong class="${isOk ? 'text-emerald-600' : 'text-rose-600'}">${isOk ? '✓ Chính xác!' : `✗ Chưa đúng (Đáp án chuẩn: ${q.answer})`}</strong> — ${q.explain}
                              </div>
                            ` : ""}
                          </div>
                        `;
                      }
                      return `<div id="exam-q-${q.id}">${this.renderAssessmentMcqItem(q, isSubmitted)}</div>`;
                    }).join("")}
                  </div>
                </div>
              `;
            }).join("")}
          </div>

          <div class="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
            <div class="academic-card p-5 space-y-4 border-2 border-indigo-100">
              <div class="border-b border-slate-200 pb-3">
                <h4 class="font-extrabold text-sm text-slate-900">Phiếu Trả Lời Sát Hạch</h4>
                <p class="text-[11px] text-slate-500">Đã làm: <strong>${scoreInfo.answered}/${scoreInfo.total}</strong> câu • Cần đúng: <strong>≥ ${scoreInfo.minRequired} câu (80%)</strong></p>
              </div>

              <div class="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden relative">
                <div
                  class="h-full transition-all duration-300 ${isSubmitted ? (passed80 ? 'bg-emerald-500' : 'bg-rose-500') : 'bg-indigo-600'}"
                  style="width: ${isSubmitted ? scoreInfo.percent : Math.round((scoreInfo.answered / scoreInfo.total) * 100)}%"
                ></div>
                <div class="absolute top-0 bottom-0 left-[80%] w-0.5 bg-slate-900"></div>
              </div>

              <div class="grid grid-cols-5 gap-2">
                ${questions.map((q, idx) => {
                  const isAnswered = q.type === "INPUT"
                    ? Boolean((this.state.roadmapTestInputs[q.id] || "").trim())
                    : this.state.roadmapTestChoices[q.id] !== undefined;
                  const isCorrect = q.type === "INPUT"
                    ? this.isGatekeeperInputCorrect(q, this.state.roadmapTestInputs[q.id] || "")
                    : this.state.roadmapTestChoices[q.id] === q.correct;

                  let boxClass = "bg-slate-100 text-slate-600 border-slate-200";
                  if (!isSubmitted && isAnswered) {
                    boxClass = "bg-indigo-600 text-white border-indigo-600 font-bold";
                  } else if (isSubmitted) {
                    boxClass = isCorrect
                      ? "bg-emerald-500 text-white border-emerald-600 font-bold"
                      : "bg-rose-500 text-white border-rose-600 font-bold";
                  }
                  return `
                    <a href="#exam-q-${q.id}" class="h-9 rounded-lg border text-xs font-mono flex items-center justify-center ${boxClass}">
                      ${idx + 1}
                    </a>
                  `;
                }).join("")}
              </div>

              <button
                type="button"
                onclick="App.submitRoadmapTest(${dayNum})"
                class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md transition"
              >
                <i class="fa-solid fa-paper-plane mr-1.5"></i> Nộp Bài & Chấm Điểm (≥ 80%)
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderAssessmentMcqItem(qItem, isSubmitted) {
    const chosen = this.state.roadmapTestChoices[qItem.id];
    const isCorrect = chosen === qItem.correct;
    return `
      <div class="p-4 rounded-xl bg-slate-50 border ${isSubmitted ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20') : 'border-slate-200'} space-y-2">
        <p class="font-bold text-xs sm:text-sm text-slate-900">${qItem.q}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          ${qItem.options.map((opt, optIdx) => {
            let btnStyle = "bg-white border-slate-200 text-slate-700 hover:border-blue-400";
            if (!isSubmitted && chosen === optIdx) btnStyle = "bg-blue-600 text-white border-blue-600 font-bold";
            else if (isSubmitted) {
              if (optIdx === qItem.correct) btnStyle = "bg-emerald-100 border-emerald-500 text-emerald-900 font-bold";
              else if (optIdx === chosen) btnStyle = "bg-rose-100 border-rose-500 text-rose-900 font-semibold";
            }
            return `<button type="button" onclick="App.selectRoadmapTestChoice('${qItem.id}', ${optIdx})" class="text-left px-4 py-2 rounded-lg border text-xs transition ${btnStyle}">${opt}</button>`;
          }).join("")}
        </div>
        ${isSubmitted ? `<div class="text-xs p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700"><strong>Giải thích:</strong> ${qItem.explain}</div>` : ""}
      </div>
    `;
  },

  renderRoadmap48() {
    const rm = window.Roadmap48Data;
    if (!rm) return `<div class="academic-card p-8 text-center">Đang tải dữ liệu...</div>`;

    const doneCount = Object.values(this.state.completedRoadmapDays).filter(Boolean).length;
    const percent48 = Math.round((doneCount / 48) * 100);
    const currentDayObj = rm.days.find(d => d.day === this.state.activeRoadmapDay) || rm.days[0];
    const currentPhaseObj = rm.phases.find(p => p.id === this.state.activeRoadmapPhase) || rm.phases[0];
    const phaseDays = rm.days.filter(d => d.phaseId === currentPhaseObj.id);
    const groups = [...new Set((currentDayObj.vocab || []).map(v => v.group || `Từ vựng Ngày ${currentDayObj.day}`))];
    const grammarCount = (currentDayObj.grammarSections || []).length || 1;
    const activeTypingUnit = this.getUnitById(this.getActiveDayTypingUnitId());

    if (this.state.isExamModalOpen) {
      return this.renderDistinctGatekeeperExamView(currentDayObj);
    }

    return `
      <div class="space-y-5">
        <div class="academic-card overflow-hidden">
          <div class="p-5 bg-gradient-to-r from-blue-50/80 via-white to-emerald-50/70 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <span class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase">
                <i class="fa-solid fa-shield-halved"></i> Yêu cầu đạt ≥ 80% bài thi sát hạch để qua ngày mới
              </span>
              <h2 class="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">${rm.title}</h2>
            </div>
            <div class="flex items-center gap-3.5 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm shrink-0">
              <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-mono font-extrabold text-xs">${percent48}%</div>
              <div class="whitespace-nowrap">
                <span class="text-[10px] font-bold uppercase text-slate-400 block">Đã vượt ải (≥80%)</span>
                <span class="text-xs font-extrabold text-slate-900">${doneCount} / 48 Bậc Hoàn Thành</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-white">
            ${rm.phases.map((p, idx) => {
              const pDays = rm.days.filter(d => d.phaseId === p.id);
              const phaseDone = pDays.filter(d => this.state.completedRoadmapDays[d.day]).length;
              const isActive = this.state.activeRoadmapPhase === p.id;
              return `
                <button onclick="App.selectRoadmapPhase('${p.id}')" class="step-tab p-3.5 text-left flex flex-col justify-between gap-1 ${isActive ? 'active' : 'hover:bg-slate-50'}">
                  <div class="flex items-center justify-between gap-2 w-full">
                    <span class="text-[10px] font-bold uppercase whitespace-nowrap ${isActive ? 'text-blue-600' : 'text-slate-400'}">Chặng ${idx + 1} (Ngày ${pDays[0].day}–${pDays[pDays.length - 1].day})</span>
                    <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">${phaseDone}/12</span>
                  </div>
                  <p class="text-xs font-extrabold text-slate-900 line-clamp-1">${p.title}</p>
                </button>
              `;
            }).join("")}
          </div>
        </div>

        ${this.renderVisualStaircaseSelector(currentPhaseObj, phaseDays)}

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div class="lg:col-span-8 space-y-4">
            <div class="academic-card p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <span class="px-3 py-2 rounded-xl bg-slate-900 text-white font-mono font-extrabold text-xs whitespace-nowrap inline-flex items-center gap-1.5 shrink-0">
                <i class="fa-solid fa-stairs text-amber-400"></i> NGÀY ${String(currentDayObj.day).padStart(2, "0")}
              </span>

              <div class="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl flex-1">
                <button
                  type="button"
                  onclick="App.switchRoadmapSubTab('vocab_parts')"
                  class="px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${this.state.activeRoadmapSubTab === 'vocab_parts' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'}"
                >
                  1. Từ Vựng (${groups.length} phần)
                </button>
                <button
                  type="button"
                  onclick="App.switchRoadmapSubTab('grammar_parts')"
                  class="px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${this.state.activeRoadmapSubTab === 'grammar_parts' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'}"
                >
                  2. Ngữ Pháp (${grammarCount} phần)
                </button>
                <button
                  type="button"
                  onclick="App.switchRoadmapSubTab('typing')"
                  class="px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${this.state.activeRoadmapSubTab === 'typing' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'}"
                >
                  3. Luyện Gõ
                </button>
              </div>
            </div>

            ${this.state.activeRoadmapSubTab === "typing" && groups.length > 1 ? `
              <div class="academic-card p-3 flex flex-wrap items-center justify-between gap-2 bg-blue-50/40 border-blue-200">
                <span class="text-xs font-bold text-slate-700">Chọn phần từ vựng muốn gõ:</span>
                <div class="flex flex-wrap gap-1.5">
                  <button type="button" onclick="App.setDayTypingScope('ALL')" class="px-3 py-1 rounded-lg text-xs font-bold ${this.state.activeDayTypingScope === 'ALL' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border'}">Tất cả (${currentDayObj.vocab.length} từ)</button>
                  ${groups.map((gName, idx) => `<button type="button" onclick="App.setDayTypingScope('${idx}')" class="px-3 py-1 rounded-lg text-xs font-bold ${this.state.activeDayTypingScope === String(idx) ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border'}">${gName}</button>`).join("")}
                </div>
              </div>
            ` : ""}

            ${this.state.activeRoadmapSubTab === "vocab_parts" ? this.renderRoadmapDayVocabParts(currentDayObj) : ""}
            ${this.state.activeRoadmapSubTab === "grammar_parts" ? this.renderRoadmapDayGrammarParts(currentDayObj) : ""}
            ${this.state.activeRoadmapSubTab === "typing" ? this.renderStep2Typing(activeTypingUnit) : ""}
          </div>

          <div class="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
            <div class="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 shadow-lg border border-indigo-500/30 space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono font-extrabold text-[10px] uppercase">
                  GATEKEEPER EXAM • ≥ 80%
                </span>
                <span class="text-xs font-mono text-indigo-300">Ngày ${currentDayObj.day} → Ngày ${currentDayObj.day + 1}</span>
              </div>
              <h4 class="font-extrabold text-sm text-white">Hệ Thống Kiểm Tra Qua Ngày ${currentDayObj.day}</h4>
              <p class="text-[11px] text-slate-300 leading-relaxed">
                Chọn 1 trong 2 hình thức kiểm tra sát hạch dưới đây và đạt tối thiểu <strong>80%</strong> để mở khóa <strong>Ngày ${currentDayObj.day + 1}</strong>:
              </p>

              <div class="space-y-2 pt-1">
                <button
                  type="button"
                  onclick="App.openGatekeeperExam('WRITTEN')"
                  class="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <i class="fa-solid fa-file-pen"></i> 1. Thi Đọc & Viết (Đề PDF Ngày ${currentDayObj.day})
                </button>

                <button
                  type="button"
                  onclick="App.openGatekeeperExam('AUDIO')"
                  class="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <i class="fa-solid fa-microphone-lines"></i> 2. Kiểm Tra Nghe & Nói AI (15 câu)
                </button>
              </div>
            </div>

            <div class="academic-card p-5 space-y-4">
              <div class="border-b border-slate-200 pb-3">
                <h4 class="font-bold text-sm text-slate-900">Các Bậc Thang Trong Chặng</h4>
                <p class="text-[11px] text-slate-500">Đạt ≥ 80% phòng thi sát hạch để mở bậc kế tiếp</p>
              </div>

              <div class="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                ${phaseDays.map((d) => {
                  const isDone = Boolean(this.state.completedRoadmapDays[d.day]);
                  const isUnlocked = this.isRoadmapDayUnlocked(d.day);
                  const isCurrent = this.state.activeRoadmapDay === d.day;
                  const best = (this.state.roadmapBestScores || {})[d.day] || (this.state.audioBestScores || {})[d.day];

                  let rowStyle = "bg-slate-50 text-slate-400 border-slate-200 opacity-75 cursor-not-allowed";
                  if (isUnlocked) rowStyle = "bg-white text-slate-800 border-slate-200 hover:border-blue-400";
                  if (isDone) rowStyle = "bg-emerald-50/70 text-emerald-950 border-emerald-300";
                  if (isCurrent) rowStyle = "bg-blue-600 text-white border-blue-700 shadow-md";

                  return `
                    <button
                      type="button"
                      onclick="App.selectRoadmapDay(${d.day})"
                      class="w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-3 transition ${rowStyle}"
                    >
                      <div class="flex items-center gap-3 min-w-0 flex-1">
                        <span class="w-14 py-1.5 rounded-lg font-mono font-extrabold text-[11px] text-center whitespace-nowrap shrink-0 ${isCurrent ? 'bg-amber-400 text-slate-950' : isDone ? 'bg-emerald-600 text-white' : isUnlocked ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'}">
                          Bậc ${d.day}
                        </span>
                        <div class="min-w-0 flex-1">
                          <p class="text-xs font-bold truncate">${d.isPlaceholder ? `Ngày ${d.day}` : d.title.replace(/^UNIT \d+:\s*/i, "")}</p>
                          <p class="text-[10px] truncate mt-0.5 ${isCurrent ? 'text-blue-100' : 'text-slate-500'}">
                            ${isDone ? `✓ Đã vượt ải (${best || 100}%)` : isUnlocked ? "🔓 Đang mở — Cần thi ≥ 80%" : `🔒 Khóa (Cần qua Ngày ${d.day - 1})`}
                          </p>
                        </div>
                      </div>
                      <span class="w-5 text-center text-xs shrink-0">
                        ${isDone
                          ? `<i class="fa-solid fa-circle-check ${isCurrent ? 'text-amber-300' : 'text-emerald-600'}"></i>`
                          : isUnlocked
                          ? `<i class="fa-solid fa-unlock ${isCurrent ? 'text-white' : 'text-blue-600'}"></i>`
                          : `<i class="fa-solid fa-lock text-slate-400"></i>`}
                      </span>
                    </button>
                  `;
                }).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
});