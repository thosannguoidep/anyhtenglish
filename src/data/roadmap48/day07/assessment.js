window.Day07Assessment = {
  // 1. Bài tập hiển thị trực tiếp trong Tab "2. Ngữ Pháp" (Từ file NGÀY 7.pdf)
  quiz1: [
    { id: "d7-q1-1", q: "Question 1. _______ he live with his parents?", options: ["A. Do", "B. Does"], correct: 1, explain: "Chủ ngữ ngôi thứ 3 số ít 'he' đi với trợ động từ 'Does' đảo lên đầu câu." },
    { id: "d7-q1-2", q: "Question 2. _______ they work at the weekend?", options: ["A. Does", "B. Do"], correct: 1, explain: "Chủ ngữ số nhiều 'they' đi với trợ động từ 'Do' đảo lên đầu câu." },
    { id: "d7-q1-3", q: "Question 3. Do you phone your father? – No, I _______.", options: ["A. don't", "B. do"], correct: 0, explain: "Trả lời phủ định với 'No, I...' dùng 'don't' (No, I don't)." },
    { id: "d7-q1-4", q: "Question 4. Does he play football with his friends? – Yes, he _______.", options: ["A. doesn't", "B. does"], correct: 1, explain: "Trả lời khẳng định với 'Yes, he...' dùng 'does' (Yes, he does)." }
  ],

  practice: [
    { id: "d7-p-1", q: "Question 1. Does David _______ this shirt?", options: ["A. wear", "B. wears"], correct: 0, explain: "Trong câu hỏi đã có trợ động từ 'Does', động từ chính giữ nguyên mẫu là 'wear'." },
    { id: "d7-p-2", q: "Question 2. _______ you sleep at 9.30?", options: ["A. Does", "B. Do"], correct: 1, explain: "Chủ ngữ 'you' đi với trợ động từ 'Do'." },
    { id: "d7-p-3", q: "Question 3. Does it _______ in the summer? – No, it doesn't.", options: ["A. snow", "B. snows"], correct: 0, explain: "Đã có trợ động từ 'Does' nên động từ chính giữ nguyên mẫu 'snow'." },
    { id: "d7-p-4", q: "Question 4. Does your maths class _______ at 5.00? – Yes, it does.", options: ["A. finish", "B. finishes"], correct: 0, explain: "Đã có trợ động từ 'Does' nên động từ chính giữ nguyên mẫu 'finish'." },
    { id: "d7-p-5", q: "Question 5. _______ you understand the question? – No, I don't.", options: ["A. Does", "B. Do"], correct: 1, explain: "Chủ ngữ 'you' đi với trợ động từ 'Do'." },
    { id: "d7-p-6", q: "Question 6. _______ he share the flat with his cousins? – Yes, he does.", options: ["A. Do", "B. Does"], correct: 1, explain: "Chủ ngữ 'he' đi với trợ động từ 'Does'." },
    { id: "d7-p-7", q: "Question 7. Do you feed the cats? – No, I _______.", options: ["A. do", "B. don't"], correct: 1, explain: "Trả lời phủ định với 'No, I...' dùng 'don't'." },
    { id: "d7-p-8", q: "Question 8. Does the baby play with his toys? – Yes, he _______.", options: ["A. does", "B. doesn't"], correct: 0, explain: "Trả lời khẳng định với 'Yes, he...' dùng 'does'." },
    { id: "d7-p-9", q: "Question 9. Does your grandmother _______ tea?", options: ["A. drink", "B. drinks"], correct: 0, explain: "Đã có trợ động từ 'Does' ở đầu câu nên động từ chính giữ nguyên mẫu 'drink'." },
    { id: "d7-p-10", q: "Question 10. _______ they go to the cinema?", options: ["A. Does", "B. Do"], correct: 1, explain: "Chủ ngữ số nhiều 'they' đi với trợ động từ 'Do'." }
  ],

  practice2: [
    {
      id: "d7-p2-11",
      prompt: "Question 11. His father cleans the window.",
      hint: "Đảo Does lên đầu + clean nguyên mẫu",
      answer: "Does his father clean the window?",
      acceptedAnswers: ["does his father clean the window"]
    },
    {
      id: "d7-p2-12",
      prompt: "Question 12. They rent a flat.",
      hint: "Đảo Do lên đầu + rent nguyên mẫu",
      answer: "Do they rent a flat?",
      acceptedAnswers: ["do they rent a flat"]
    },
    {
      id: "d7-p2-13",
      prompt: "Question 13. She wants a pie.",
      hint: "Đảo Does lên đầu + want nguyên mẫu",
      answer: "Does she want a pie?",
      acceptedAnswers: ["does she want a pie"]
    },
    {
      id: "d7-p2-14",
      prompt: "Question 14. You understand the question.",
      hint: "Đảo Do lên đầu + understand nguyên mẫu",
      answer: "Do you understand the question?",
      acceptedAnswers: ["do you understand the question"]
    }
  ],

  // 2. ĐỀ THI ONLINE UNIT 7 (20 CÂU TRÍCH XUẤT 100% TỪ FILE "NGÀY 7- kiểm tra.pdf")
  gatekeeperExam: [
    // BÀI 1: Dựa vào các bức tranh sau, viết câu trả lời phù hợp cho mỗi câu hỏi tương ứng (5 câu - Trang 1 & 2)
    {
      id: "gk7-1",
      type: "INPUT",
      section: "Bài 1: Nhìn tranh và viết câu trả lời Yes / No phù hợp (5 câu)",
      imageHtml: `<div class="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200"><span class="text-3xl">👦🍦👌</span><div><span class="text-xs font-bold text-amber-900 block">Tranh 1: Cậu bé đang cầm kem ăn rất vui vẻ và ra hiệu OK (Yes)</span><span class="text-[11px] text-amber-700">Gợi ý: the child (cậu bé) → ngôi 'he' → Yes, he does.</span></div></div>`,
      prompt: "Câu 1 (Tranh 1): 1. Does the child like ice cream? → Yes, _______",
      answer: "Yes, he does.",
      acceptedAnswers: ["yes, he does", "he does", "yes he does", "yes, it does", "it does"],
      explain: "Trong tranh cậu bé rất thích ăn kem nên trả lời khẳng định: 'Yes, he does.'."
    },
    {
      id: "gk7-2",
      type: "INPUT",
      section: "Bài 1: Nhìn tranh và viết câu trả lời Yes / No phù hợp (5 câu)",
      imageHtml: `<div class="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200"><span class="text-3xl">👩‍🦱👩🥬🛒</span><div><span class="text-xs font-bold text-emerald-900 block">Tranh 2: Hai người phụ nữ đang chọn mua rau củ xanh tại quầy siêu thị (Yes)</span><span class="text-[11px] text-emerald-700">Gợi ý: Câu hỏi 'Do they...?' → Trả lời khẳng định với 'they'.</span></div></div>`,
      prompt: "Câu 2 (Tranh 2): 2. Do they buy vegetables at the supermarket? → Viết câu trả lời:",
      answer: "Yes, they do.",
      acceptedAnswers: ["yes, they do", "yes they do"],
      explain: "Họ đang mua rau củ ở siêu thị nên trả lời là: 'Yes, they do.'."
    },
    {
      id: "gk7-3",
      type: "INPUT",
      section: "Bài 1: Nhìn tranh và viết câu trả lời Yes / No phù hợp (5 câu)",
      imageHtml: `<div class="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200"><span class="text-3xl">👦🧸📚😱</span><div><span class="text-xs font-bold text-rose-900 block">Tranh 3: Phòng cậu bé bày bừa đồ chơi, sách vở khắp sàn nhà, mẹ đứng nhìn bất ngờ (No)</span><span class="text-[11px] text-rose-700">Gợi ý: the boy → ngôi 'he' → Trả lời phủ định với 'No'.</span></div></div>`,
      prompt: "Câu 3 (Tranh 3): 3. Does the boy clean his room? → Viết câu trả lời:",
      answer: "No, he doesn't.",
      acceptedAnswers: ["no, he doesn't", "no he doesn't", "no, he does not", "no he does not"],
      explain: "Phòng rất bừa bộn (cậu bé không dọn phòng) nên trả lời là: 'No, he doesn't.'."
    },
    {
      id: "gk7-4",
      type: "INPUT",
      section: "Bài 1: Nhìn tranh và viết câu trả lời Yes / No phù hợp (5 câu)",
      imageHtml: `<div class="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-200"><span class="text-3xl">☀️🌡️🥵</span><div><span class="text-xs font-bold text-orange-900 block">Tranh 4: Trời nắng gắt mùa hè, nhiệt kế tăng cao, không có tuyết (No)</span><span class="text-[11px] text-orange-700">Gợi ý: Câu hỏi 'Does it...?' → Trả lời phủ định với 'it'.</span></div></div>`,
      prompt: "Câu 4 (Tranh 4): 4. Does it snow in the summer? → Viết câu trả lời:",
      answer: "No, it doesn't.",
      acceptedAnswers: ["no, it doesn't", "no it doesn't", "no, it does not", "no it does not"],
      explain: "Mùa hè trời nắng nóng không có tuyết rơi nên trả lời là: 'No, it doesn't.'."
    },
    {
      id: "gk7-5",
      type: "INPUT",
      section: "Bài 1: Nhìn tranh và viết câu trả lời Yes / No phù hợp (5 câu)",
      imageHtml: `<div class="flex items-center gap-3 p-3 rounded-xl bg-sky-50 border border-sky-200"><span class="text-3xl">👧👦🎒🏫</span><div><span class="text-xs font-bold text-sky-900 block">Tranh 5: Ba bạn học sinh đeo cặp đi bộ vào trường SCHOOL, đầu để trần không đội mũ (No)</span><span class="text-[11px] text-sky-700">Gợi ý: the students (số nhiều) → ngôi 'they' → Trả lời phủ định với 'No'.</span></div></div>`,
      prompt: "Câu 5 (Tranh 5): 5. Do the students wear hats? → Viết câu trả lời:",
      answer: "No, they don't.",
      acceptedAnswers: ["no, they don't", "no they don't", "no, they do not", "no they do not"],
      explain: "Các bạn học sinh trong hình không đội mũ nên trả lời là: 'No, they don't.'."
    },

    // BÀI 2: Chọn đáp án đúng (10 câu trắc nghiệm - Trang 2 file kiểm tra)
    {
      id: "gk7-6",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng (10 câu)",
      q: "Câu 6 (Question 1): Does Anna _______ the violin?",
      options: ["A. play", "B. plays"],
      correct: 0,
      explain: "Đã có trợ động từ 'Does' ở đầu câu nên động từ chính giữ nguyên mẫu là 'play'."
    },
    {
      id: "gk7-7",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng (10 câu)",
      q: "Câu 7 (Question 2): _______ they visit the cinema on weekends?",
      options: ["A. Do", "B. Does"],
      correct: 0,
      explain: "Chủ ngữ số nhiều 'they' đi với trợ động từ 'A. Do'."
    },
    {
      id: "gk7-8",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng (10 câu)",
      q: "Câu 8 (Question 3): Do you _______ to the gym in the afternoon?",
      options: ["A. go", "B. goes"],
      correct: 0,
      explain: "Trong câu hỏi với 'Do you...', động từ chính giữ nguyên mẫu là 'A. go'."
    },
    {
      id: "gk7-9",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng (10 câu)",
      q: "Câu 9 (Question 4): Do they _______ at university?",
      options: ["A. studies", "B. study"],
      correct: 1,
      explain: "Chủ ngữ 'they' trong câu hỏi với 'Do' dùng động từ nguyên mẫu 'B. study'."
    },
    {
      id: "gk7-10",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng (10 câu)",
      q: "Câu 10 (Question 5): _______ he feed the cat in the evening?",
      options: ["A. Does", "B. Do"],
      correct: 0,
      explain: "Chủ ngữ số ít 'he' đi với trợ động từ 'A. Does'."
    },
    {
      id: "gk7-11",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng (10 câu)",
      q: "Câu 11 (Question 6): Does it rain in the winter? – Yes, it _______.",
      options: ["A. do", "B. does"],
      correct: 1,
      explain: "Trả lời khẳng định cho câu hỏi 'Does it...?' là 'Yes, it does.'."
    },
    {
      id: "gk7-12",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng (10 câu)",
      q: "Câu 12 (Question 7): Do your parents rent a flat? – No, they _______.",
      options: ["A. don't", "B. doesn't"],
      correct: 0,
      explain: "Trả lời phủ định với chủ ngữ số nhiều 'they' là 'No, they don't.'."
    },
    {
      id: "gk7-13",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng (10 câu)",
      q: "Câu 13 (Question 8): Does your daughter want the pie? – Yes, she _______.",
      options: ["A. does", "B. doesn't"],
      correct: 0,
      explain: "Trả lời khẳng định với 'Yes, she...' là 'Yes, she does.'."
    },
    {
      id: "gk7-14",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng (10 câu)",
      q: "Câu 14 (Question 9): Do your grandparents _______ early at night?",
      options: ["A. sleeps", "B. sleep"],
      correct: 1,
      explain: "Đã có trợ động từ 'Do' ở đầu câu nên động từ chính giữ nguyên mẫu là 'B. sleep'."
    },
    {
      id: "gk7-15",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng (10 câu)",
      q: "Câu 15 (Question 10): _______ he finish his homework at night? – Yes, he _______.",
      options: ["A. Does – does", "B. Do – do"],
      correct: 0,
      explain: "Chủ ngữ ngôi thứ 3 số ít 'he' dùng 'Does' ở cả câu hỏi và câu trả lời khẳng định: 'Does he finish...? – Yes, he does.'."
    },

    // BÀI 3: Chuyển các câu ở thể khẳng định sau sang thể nghi vấn. Thêm dấu hỏi chấm ở cuối câu (5 câu - Trang 2)
    {
      id: "gk7-16",
      type: "INPUT",
      section: "Bài 3: Chuyển câu khẳng định sang thể nghi vấn Do / Does (5 câu)",
      prompt: "Câu 16 (Question 1): His mother drinks tea in the morning. → Chuyển sang câu nghi vấn:",
      answer: "Does his mother drink tea in the morning?",
      acceptedAnswers: ["does his mother drink tea in the morning"],
      explain: "Chủ ngữ 'His mother' (số ít) → Đảo 'Does' lên đầu câu và đưa 'drinks' về nguyên mẫu 'drink': 'Does his mother drink tea in the morning?'."
    },
    {
      id: "gk7-17",
      type: "INPUT",
      section: "Bài 3: Chuyển câu khẳng định sang thể nghi vấn Do / Does (5 câu)",
      prompt: "Câu 17 (Question 2): Harry eats fruits every evening. → Chuyển sang câu nghi vấn:",
      answer: "Does Harry eat fruits every evening?",
      acceptedAnswers: ["does harry eat fruits every evening"],
      explain: "Chủ ngữ 'Harry' (số ít) → Đảo 'Does' lên đầu câu và đưa 'eats' về nguyên mẫu 'eat': 'Does Harry eat fruits every evening?'."
    },
    {
      id: "gk7-18",
      type: "INPUT",
      section: "Bài 3: Chuyển câu khẳng định sang thể nghi vấn Do / Does (5 câu)",
      prompt: "Câu 18 (Question 3): Joey teaches him English. → Chuyển sang câu nghi vấn:",
      answer: "Does Joey teach him English?",
      acceptedAnswers: ["does joey teach him english"],
      explain: "Chủ ngữ 'Joey' (số ít) → Đảo 'Does' lên đầu câu và đưa 'teaches' về nguyên mẫu 'teach': 'Does Joey teach him English?'."
    },
    {
      id: "gk7-19",
      type: "INPUT",
      section: "Bài 3: Chuyển câu khẳng định sang thể nghi vấn Do / Does (5 câu)",
      prompt: "Câu 19 (Question 4): Her sisters work at a bank. → Chuyển sang câu nghi vấn:",
      answer: "Do her sisters work at a bank?",
      acceptedAnswers: ["do her sisters work at a bank"],
      explain: "Chủ ngữ 'Her sisters' (những người chị/em gái - số nhiều) → Đảo 'Do' lên đầu câu và giữ nguyên 'work': 'Do her sisters work at a bank?'."
    },
    {
      id: "gk7-20",
      type: "INPUT",
      section: "Bài 3: Chuyển câu khẳng định sang thể nghi vấn Do / Does (5 câu)",
      prompt: "Câu 20 (Question 5): Their father buys them new toys. → Chuyển sang câu nghi vấn:",
      answer: "Does their father buy them new toys?",
      acceptedAnswers: ["does their father buy them new toys"],
      explain: "Chủ ngữ 'Their father' (bố của họ - số ít) → Đảo 'Does' lên đầu câu và đưa 'buys' về nguyên mẫu 'buy': 'Does their father buy them new toys?'."
    }
  ]
};