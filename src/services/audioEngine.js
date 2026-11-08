window.AudioEngine = {
  recognitionInstance: null,
  isListening: false,

  // Phát âm chuẩn US (Text-to-Speech)
  speak(text, rate = 1.0) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = String(text)
      .replace(/^\d+\.\s*/, "")
      .replace(/_______/g, "blank")
      .replace(/→.*$/, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      v => v.lang.includes("en-US") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Microsoft"))
    );
    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
  },

  // Nhận diện giọng nói qua Microphone (Speech-to-Text)
  startListening({ onStart, onResult, onError, onEnd }) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onError) {
        onError("Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói. Vui lòng mở bằng Google Chrome hoặc Microsoft Edge.");
      }
      return;
    }

    if (this.recognitionInstance && this.isListening) {
      try {
        this.recognitionInstance.stop();
      } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    this.recognitionInstance = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      this.isListening = true;
      if (onStart) onStart();
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript || "";
      const confidence = event.results[0][0].confidence || 0.9;
      if (onResult) onResult(transcript, confidence);
    };

    recognition.onerror = (event) => {
      this.isListening = false;
      let msg = "Không nhận diện được giọng nói. Hãy kiểm tra lại Microphone.";
      if (event.error === "not-allowed") {
        msg = "Bạn chưa cấp quyền Microphone cho trình duyệt (Hãy bấm Cho phép / Allow ở thanh địa chỉ).";
      } else if (event.error === "no-speech") {
        msg = "Chưa nghe thấy giọng đọc của bạn. Hãy nói to và rõ hơn nhé!";
      }
      if (onError) onError(msg);
    };

    recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      recognition.start();
    } catch (e) {
      this.isListening = false;
      if (onError) onError("Không thể khởi động Microphone.");
    }
  },

  // Thuật toán chấm điểm độ chính xác phát âm (0 - 100%)
  gradePronunciation(targetText, spokenText) {
    const normalize = (s) =>
      String(s || "")
        .toLowerCase()
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const cleanTarget = normalize(targetText);
    const cleanSpoken = normalize(spokenText);

    if (!cleanSpoken) return { score: 0, passed: false, wordBreakdown: [] };
    if (cleanTarget === cleanSpoken) {
      const words = cleanTarget.split(" ").map(w => ({ word: w, ok: true }));
      return { score: 100, passed: true, wordBreakdown: words };
    }

    const targetWords = cleanTarget.split(" ");
    const spokenWords = cleanSpoken.split(" ");

    let matchedCount = 0;
    const wordBreakdown = targetWords.map(tw => {
      const isMatched = spokenWords.includes(tw);
      if (isMatched) matchedCount++;
      return { word: tw, ok: isMatched };
    });

    // Kết hợp điểm khớp từ và khoảng cách ký tự Levenshtein
    const wordScore = Math.round((matchedCount / targetWords.length) * 100);
    const charSim = this.stringSimilarity(cleanTarget, cleanSpoken);
    const finalScore = Math.max(wordScore, charSim);

    return {
      score: finalScore,
      passed: finalScore >= 80,
      wordBreakdown
    };
  },

  stringSimilarity(a, b) {
    if (!a.length || !b.length) return 0;
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] =
          b.charAt(i - 1) === a.charAt(j - 1)
            ? matrix[i - 1][j - 1]
            : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
    const maxLen = Math.max(a.length, b.length);
    const distance = matrix[b.length][a.length];
    return Math.round(((maxLen - distance) / maxLen) * 100);
  },

  playTone(type = "success") {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "success") {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      } else {
        osc.frequency.setValueAtTime(240, ctx.currentTime);
        osc.frequency.setValueAtTime(180, ctx.currentTime + 0.1);
      }

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {}
  }
};