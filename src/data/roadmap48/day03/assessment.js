window.Day03Assessment = {
  // 1. Bài tập hiển thị trực tiếp trong Tab "2. Ngữ Pháp" (từ file NGÀY 3.pdf)
  quiz1: [
    { id: "d3-q1-1", q: "Question 1. Who _______ she? – She is my mother.", options: ["A. are", "B. is"], correct: 1, explain: "Chủ ngữ 'she' đi với động từ to be 'is'." },
    { id: "d3-q1-2", q: "Question 2. Who _______ they? – They are my friends.", options: ["A. is", "B. are"], correct: 1, explain: "Chủ ngữ 'they' đi với động từ to be 'are'." },
    { id: "d3-q1-3", q: "Question 3. Who is this? – _______ is my grandfather.", options: ["A. It", "B. They"], correct: 0, explain: "Câu hỏi 'Who is this?' trả lời bằng 'It is (It's) + danh từ số ít'." },
    { id: "d3-q1-4", q: "Question 4. Who are those? – _______ are our classmates.", options: ["A. It", "B. They"], correct: 1, explain: "Câu hỏi 'Who are those?' trả lời bằng 'They are + danh từ số nhiều'." }
  ],

  quiz2: [
    { id: "d3-q2-1", q: "Question 1. What _______ this? – It's my hat.", options: ["A. are", "B. is"], correct: 1, explain: "Đại từ 'this' (số ít) đi với động từ to be 'is'." },
    { id: "d3-q2-2", q: "Question 2. What is that? – It _______ a cake.", options: ["A. is", "B. are"], correct: 0, explain: "Chủ ngữ 'It' đi với động từ to be 'is'." },
    { id: "d3-q2-3", q: "Question 3. What are these? – _______ are pillows.", options: ["A. They", "B. It"], correct: 0, explain: "Câu hỏi 'What are these?' (số nhiều) trả lời bằng 'They are...'." },
    { id: "d3-q2-4", q: "Question 4. Who are those? – _______ are my cousins.", options: ["A. It", "B. They"], correct: 1, explain: "Câu hỏi 'Who are those?' (số nhiều) trả lời bằng 'They are...'." }
  ],

  practice: [
    { id: "d3-p-1", q: "Question 1. Who _______ they?", options: ["A. are", "B. am"], correct: 0, explain: "Chủ ngữ 'they' đi với 'are'." },
    { id: "d3-p-2", q: "Question 2. What _______ that?", options: ["A. are", "B. is"], correct: 1, explain: "Chủ ngữ 'that' (số ít) đi với 'is'." },
    { id: "d3-p-3", q: "Question 3. _______ is this? – It's my grandfather.", options: ["A. What", "B. Who"], correct: 1, explain: "'my grandfather' (ông của tôi) là người nên dùng từ để hỏi 'Who'." },
    { id: "d3-p-4", q: "Question 4. _______ are those? – They are pillows.", options: ["A. What", "B. Who"], correct: 0, explain: "'pillows' (những chiếc gối) là đồ vật nên dùng từ để hỏi 'What'." },
    { id: "d3-p-5", q: "Question 5. What is that? – _______ is a chair.", options: ["A. They", "B. It"], correct: 1, explain: "Hỏi 'What is that?' (số ít) trả lời bằng 'It is a chair'." },
    { id: "d3-p-6", q: "Question 6. Who are these? – _______ are my cousins.", options: ["A. They", "B. It"], correct: 0, explain: "Hỏi 'Who are these?' (số nhiều) trả lời bằng 'They are my cousins'." },
    { id: "d3-p-7", q: "Question 7. Who are those? – They _______ our classmates.", options: ["A. are", "B. is"], correct: 0, explain: "Chủ ngữ 'They' đi với 'are'." },
    { id: "d3-p-8", q: "Question 8. What is that? – It _______ a hat.", options: ["A. is", "B. are"], correct: 0, explain: "Chủ ngữ 'It' đi với 'is'." },
    { id: "d3-p-9", q: "Question 9. _______ is this? – It's his son.", options: ["A. What", "B. Who"], correct: 1, explain: "'his son' (con trai của anh ấy) là người nên dùng 'Who'." },
    { id: "d3-p-10", q: "Question 10. _______ are those? – They are her socks.", options: ["A. Who", "B. What"], correct: 1, explain: "'her socks' (những chiếc tất của cô ấy) là đồ vật nên dùng 'What'." }
  ],

  // 2. ĐỀ THI ONLINE UNIT 3 (20 CÂU TRÍCH XUẤT 100% TỪ FILE "NGÀY 3 - kiểm tra.pdf")
  gatekeeperExam: [
    // BÀI 1: Nối các câu trả lời ở cột phải phù hợp với câu hỏi ở cột trái (5 câu)
    {
      id: "gk3-1",
      type: "MCQ",
      section: "Bài 1: Nối câu hỏi với câu trả lời phù hợp (5 câu)",
      q: "Câu 1: Chọn câu trả lời phù hợp nhất với câu hỏi: 'Who is she?'",
      options: ["A. It's my grandfather.", "B. She is my cousin.", "C. They are my children.", "D. It's a banana."],
      correct: 1,
      explain: "Câu hỏi có chủ ngữ là 'she' (cô ấy) nên nối với 'She is my cousin.' (Cô ấy là chị/em họ của tôi)."
    },
    {
      id: "gk3-2",
      type: "MCQ",
      section: "Bài 1: Nối câu hỏi với câu trả lời phù hợp (5 câu)",
      q: "Câu 2: Chọn câu trả lời phù hợp nhất với câu hỏi: 'Who is this?'",
      options: ["A. It's my grandfather.", "B. They are my socks.", "C. She is my cousin.", "D. They are my children."],
      correct: 0,
      explain: "'Who is this?' (Đây là ai? - số ít chỉ người) nối với 'It's my grandfather.' (Đó là ông của tôi)."
    },
    {
      id: "gk3-3",
      type: "MCQ",
      section: "Bài 1: Nối câu hỏi với câu trả lời phù hợp (5 câu)",
      q: "Câu 3: Chọn câu trả lời phù hợp nhất với câu hỏi: 'What is that?'",
      options: ["A. It's my grandfather.", "B. They are my socks.", "C. It's a banana.", "D. She is my cousin."],
      correct: 2,
      explain: "'What is that?' (Kia là cái gì? - số ít chỉ vật) nối với 'It's a banana.' (Đó là một quả chuối)."
    },
    {
      id: "gk3-4",
      type: "MCQ",
      section: "Bài 1: Nối câu hỏi với câu trả lời phù hợp (5 câu)",
      q: "Câu 4: Chọn câu trả lời phù hợp nhất với câu hỏi: 'Who are these?'",
      options: ["A. They are my socks.", "B. It's a banana.", "C. They are my children.", "D. It's my grandfather."],
      correct: 2,
      explain: "'Who are these?' (Đây là những ai? - số nhiều chỉ người) nối với 'They are my children.' (Họ là các con của tôi)."
    },
    {
      id: "gk3-5",
      type: "MCQ",
      section: "Bài 1: Nối câu hỏi với câu trả lời phù hợp (5 câu)",
      q: "Câu 5: Chọn câu trả lời phù hợp nhất với câu hỏi: 'What are they?'",
      options: ["A. They are my children.", "B. They are my socks.", "C. She is my cousin.", "D. It's a banana."],
      correct: 1,
      explain: "'What are they?' (Chúng là những cái gì? - số nhiều chỉ vật) nối với 'They are my socks.' (Chúng là những chiếc tất của tôi)."
    },

    // BÀI 2: Dựa vào các hình ảnh, viết câu trả lời phù hợp cho câu hỏi tương ứng (5 câu có hình minh họa)
    {
      id: "gk3-6",
      type: "INPUT",
      section: "Bài 2: Nhìn hình ảnh và viết câu trả lời đầy đủ (5 câu)",
      imageHtml: `<div class="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200"><span class="text-3xl">🧢🎩👒</span><div><span class="text-xs font-bold text-amber-900 block">Hình 1: Nhiều chiếc mũ (hat → hats)</span><span class="text-[11px] text-amber-700">Gợi ý cấu trúc: They are + danh từ số nhiều.</span></div></div>`,
      prompt: "Câu 6 (Hình 1): What are they? → Viết câu trả lời tiếng Anh:",
      answer: "They are hats.",
      acceptedAnswers: ["they are hats", "they're hats", "they are hats.", "they're hats."],
      explain: "Vì có nhiều chiếc mũ nên trả lời là: 'They are hats.' (hoặc 'They're hats.')."
    },
    {
      id: "gk3-7",
      type: "INPUT",
      section: "Bài 2: Nhìn hình ảnh và viết câu trả lời đầy đủ (5 câu)",
      imageHtml: `<div class="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200"><span class="text-3xl">🎂</span><div><span class="text-xs font-bold text-rose-900 block">Hình 2: Một chiếc bánh kem sinh nhật (cake)</span><span class="text-[11px] text-rose-700">Gợi ý cấu trúc: It is a + danh từ số ít.</span></div></div>`,
      prompt: "Câu 7 (Hình 2): What is this? → Viết câu trả lời tiếng Anh:",
      answer: "It is a cake.",
      acceptedAnswers: ["it is a cake", "it's a cake", "it is a cake.", "it's a cake."],
      explain: "Một chiếc bánh (số ít) nên trả lời là: 'It is a cake.' (hoặc 'It's a cake.')."
    },
    {
      id: "gk3-8",
      type: "INPUT",
      section: "Bài 2: Nhìn hình ảnh và viết câu trả lời đầy đủ (5 câu)",
      imageHtml: `<div class="flex items-center gap-3 p-3 rounded-xl bg-sky-50 border border-sky-200"><span class="text-3xl">🛌☁️</span><div><span class="text-xs font-bold text-sky-900 block">Hình 3: Hai chiếc gối trắng (pillow → pillows)</span><span class="text-[11px] text-sky-700">Gợi ý cấu trúc: They are + danh từ số nhiều.</span></div></div>`,
      prompt: "Câu 8 (Hình 3): What are these? → Viết câu trả lời tiếng Anh:",
      answer: "They are pillows.",
      acceptedAnswers: ["they are pillows", "they're pillows", "they are pillows.", "they're pillows."],
      explain: "Hai chiếc gối (số nhiều) nên trả lời là: 'They are pillows.' (hoặc 'They're pillows.')."
    },
    {
      id: "gk3-9",
      type: "INPUT",
      section: "Bài 2: Nhìn hình ảnh và viết câu trả lời đầy đủ (5 câu)",
      imageHtml: `<div class="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200"><span class="text-3xl">👨‍⚕️👩‍⚕️🩺</span><div><span class="text-xs font-bold text-emerald-900 block">Hình 4: Nhóm 5 bác sĩ (doctor → doctors)</span><span class="text-[11px] text-emerald-700">Gợi ý cấu trúc: They are + danh từ chỉ người số nhiều.</span></div></div>`,
      prompt: "Câu 9 (Hình 4): Who are those? → Viết câu trả lời tiếng Anh:",
      answer: "They are doctors.",
      acceptedAnswers: ["they are doctors", "they're doctors", "they are doctors.", "they're doctors."],
      explain: "Nhóm các bác sĩ (số nhiều) nên trả lời là: 'They are doctors.' (hoặc 'They're doctors.')."
    },
    {
      id: "gk3-10",
      type: "INPUT",
      section: "Bài 2: Nhìn hình ảnh và viết câu trả lời đầy đủ (5 câu)",
      imageHtml: `<div class="flex items-center gap-3 p-3 rounded-xl bg-pink-50 border border-pink-200"><span class="text-3xl">👜</span><div><span class="text-xs font-bold text-pink-900 block">Hình 5: Một chiếc túi xách màu hồng (bag)</span><span class="text-[11px] text-pink-700">Gợi ý cấu trúc: It is a + danh từ số ít.</span></div></div>`,
      prompt: "Câu 10 (Hình 5): What is that? → Viết câu trả lời tiếng Anh:",
      answer: "It is a bag.",
      acceptedAnswers: ["it is a bag", "it's a bag", "it is a bag.", "it's a bag."],
      explain: "Một chiếc túi xách (số ít) nên trả lời là: 'It is a bag.' (hoặc 'It's a bag.')."
    },

    // BÀI 3: Chọn đáp án đúng What / Who (5 câu)
    {
      id: "gk3-11",
      type: "MCQ",
      section: "Bài 3: Chọn từ để hỏi What hoặc Who (5 câu)",
      q: "Câu 11 (Question 1): _______ is this? – It's a desk.",
      options: ["A. What", "B. Who"],
      correct: 0,
      explain: "'a desk' (chiếc bàn) là đồ vật nên dùng 'What'."
    },
    {
      id: "gk3-12",
      type: "MCQ",
      section: "Bài 3: Chọn từ để hỏi What hoặc Who (5 câu)",
      q: "Câu 12 (Question 2): _______ are these? – They are shirts.",
      options: ["A. What", "B. Who"],
      correct: 0,
      explain: "'shirts' (những chiếc áo sơ mi) là đồ vật nên dùng 'What'."
    },
    {
      id: "gk3-13",
      type: "MCQ",
      section: "Bài 3: Chọn từ để hỏi What hoặc Who (5 câu)",
      q: "Câu 13 (Question 3): _______ are these? – They are my children.",
      options: ["A. What", "B. Who"],
      correct: 1,
      explain: "'my children' (các con của tôi) là người nên dùng 'Who'."
    },
    {
      id: "gk3-14",
      type: "MCQ",
      section: "Bài 3: Chọn từ để hỏi What hoặc Who (5 câu)",
      q: "Câu 14 (Question 4): _______ is this? – It is my friend.",
      options: ["A. What", "B. Who"],
      correct: 1,
      explain: "'my friend' (người bạn của tôi) là người nên dùng 'Who'."
    },
    {
      id: "gk3-15",
      type: "MCQ",
      section: "Bài 3: Chọn từ để hỏi What hoặc Who (5 câu)",
      q: "Câu 15 (Question 5): _______ are those? – They are her jeans.",
      options: ["A. What", "B. Who"],
      correct: 0,
      explain: "'her jeans' (quần bò của cô ấy) là đồ vật nên dùng 'What'."
    },

    // BÀI 4: Chọn đáp án đúng A, B, C (5 câu)
    {
      id: "gk3-16",
      type: "MCQ",
      section: "Bài 4: Trắc nghiệm tổng hợp A, B, C (5 câu)",
      q: "Câu 16 (Question 1): What are _______? – They are her dogs.",
      options: ["A. those", "B. it", "C. you"],
      correct: 0,
      explain: "Động từ 'are' và câu trả lời 'They are her dogs' (vật số nhiều) nên chọn 'A. those'."
    },
    {
      id: "gk3-17",
      type: "MCQ",
      section: "Bài 4: Trắc nghiệm tổng hợp A, B, C (5 câu)",
      q: "Câu 17 (Question 2): Who are they? – They _______ our classmates.",
      options: ["A. is", "B. am", "C. are"],
      correct: 2,
      explain: "Chủ ngữ 'They' đi với động từ to be 'C. are'."
    },
    {
      id: "gk3-18",
      type: "MCQ",
      section: "Bài 4: Trắc nghiệm tổng hợp A, B, C (5 câu)",
      q: "Câu 18 (Question 3): What is this? – _______ a chair.",
      options: ["A. They're", "B. It's", "C. I'm"],
      correct: 1,
      explain: "Hỏi 'What is this?' (số ít) trả lời bằng 'B. It's' (It is a chair)."
    },
    {
      id: "gk3-19",
      type: "MCQ",
      section: "Bài 4: Trắc nghiệm tổng hợp A, B, C (5 câu)",
      q: "Câu 19 (Question 4): Who is this? – _______ is my friend.",
      options: ["A. It", "B. You", "C. They"],
      correct: 0,
      explain: "Sau chỗ trống có động từ 'is' và trả lời cho 'Who is this?' nên chọn 'A. It'."
    },
    {
      id: "gk3-20",
      type: "MCQ",
      section: "Bài 4: Trắc nghiệm tổng hợp A, B, C (5 câu)",
      q: "Câu 20 (Question 5): Who _______ that? – It's his grandmother.",
      options: ["A. is", "B. are", "C. am"],
      correct: 0,
      explain: "Đại từ 'that' (số ít) đi với động từ to be 'A. is' (Who is that?)."
    }
  ]
};