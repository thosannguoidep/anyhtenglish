window.Day08Assessment = {
  // 1. Bài tập hiển thị trực tiếp trong Tab "2. Ngữ Pháp" (Từ file NGÀY 8.pdf)
  quiz1: [
    { id: "d8-q1-1", q: "Question 1. I usually _______ up at 6.00.", options: ["A. gets", "B. get"], correct: 1, explain: "Chủ ngữ 'I' đi với động từ nguyên mẫu 'get'." },
    { id: "d8-q1-2", q: "Question 2. _______ he often work at the weekend?", options: ["A. Does", "B. Do"], correct: 0, explain: "Chủ ngữ ngôi thứ 3 số ít 'he' mượn trợ động từ 'Does' ở đầu câu hỏi." },
    { id: "d8-q1-3", q: "Question 3. My son _______ like ice cream.", options: ["A. doesn't", "B. don't"], correct: 0, explain: "Chủ ngữ số ít 'My son' (con trai tôi) đi với trợ động từ phủ định 'doesn't'." },
    { id: "d8-q1-4", q: "Question 4. Our children _______ active.", options: ["A. is", "B. are"], correct: 1, explain: "'Our children' (các con của chúng tôi) là danh từ số nhiều đi với tính từ 'active' nên dùng to be 'are'." }
  ],

  practice: [
    { id: "d8-p-1", q: "Question 1. Water _______ at 100°C.", options: ["A. boil", "B. boils"], correct: 1, explain: "'Water' (nước) là danh từ không đếm được nên chia động từ số ít: 'boils'." },
    { id: "d8-p-2", q: "Question 2. _______ your baby cry at night?", options: ["A. Does", "B. Do"], correct: 0, explain: "Chủ ngữ số ít 'your baby' (em bé của bạn) và động từ thường 'cry' nên mượn 'Does'." },
    { id: "d8-p-3", q: "Question 3. They never _______ to school.", options: ["A. cycles", "B. cycle"], correct: 1, explain: "Chủ ngữ 'They' đi với động từ nguyên mẫu 'cycle'." },
    { id: "d8-p-4", q: "Question 4. Her cats _______ cute.", options: ["A. is", "B. are"], correct: 1, explain: "Chủ ngữ số nhiều 'Her cats' đi với tính từ 'cute' nên dùng động từ to be 'are'." },
    { id: "d8-p-5", q: "Question 5. It _______ hot in summer.", options: ["A. am", "B. is"], correct: 1, explain: "Chủ ngữ 'It' đi với tính từ 'hot' dùng to be 'is'." },
    { id: "d8-p-6", q: "Question 6. He _______ a university student.", options: ["A. isn't", "B. aren't"], correct: 0, explain: "Chủ ngữ 'He' đi với 'isn't' (is not)." },
    { id: "d8-p-7", q: "Question 7. We usually _______ dinner at 7.00.", options: ["A. has", "B. have"], correct: 1, explain: "Chủ ngữ 'We' đi với động từ nguyên mẫu 'have' (have dinner = ăn tối)." },
    { id: "d8-p-8", q: "Question 8. The train _______ at 4.30.", options: ["A. leaves", "B. leave"], correct: 0, explain: "Lịch trình tàu xe, chủ ngữ số ít 'The train' đi với 'leaves'." },
    { id: "d8-p-9", q: "Question 9. The Sun _______ in the West.", options: ["A. sets", "B. set"], correct: 0, explain: "Sự thật hiển nhiên, chủ ngữ số ít 'The Sun' đi với 'sets' (Mặt trời lặn ở hướng Tây)." },
    { id: "d8-p-10", q: "Question 10. My son sometimes _______ his bedroom.", options: ["A. tidy", "B. tidies"], correct: 1, explain: "Chủ ngữ số ít 'My son' + động từ 'tidy' (phụ âm d + y → đổi thành ies): 'tidies'." },
    { id: "d8-p-11", q: "Question 11. Our children often _______ in the afternoon.", options: ["A. runs", "B. run"], correct: 1, explain: "Chủ ngữ số nhiều 'Our children' đi với động từ nguyên mẫu 'run'." },
    { id: "d8-p-12", q: "Question 12. My brother-in-law doesn't _______ at a bank.", options: ["A. work", "B. works"], correct: 0, explain: "Sau trợ động từ 'doesn't', động từ chính giữ nguyên mẫu là 'work'." },
    { id: "d8-p-13", q: "Question 13. I _______ my grandmother twice a month.", options: ["A. see", "B. sees"], correct: 0, explain: "Chủ ngữ 'I' đi với động từ nguyên mẫu 'see' (ghé thăm)." },
    { id: "d8-p-14", q: "Question 14. Her bedroom _______ always tidy.", options: ["A. is", "B. are"], correct: 0, explain: "Chủ ngữ số ít 'Her bedroom' đi với tính từ 'tidy' dùng to be 'is'." },
    { id: "d8-p-15", q: "Question 15. _______ trees usually turn yellow in the autumn?", options: ["A. Do", "B. Does"], correct: 0, explain: "Chủ ngữ số nhiều 'trees' và động từ thường 'turn' nên mượn trợ động từ 'Do'." }
  ],

  // 2. ĐỀ THI ONLINE UNIT 8 (20 CÂU TRÍCH XUẤT 100% TỪ FILE "NGÀY 8- kiểm tra.pdf")
  gatekeeperExam: [
    // BÀI 1: Cho dạng đúng của động từ trong ngoặc vào chỗ trống (10 câu tự luận)
    {
      id: "gk8-1",
      type: "INPUT",
      section: "Bài 1: Cho dạng đúng của động từ trong ngoặc (10 câu)",
      prompt: "Câu 1 (Question 1): Janna _______ (run) in the park every morning.",
      answer: "runs",
      acceptedAnswers: ["runs"],
      explain: "Chủ ngữ tên riêng số ít 'Janna' ở thì hiện tại đơn (every morning) → thêm -s vào động từ: 'runs'."
    },
    {
      id: "gk8-2",
      type: "INPUT",
      section: "Bài 1: Cho dạng đúng của động từ trong ngoặc (10 câu)",
      prompt: "Câu 2 (Question 2): They _______ (be/ not) usually late.",
      answer: "aren't",
      acceptedAnswers: ["aren't", "are not"],
      explain: "Chủ ngữ 'They' đi với động từ to be phủ định là 'are not' (hoặc viết tắt là 'aren't')."
    },
    {
      id: "gk8-3",
      type: "INPUT",
      section: "Bài 1: Cho dạng đúng của động từ trong ngoặc (10 câu)",
      prompt: "Câu 3 (Question 3): _______ he _______ (eat) dinner at 7 p.m. every day? (Viết theo mẫu: Do - have)",
      answer: "Does - eat",
      acceptedAnswers: ["does - eat", "does – eat", "does eat", "does / eat", "does-eat"],
      explain: "Câu nghi vấn với chủ ngữ số ít 'he' và động từ thường 'eat': đảo 'Does' lên trước chủ ngữ và giữ nguyên 'eat' → 'Does - eat'."
    },
    {
      id: "gk8-4",
      type: "INPUT",
      section: "Bài 1: Cho dạng đúng của động từ trong ngoặc (10 câu)",
      prompt: "Câu 4 (Question 4): They _______ (not/cycle) to school.",
      answer: "don't cycle",
      acceptedAnswers: ["don't cycle", "do not cycle"],
      explain: "Chủ ngữ số nhiều 'They' ở thể phủ định với động từ thường → 'don't cycle' (hoặc 'do not cycle')."
    },
    {
      id: "gk8-5",
      type: "INPUT",
      section: "Bài 1: Cho dạng đúng của động từ trong ngoặc (10 câu)",
      prompt: "Câu 5 (Question 5): She (be) _______ always careful.",
      answer: "is",
      acceptedAnswers: ["is"],
      explain: "Chủ ngữ 'She' đi với tính từ 'careful' → chia động từ to be là 'is'."
    },
    {
      id: "gk8-6",
      type: "INPUT",
      section: "Bài 1: Cho dạng đúng của động từ trong ngoặc (10 câu)",
      prompt: "Câu 6 (Question 6): (Be) _______ your father always busy?",
      answer: "Is",
      acceptedAnswers: ["is"],
      explain: "Chủ ngữ số ít 'your father' đi với tính từ 'busy' → đảo to be 'Is' lên đầu câu."
    },
    {
      id: "gk8-7",
      type: "INPUT",
      section: "Bài 1: Cho dạng đúng của động từ trong ngoặc (10 câu)",
      prompt: "Câu 7 (Question 7): My brother never (tidy) _______ his room.",
      answer: "tidies",
      acceptedAnswers: ["tidies"],
      explain: "Chủ ngữ số ít 'My brother' + động từ 'tidy' (kết thúc bằng phụ âm d + y → đổi y thành i + es): 'tidies'."
    },
    {
      id: "gk8-8",
      type: "INPUT",
      section: "Bài 1: Cho dạng đúng của động từ trong ngoặc (10 câu)",
      prompt: "Câu 8 (Question 8): Do you often (have) _______ breakfast at 7 a.m.?",
      answer: "have",
      acceptedAnswers: ["have"],
      explain: "Câu nghi vấn đã có trợ động từ 'Do' ở đầu câu nên động từ '(have)' giữ nguyên mẫu là 'have'."
    },
    {
      id: "gk8-9",
      type: "INPUT",
      section: "Bài 1: Cho dạng đúng của động từ trong ngoặc (10 câu)",
      prompt: "Câu 9 (Question 9): His daughter (do) _______ her homework after dinner.",
      answer: "does",
      acceptedAnswers: ["does"],
      explain: "Chủ ngữ số ít 'His daughter' (con gái của anh ấy) + động từ 'do' thêm -es → 'does'."
    },
    {
      id: "gk8-10",
      type: "INPUT",
      section: "Bài 1: Cho dạng đúng của động từ trong ngoặc (10 câu)",
      prompt: "Câu 10 (Question 10): Our children always (meet) _______ their friends on weekends.",
      answer: "meet",
      acceptedAnswers: ["meet"],
      explain: "Chủ ngữ số nhiều 'Our children' (các con của chúng tôi) → động từ giữ nguyên mẫu là 'meet'."
    },

    // BÀI 2: Chọn đáp án đúng A, B, C (10 câu trắc nghiệm)
    {
      id: "gk8-11",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 11 (Question 1): _______ your bedroom always neat?",
      options: ["A. Is", "B. Are", "C. Am"],
      correct: 0,
      explain: "Chủ ngữ số ít 'your bedroom' đi với tính từ 'neat' (ngăn nắp) nên dùng to be 'A. Is'."
    },
    {
      id: "gk8-12",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 12 (Question 2): We _______ vegetables and fruits.",
      options: ["A. hates", "B. doesn't hate", "C. don't hate"],
      correct: 2,
      explain: "Chủ ngữ số nhiều 'We' đi với trợ động từ phủ định 'don't': 'C. don't hate'."
    },
    {
      id: "gk8-13",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 13 (Question 3): The sun _______ in the West.",
      options: ["A. set", "B. don't set", "C. sets"],
      correct: 2,
      explain: "Chủ ngữ số ít 'The sun' diễn tả chân lý hiển nhiên → động từ thêm -s: 'C. sets'."
    },
    {
      id: "gk8-14",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 14 (Question 4): He _______ the trees.",
      options: ["A. water hardly", "B. hardly waters", "C. waters hardly"],
      correct: 1,
      explain: "Trạng từ tần suất 'hardly' phải đứng TRƯỚC động từ thường, và chủ ngữ 'He' nên động từ 'water' thêm -s → 'B. hardly waters'."
    },
    {
      id: "gk8-15",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 15 (Question 5): Her baby _______ every night.",
      options: ["A. crys", "B. cries", "C. cry"],
      correct: 1,
      explain: "Chủ ngữ số ít 'Her baby' + động từ 'cry' (phụ âm r + y → đổi y thành i + es): 'B. cries'."
    },
    {
      id: "gk8-16",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 16 (Question 6): _______ people late?",
      options: ["A. Is", "B. Does", "C. Are"],
      correct: 2,
      explain: "'people' (mọi người) là danh từ số nhiều và 'late' là tính từ nên dùng động từ to be 'C. Are'."
    },
    {
      id: "gk8-17",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 17 (Question 7): Their children _______ very lovely.",
      options: ["A. is", "B. are", "C. am"],
      correct: 1,
      explain: "'Their children' là danh từ số nhiều đi với tính từ 'lovely' nên dùng to be 'B. are'."
    },
    {
      id: "gk8-18",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 18 (Question 8): It _______ in the summer.",
      options: ["A. never snows", "B. snows never", "C. never snow"],
      correct: 0,
      explain: "Trạng từ tần suất 'never' đứng TRƯỚC động từ thường và chủ ngữ 'It' nên 'snow' thêm -s → 'A. never snows'."
    },
    {
      id: "gk8-19",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 19 (Question 9): _______ your father work at the bank?",
      options: ["A. Does", "B. Are", "C. Do"],
      correct: 0,
      explain: "Chủ ngữ số ít 'your father' đi kèm động từ thường nguyên mẫu 'work' nên mượn trợ động từ 'A. Does'."
    },
    {
      id: "gk8-20",
      type: "MCQ",
      section: "Bài 2: Chọn đáp án đúng A, B hoặc C (10 câu)",
      q: "Câu 20 (Question 10): My sister _______ a novel every night.",
      options: ["A. reads always", "B. always reads", "C. always read"],
      correct: 1,
      explain: "Trạng từ tần suất 'always' đứng TRƯỚC động từ thường và chủ ngữ số ít 'My sister' nên 'read' thêm -s → 'B. always reads'."
    }
  ]
};