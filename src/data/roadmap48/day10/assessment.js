window.Day10Assessment = {
  // 1. Bài tập hiển thị trực tiếp trong Tab "2. Ngữ Pháp" (Từ file NGÀY 10.pdf)
  quiz1: [
    { id: "d10-q1-1", q: "Question 1. Lam _______ now.", options: ["A. is swimming", "B. are swimming"], correct: 0, explain: "Chủ ngữ tên riêng số ít 'Lam' đi với 'is swimming' (swim nhân đôi phụ âm m)." },
    { id: "d10-q1-2", q: "Question 2. They _______ to work now.", options: ["A. are driving", "B. is driving"], correct: 0, explain: "Chủ ngữ 'They' đi với 'are driving' (drive bỏ e thêm -ing)." },
    { id: "d10-q1-3", q: "Question 3. My grandfather _______ tea at present.", options: ["A. are drinking", "B. is drinking"], correct: 1, explain: "Chủ ngữ số ít 'My grandfather' (ông của tôi) đi với 'is drinking'." },
    { id: "d10-q1-4", q: "Question 4. It _______ at the moment.", options: ["A. is raining", "B. is rainning"], correct: 0, explain: "Động từ 'rain' có 2 nguyên âm 'a-i' đứng trước 'n' nên KHÔNG nhân đôi phụ âm n → 'is raining'." }
  ],

  practice: [
    { id: "d10-p-1", q: "Question 1. Her baby _______ now.", options: ["A. is sleeping", "B. are sleeping"], correct: 0, explain: "Chủ ngữ số ít 'Her baby' đi với 'is sleeping'." },
    { id: "d10-p-2", q: "Question 2. Are they _______ breakfast at the moment?", options: ["A. having", "B. haveing"], correct: 0, explain: "Động từ 'have' kết thúc bằng 'e' nên phải bỏ 'e' trước khi thêm '-ing' → 'having'." },
    { id: "d10-p-3", q: "Question 3. Tom _______ his sister-in-law a letter.", options: ["A. are giving", "B. is giving"], correct: 1, explain: "Chủ ngữ tên riêng số ít 'Tom' đi với 'is giving'." },
    { id: "d10-p-4", q: "Question 4. His daughter _______ the cats at present.", options: ["A. is feeding", "B. are feeding"], correct: 0, explain: "Chủ ngữ số ít 'His daughter' (con gái anh ấy) đi với 'is feeding'." },
    { id: "d10-p-5", q: "Question 5. It _______ right now.", options: ["A. are snowing", "B. is snowing"], correct: 1, explain: "Chủ ngữ 'It' đi với 'is snowing'." },
    { id: "d10-p-6", q: "Question 6. My parents _______ in the living room now.", options: ["A. are talking", "B. is talking"], correct: 0, explain: "Chủ ngữ số nhiều 'My parents' (bố mẹ tôi) đi với 'are talking'." },
    { id: "d10-p-7", q: "Question 7. Her son _______ on the sofa now.", options: ["A. isn't resting", "B. aren't resting"], correct: 0, explain: "Chủ ngữ số ít 'Her son' đi với 'isn't resting'." },
    { id: "d10-p-8", q: "Question 8. _______ they flying to New York on Thursday?", options: ["A. Is", "B. Are"], correct: 1, explain: "Chủ ngữ 'they' đi với động từ to be 'Are' đảo lên đầu câu." },
    { id: "d10-p-9", q: "Question 9. Listen! Henry _______.", options: ["A. is singing", "B. are singing"], correct: 0, explain: "Chủ ngữ tên riêng số ít 'Henry' đi với 'is singing'." },
    { id: "d10-p-10", q: "Question 10. Is her friend _______ on the keyboard now?", options: ["A. typeing", "B. typing"], correct: 1, explain: "Động từ 'type' kết thúc bằng 'e' nên phải bỏ 'e' rồi thêm '-ing' → 'typing'." },
    { id: "d10-p-11", q: "Question 11. Look! A man _______ in the yard.", options: ["A. are standing", "B. is standing"], correct: 1, explain: "Chủ ngữ số ít 'A man' (một người đàn ông) đi với 'is standing'." },
    { id: "d10-p-12", q: "Question 12. Her classmates _______ now.", options: ["A. isn't listening", "B. aren't listening"], correct: 1, explain: "Chủ ngữ số nhiều 'Her classmates' đi với 'aren't listening'." },
    { id: "d10-p-13", q: "Question 13. My father _______ at his desk at the moment.", options: ["A. are working", "B. is working"], correct: 1, explain: "Chủ ngữ số ít 'My father' đi với 'is working'." },
    { id: "d10-p-14", q: "Question 14. Is David _______ the gate now?", options: ["A. closing", "B. closeing"], correct: 0, explain: "Động từ 'close' kết thúc bằng 'e' nên bỏ 'e' rồi thêm '-ing' → 'closing'." },
    { id: "d10-p-15", q: "Question 15. We _______ coffee at present.", options: ["A. isn't drinking", "B. aren't drinking"], correct: 1, explain: "Chủ ngữ 'We' đi với 'aren't drinking'." }
  ],

  // 2. ĐỀ THI ONLINE UNIT 10 (20 CÂU TRÍCH XUẤT 100% TỪ FILE "NGÀY 10- kiểm tra.pdf")
  gatekeeperExam: [
    // BÀI 1: Chuyển các động từ sau sang dạng 'V-ing' (5 câu tự luận)
    {
      id: "gk10-1",
      type: "INPUT",
      section: "Bài 1: Chuyển các động từ sau sang dạng 'V-ing' (5 câu)",
      prompt: "Câu 1: set (lặn / đặt) → Chuyển sang dạng V-ing:",
      answer: "setting",
      acceptedAnswers: ["setting"],
      explain: "Động từ 'set' kết thúc bằng 1 phụ âm 't', trước nó là 1 nguyên âm duy nhất 'e' nên nhân đôi 't' trước khi thêm -ing → setting."
    },
    {
      id: "gk10-2",
      type: "INPUT",
      section: "Bài 1: Chuyển các động từ sau sang dạng 'V-ing' (5 câu)",
      prompt: "Câu 2: close (đóng lại) → Chuyển sang dạng V-ing:",
      answer: "closing",
      acceptedAnswers: ["closing"],
      explain: "Động từ 'close' kết thúc bằng chữ 'e' nên bỏ 'e' rồi thêm -ing → closing."
    },
    {
      id: "gk10-3",
      type: "INPUT",
      section: "Bài 1: Chuyển các động từ sau sang dạng 'V-ing' (5 câu)",
      prompt: "Câu 3: run (chạy) → Chuyển sang dạng V-ing:",
      answer: "running",
      acceptedAnswers: ["running"],
      explain: "Động từ 'run' kết thúc bằng 1 phụ âm 'n', trước nó là 1 nguyên âm duy nhất 'u' nên nhân đôi 'n' trước khi thêm -ing → running."
    },
    {
      id: "gk10-4",
      type: "INPUT",
      section: "Bài 1: Chuyển các động từ sau sang dạng 'V-ing' (5 câu)",
      prompt: "Câu 4: work (làm việc) → Chuyển sang dạng V-ing:",
      answer: "working",
      acceptedAnswers: ["working"],
      explain: "Động từ 'work' kết thúc bằng 2 phụ âm 'rk' nên chỉ cần thêm -ing → working."
    },
    {
      id: "gk10-5",
      type: "INPUT",
      section: "Bài 1: Chuyển các động từ sau sang dạng 'V-ing' (5 câu)",
      prompt: "Câu 5: live (sống) → Chuyển sang dạng V-ing:",
      answer: "living",
      acceptedAnswers: ["living"],
      explain: "Động từ 'live' kết thúc bằng chữ 'e' nên bỏ 'e' rồi thêm -ing → living."
    },

    // BÀI 2: Chia dạng thì hiện tại tiếp diễn của các động từ trong ngoặc vào chỗ trống (5 câu)
    {
      id: "gk10-6",
      type: "INPUT",
      section: "Bài 2: Chia thì hiện tại tiếp diễn của động từ trong ngoặc (5 câu)",
      prompt: "Câu 6 (Question 1): I _______ (rest) in my room now.",
      answer: "am resting",
      acceptedAnswers: ["am resting", "'m resting"],
      explain: "Chủ ngữ 'I' ở thì hiện tại tiếp diễn đi với 'am + V-ing' → 'am resting'."
    },
    {
      id: "gk10-7",
      type: "INPUT",
      section: "Bài 2: Chia thì hiện tại tiếp diễn của động từ trong ngoặc (5 câu)",
      prompt: "Câu 7 (Question 2): It _______ (not/rain) now.",
      answer: "isn't raining",
      acceptedAnswers: ["isn't raining", "is not raining", "'s not raining"],
      explain: "Chủ ngữ 'It' ở thể phủ định hiện tại tiếp diễn đi với 'is not raining' (hoặc viết tắt 'isn't raining')."
    },
    {
      id: "gk10-8",
      type: "INPUT",
      section: "Bài 2: Chia thì hiện tại tiếp diễn của động từ trong ngoặc (5 câu)",
      prompt: "Câu 8 (Question 3): My mother _______ (phone) my dentist now.",
      answer: "is phoning",
      acceptedAnswers: ["is phoning", "'s phoning"],
      explain: "Chủ ngữ số ít 'My mother' đi với 'is' + 'phone' (bỏ e thêm -ing) → 'is phoning'."
    },
    {
      id: "gk10-9",
      type: "INPUT",
      section: "Bài 2: Chia thì hiện tại tiếp diễn của động từ trong ngoặc (5 câu)",
      prompt: "Câu 9 (Question 4): She _______ (write) a letter right now.",
      answer: "is writing",
      acceptedAnswers: ["is writing", "'s writing"],
      explain: "Chủ ngữ 'She' đi với 'is' + 'write' (bỏ e thêm -ing) → 'is writing'."
    },
    {
      id: "gk10-10",
      type: "INPUT",
      section: "Bài 2: Chia thì hiện tại tiếp diễn của động từ trong ngoặc (5 câu)",
      prompt: "Câu 10 (Question 5): We _______ (talk) in the yard at present.",
      answer: "are talking",
      acceptedAnswers: ["are talking", "'re talking"],
      explain: "Chủ ngữ 'We' đi với 'are talking'."
    },

    // BÀI 3: Chọn đáp án đúng A, B, C (10 câu trắc nghiệm)
    {
      id: "gk10-11",
      type: "MCQ",
      section: "Bài 3: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 11 (Question 1): Look! The sun _______.",
      options: ["A. rises", "B. is rising", "C. are rising"],
      correct: 1,
      explain: "Có dấu hiệu 'Look!' ở đầu câu và chủ ngữ số ít 'The sun' nên chia hiện tại tiếp diễn: 'B. is rising'."
    },
    {
      id: "gk10-12",
      type: "MCQ",
      section: "Bài 3: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 12 (Question 2): Luke _______ Maths in his bedroom now.",
      options: ["A. study", "B. don't study", "C. is studying"],
      correct: 2,
      explain: "Có dấu hiệu 'now' và chủ ngữ số ít 'Luke' nên chọn 'C. is studying'."
    },
    {
      id: "gk10-13",
      type: "MCQ",
      section: "Bài 3: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 13 (Question 3): His sister _______ the flowers in the garden right now.",
      options: ["A. is watering", "B. water", "C. don't water"],
      correct: 0,
      explain: "Có dấu hiệu 'right now' và chủ ngữ số ít 'His sister' nên chọn 'A. is watering'."
    },
    {
      id: "gk10-14",
      type: "MCQ",
      section: "Bài 3: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 14 (Question 4): _______ your children _______ cartoons now?",
      options: ["A. Do – watch", "B. Does – watch", "C. Are – watching"],
      correct: 2,
      explain: "Có dấu hiệu 'now' ở câu hỏi và chủ ngữ số nhiều 'your children' nên chọn 'C. Are – watching'."
    },
    {
      id: "gk10-15",
      type: "MCQ",
      section: "Bài 3: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 15 (Question 5): Listen! Kate _______ in her room.",
      options: ["A. doesn't sing", "B. sings", "C. is singing"],
      correct: 2,
      explain: "Có động từ gây chú ý 'Listen!' và chủ ngữ số ít 'Kate' nên chọn 'C. is singing'."
    },
    {
      id: "gk10-16",
      type: "MCQ",
      section: "Bài 3: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 16 (Question 6): He _______ in the garden at the moment.",
      options: ["A. are standing", "B. is standing", "C. stand"],
      correct: 1,
      explain: "Dấu hiệu 'at the moment' và chủ ngữ 'He' đi với 'B. is standing'."
    },
    {
      id: "gk10-17",
      type: "MCQ",
      section: "Bài 3: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 17 (Question 7): Mike _______ his grandparents at the moment.",
      options: ["A. visits", "B. is visiting", "C. are visiting"],
      correct: 1,
      explain: "Dấu hiệu 'at the moment' và chủ ngữ tên riêng số ít 'Mike' đi với 'B. is visiting'."
    },
    {
      id: "gk10-18",
      type: "MCQ",
      section: "Bài 3: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 18 (Question 8): The students _______ to their teacher now.",
      options: ["A. is listening", "B. listens", "C. are listening"],
      correct: 2,
      explain: "Dấu hiệu 'now' và chủ ngữ số nhiều 'The students' đi với 'C. are listening'."
    },
    {
      id: "gk10-19",
      type: "MCQ",
      section: "Bài 3: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 19 (Question 9): At present, Ly _______ for the bus.",
      options: ["A. is waiting", "B. waits", "C. are waiting"],
      correct: 0,
      explain: "Dấu hiệu 'At present' và chủ ngữ tên riêng số ít 'Ly' đi với 'A. is waiting'."
    },
    {
      id: "gk10-20",
      type: "MCQ",
      section: "Bài 3: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 20 (Question 10): She _______ the kitchen now.",
      options: ["A. isn't cleaning", "B. don't clean", "C. aren't cleaning"],
      correct: 0,
      explain: "Dấu hiệu 'now' và chủ ngữ số ít 'She' ở thể phủ định đi với 'A. isn't cleaning'."
    }
  ]
};