window.Day06Assessment = {
  // 1. Bài tập hiển thị trực tiếp trong Tab "2. Ngữ Pháp" (Từ file NGÀY 6.pdf)
  quiz1: [
    { id: "d6-q1-1", q: "Question 1. Luke _______ live with his parents.", options: ["A. doesn't", "B. don't"], correct: 0, explain: "Chủ ngữ tên riêng số ít 'Luke' (ngôi He) đi với trợ động từ phủ định 'doesn't'." },
    { id: "d6-q1-2", q: "Question 2. I _______ like swimming.", options: ["A. does not", "B. do not"], correct: 1, explain: "Chủ ngữ 'I' đi với trợ động từ phủ định 'do not' (don't)." },
    { id: "d6-q1-3", q: "Question 3. His grandfather _______ in his flat.", options: ["A. doesn't live", "B. doesn't lives"], correct: 0, explain: "Sau trợ động từ 'doesn't', động từ chính phải giữ nguyên mẫu là 'live' (không thêm -s)." },
    { id: "d6-q1-4", q: "Question 4. They _______ to school by train.", options: ["A. doesn't go", "B. don't go"], correct: 1, explain: "Chủ ngữ số nhiều 'They' đi với 'don't go'." }
  ],

  practice: [
    { id: "d6-p-1", q: "Question 1. John _______ like swimming.", options: ["A. doesn't", "B. don't"], correct: 0, explain: "Chủ ngữ tên riêng số ít 'John' đi với 'doesn't'." },
    { id: "d6-p-2", q: "Question 2. They _______ drive to work.", options: ["A. don't", "B. doesn't"], correct: 0, explain: "Chủ ngữ số nhiều 'They' đi với 'don't'." },
    { id: "d6-p-3", q: "Question 3. My son _______ get up at 6.30.", options: ["A. doesn't", "B. don't"], correct: 0, explain: "Chủ ngữ số ít 'My son' (con trai tôi) đi với 'doesn't'." },
    { id: "d6-p-4", q: "Question 4. Linda _______ teach English.", options: ["A. don't", "B. doesn't"], correct: 1, explain: "Chủ ngữ tên riêng số ít 'Linda' đi với 'doesn't'." },
    { id: "d6-p-5", q: "Question 5. He _______ the flat with his brother.", options: ["A. don't share", "B. doesn't share"], correct: 1, explain: "Chủ ngữ số ít 'He' đi với 'doesn't share'." },
    { id: "d6-p-6", q: "Question 6. They _______ in the morning.", options: ["A. don't jog", "B. doesn't jog"], correct: 0, explain: "Chủ ngữ số nhiều 'They' đi với 'don't jog'." },
    { id: "d6-p-7", q: "Question 7. His daughter _______ at that café.", options: ["A. doesn't work", "B. doesn't works"], correct: 0, explain: "Sau 'doesn't' động từ giữ nguyên mẫu là 'work' → 'doesn't work'." },
    { id: "d6-p-8", q: "Question 8. My father _______ these plants.", options: ["A. doesn't waters", "B. doesn't water"], correct: 1, explain: "Sau 'doesn't' động từ giữ nguyên mẫu là 'water' → 'doesn't water'." },
    { id: "d6-p-9", q: "Question 9. His cousin _______ free time.", options: ["A. doesn't has", "B. doesn't have"], correct: 1, explain: "Sau 'doesn't' động từ phải đưa về nguyên mẫu 'have' → 'doesn't have'." },
    { id: "d6-p-10", q: "Question 10. We _______ at the weekend.", options: ["A. don't work", "B. doesn't work"], correct: 0, explain: "Chủ ngữ số nhiều 'We' đi với 'don't work'." }
  ],

  practice2: [
    {
      id: "d6-p2-11",
      prompt: "Question 11. My mother buys food at the supermarket.",
      hint: "Đổi buys → doesn't buy",
      answer: "My mother doesn't buy food at the supermarket.",
      acceptedAnswers: [
        "my mother doesn't buy food at the supermarket",
        "my mother does not buy food at the supermarket"
      ]
    },
    {
      id: "d6-p2-12",
      prompt: "Question 12. They work at this hospital.",
      hint: "Đổi work → don't work",
      answer: "They don't work at this hospital.",
      acceptedAnswers: [
        "they don't work at this hospital",
        "they do not work at this hospital"
      ]
    },
    {
      id: "d6-p2-13",
      prompt: "Question 13. Trung likes ice cream.",
      hint: "Đổi likes → doesn't like",
      answer: "Trung doesn't like ice cream.",
      acceptedAnswers: [
        "trung doesn't like ice cream",
        "trung does not like ice cream"
      ]
    },
    {
      id: "d6-p2-14",
      prompt: "Question 14. I go to the gym.",
      hint: "Đổi go → don't go",
      answer: "I don't go to the gym.",
      acceptedAnswers: [
        "i don't go to the gym",
        "i do not go to the gym"
      ]
    },
    {
      id: "d6-p2-15",
      prompt: "Question 15. My grandfather eats meat.",
      hint: "Đổi eats → doesn't eat",
      answer: "My grandfather doesn't eat meat.",
      acceptedAnswers: [
        "my grandfather doesn't eat meat",
        "my grandfather does not eat meat"
      ]
    }
  ],

  // 2. ĐỀ THI ONLINE UNIT 6 (20 CÂU TRÍCH XUẤT 100% TỪ FILE "NGÀY 6- kiểm tra.pdf")
  gatekeeperExam: [
    // BÀI 1: Nối các chủ ngữ ở cột bên trái với trợ động từ phủ định 'don't / doesn't' phù hợp (5 câu)
    {
      id: "gk6-1",
      type: "MCQ",
      section: "Bài 1: Nối chủ ngữ với trợ động từ phủ định 'don't' hoặc 'doesn't' (5 câu)",
      q: "Câu 1: Chủ ngữ 'Our teacher' (Giáo viên của chúng tôi - 1 người số ít) đi với trợ động từ nào?",
      options: ["A. don't", "B. doesn't"],
      correct: 1,
      explain: "'Our teacher' là danh từ đếm được số ít (tương đương He/She) nên đi với 'doesn't'."
    },
    {
      id: "gk6-2",
      type: "MCQ",
      section: "Bài 1: Nối chủ ngữ với trợ động từ phủ định 'don't' hoặc 'doesn't' (5 câu)",
      q: "Câu 2: Chủ ngữ 'We' (Chúng tôi) đi với trợ động từ nào?",
      options: ["A. don't", "B. doesn't"],
      correct: 0,
      explain: "Chủ ngữ 'We' đi với trợ động từ phủ định 'don't'."
    },
    {
      id: "gk6-3",
      type: "MCQ",
      section: "Bài 1: Nối chủ ngữ với trợ động từ phủ định 'don't' hoặc 'doesn't' (5 câu)",
      q: "Câu 3: Chủ ngữ 'Her father' (Bố của cô ấy - số ít) đi với trợ động từ nào?",
      options: ["A. don't", "B. doesn't"],
      correct: 1,
      explain: "'Her father' là danh từ số ít (tương đương ngôi He) nên đi với 'doesn't'."
    },
    {
      id: "gk6-4",
      type: "MCQ",
      section: "Bài 1: Nối chủ ngữ với trợ động từ phủ định 'don't' hoặc 'doesn't' (5 câu)",
      q: "Câu 4: Chủ ngữ 'My cat' (Con mèo của tôi - số ít) đi với trợ động từ nào?",
      options: ["A. don't", "B. doesn't"],
      correct: 1,
      explain: "'My cat' là danh từ số ít (tương đương ngôi It) nên đi với 'doesn't'."
    },
    {
      id: "gk6-5",
      type: "MCQ",
      section: "Bài 1: Nối chủ ngữ với trợ động từ phủ định 'don't' hoặc 'doesn't' (5 câu)",
      q: "Câu 5: Chủ ngữ 'You' (Bạn / Các bạn) đi với trợ động từ nào?",
      options: ["A. don't", "B. doesn't"],
      correct: 0,
      explain: "Chủ ngữ 'You' luôn đi với trợ động từ phủ định 'don't'."
    },

    // BÀI 2: Chọn đáp án đúng A, B, C (10 câu - Question 1 -> Question 10)
    {
      id: "gk6-6",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 6 (Question 1): My teacher _______ to music in her free time.",
      options: ["A. doesn't listen", "B. don't listen", "C. listen"],
      correct: 0,
      explain: "Chủ ngữ số ít 'My teacher' đi với 'A. doesn't listen' (C sai vì thiếu -s, B sai vì dùng don't)."
    },
    {
      id: "gk6-7",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 7 (Question 2): We _______ at weekends.",
      options: ["A. swims", "B. don't swim", "C. doesn't swim"],
      correct: 1,
      explain: "Chủ ngữ 'We' đi với 'B. don't swim'."
    },
    {
      id: "gk6-8",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 8 (Question 3): Their parents _______ in the afternoon.",
      options: ["A. doesn't jog", "B. jogs", "C. don't jog"],
      correct: 2,
      explain: "Chủ ngữ số nhiều 'Their parents' đi với 'C. don't jog'."
    },
    {
      id: "gk6-9",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 9 (Question 4): He _______ the plants.",
      options: ["A. doesn't waters", "B. don't water", "C. doesn't water"],
      correct: 2,
      explain: "Chủ ngữ số ít 'He' đi với 'doesn't' + động từ nguyên mẫu 'water' → 'C. doesn't water'."
    },
    {
      id: "gk6-10",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 10 (Question 5): His sister _______ a car.",
      options: ["A. doesn't drives", "B. doesn't drive", "C. drive"],
      correct: 1,
      explain: "Chủ ngữ số ít 'His sister' đi với 'B. doesn't drive'."
    },
    {
      id: "gk6-11",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 11 (Question 6): Freddy _______ English.",
      options: ["A. doesn't teach", "B. don't teaches", "C. teach"],
      correct: 0,
      explain: "Chủ ngữ tên riêng số ít 'Freddy' đi với 'A. doesn't teach'."
    },
    {
      id: "gk6-12",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 12 (Question 7): My brother _______ at the hospital.",
      options: ["A. doesn't works", "B. don't work", "C. works"],
      correct: 2,
      explain: "Chủ ngữ số ít 'My brother': A sai vì 'doesn't works' thừa -s, B sai vì dùng 'don't', nên 'C. works' (khẳng định chia đúng ngôi số ít) là đáp án đúng."
    },
    {
      id: "gk6-13",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 13 (Question 8): His son _______ books in the shopping centre.",
      options: ["A. doesn't buy", "B. don't buy", "C. buy"],
      correct: 0,
      explain: "Chủ ngữ số ít 'His son' đi với 'A. doesn't buy'."
    },
    {
      id: "gk6-14",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 14 (Question 9): They _______ their food.",
      options: ["A. shares", "B. don't share", "C. doesn't shares"],
      correct: 1,
      explain: "Chủ ngữ số nhiều 'They' đi với 'B. don't share'."
    },
    {
      id: "gk6-15",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 15 (Question 10): My students _______ up at 6.00.",
      options: ["A. doesn't get", "B. don't get", "C. gets"],
      correct: 1,
      explain: "Chủ ngữ số nhiều 'My students' (các học sinh của tôi) đi với 'B. don't get'."
    },

    // BÀI 3: Chuyển các câu ở thể khẳng định sau sang thể phủ định (5 câu tự luận - Trang 2 file kiểm tra)
    {
      id: "gk6-16",
      type: "INPUT",
      section: "Bài 3: Chuyển câu khẳng định sang thể phủ định dùng don't / doesn't (5 câu)",
      prompt: "Câu 16 (Question 1): My parents phone me in the evening. → Viết lại sang câu phủ định:",
      answer: "My parents don't phone me in the evening.",
      acceptedAnswers: [
        "my parents don't phone me in the evening",
        "my parents do not phone me in the evening"
      ],
      explain: "'My parents' là danh từ số nhiều nên thêm 'don't' trước động từ 'phone': 'My parents don't phone me in the evening.'."
    },
    {
      id: "gk6-17",
      type: "INPUT",
      section: "Bài 3: Chuyển câu khẳng định sang thể phủ định dùng don't / doesn't (5 câu)",
      prompt: "Câu 17 (Question 2): We travel to the university by bus. → Viết lại sang câu phủ định:",
      answer: "We don't travel to the university by bus.",
      acceptedAnswers: [
        "we don't travel to the university by bus",
        "we do not travel to the university by bus"
      ],
      explain: "Chủ ngữ 'We' đi với 'don't travel': 'We don't travel to the university by bus.'."
    },
    {
      id: "gk6-18",
      type: "INPUT",
      section: "Bài 3: Chuyển câu khẳng định sang thể phủ định dùng don't / doesn't (5 câu)",
      prompt: "Câu 18 (Question 3): I visit my grandparents every day. → Viết lại sang câu phủ định:",
      answer: "I don't visit my grandparents every day.",
      acceptedAnswers: [
        "i don't visit my grandparents every day",
        "i do not visit my grandparents every day"
      ],
      explain: "Chủ ngữ 'I' đi với 'don't visit': 'I don't visit my grandparents every day.'."
    },
    {
      id: "gk6-19",
      type: "INPUT",
      section: "Bài 3: Chuyển câu khẳng định sang thể phủ định dùng don't / doesn't (5 câu)",
      prompt: "Câu 19 (Question 4): Jimmy has a small cat. → Viết lại sang câu phủ định (Chú ý đổi 'has' về nguyên mẫu):",
      answer: "Jimmy doesn't have a small cat.",
      acceptedAnswers: [
        "jimmy doesn't have a small cat",
        "jimmy does not have a small cat"
      ],
      explain: "'Jimmy' là ngôi thứ 3 số ít nên dùng 'doesn't', đồng thời đổi 'has' về nguyên mẫu 'have': 'Jimmy doesn't have a small cat.'."
    },
    {
      id: "gk6-20",
      type: "INPUT",
      section: "Bài 3: Chuyển câu khẳng định sang thể phủ định dùng don't / doesn't (5 câu)",
      prompt: "Câu 20 (Question 5): He dances in his room in his free time. → Viết lại sang câu phủ định:",
      answer: "He doesn't dance in his room in his free time.",
      acceptedAnswers: [
        "he doesn't dance in his room in his free time",
        "he does not dance in his room in his free time"
      ],
      explain: "Chủ ngữ 'He' đi với 'doesn't' và đưa 'dances' về nguyên mẫu 'dance': 'He doesn't dance in his room in his free time.'."
    }
  ]
};