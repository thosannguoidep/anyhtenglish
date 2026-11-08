window.Day05Assessment = {
  // 1. Bài tập hiển thị trực tiếp trong Tab "2. Ngữ Pháp" (Từ file NGÀY 5.pdf)
  quiz1: [
    { id: "d5-q1-1", q: "Question 1. They _______ to school by bus.", options: ["A. goes", "B. go"], correct: 1, explain: "Chủ ngữ 'They' giữ nguyên động từ 'go'." },
    { id: "d5-q1-2", q: "Question 2. Trang _______ playing the guitar.", options: ["A. likes", "B. like"], correct: 0, explain: "Chủ ngữ tên riêng 1 người 'Trang' (ngôi She) đi với động từ thêm -s: 'likes'." },
    { id: "d5-q1-3", q: "Question 3. Her cousins _______ in Da Nang.", options: ["A. live", "B. lives"], correct: 0, explain: "Chủ ngữ số nhiều 'Her cousins' đi với động từ nguyên mẫu 'live'." },
    { id: "d5-q1-4", q: "Question 4. He _______ two brothers.", options: ["A. has", "B. have"], correct: 0, explain: "Chủ ngữ 'He' đi với 'has' (dạng chia ngôi thứ 3 số ít của 'have')." }
  ],

  practice: [
    { id: "d5-p-1", q: "Question 1. We _______ to school every day.", options: ["A. walks", "B. walk"], correct: 1, explain: "Chủ ngữ 'We' đi với động từ nguyên mẫu 'walk'." },
    { id: "d5-p-2", q: "Question 2. Hung _______ in Hanoi.", options: ["A. lives", "B. live"], correct: 0, explain: "Chủ ngữ tên riêng số ít 'Hung' đi với 'lives'." },
    { id: "d5-p-3", q: "Question 3. Tom _______ to school by bike.", options: ["A. go", "B. goes"], correct: 1, explain: "Chủ ngữ số ít 'Tom' đi với 'goes'." },
    { id: "d5-p-4", q: "Question 4. My sisters _______ books in the evening.", options: ["A. read", "B. reads"], correct: 0, explain: "Chủ ngữ số nhiều 'My sisters' đi với động từ nguyên mẫu 'read'." },
    { id: "d5-p-5", q: "Question 5. She _______ the dishes after dinner.", options: ["A. washes", "B. wash"], correct: 0, explain: "Chủ ngữ số ít 'She' + động từ kết thúc bằng -sh thêm -es: 'washes'." },
    { id: "d5-p-6", q: "Question 6. Nam _______ his mother with housework.", options: ["A. help", "B. helps"], correct: 1, explain: "Chủ ngữ số ít 'Nam' đi với 'helps'." },
    { id: "d5-p-7", q: "Question 7. My parents _______ coffee in the morning.", options: ["A. drink", "B. drinks"], correct: 0, explain: "Chủ ngữ số nhiều 'My parents' đi với động từ nguyên mẫu 'drink'." },
    { id: "d5-p-8", q: "Question 8. My grandmother _______ a big dog.", options: ["A. has", "B. have"], correct: 0, explain: "Chủ ngữ số ít 'My grandmother' (bà của tôi) đi với 'has'." },
    { id: "d5-p-9", q: "Question 9. Jane _______ homework after lunchtime.", options: ["A. does", "B. do"], correct: 0, explain: "Chủ ngữ số ít 'Jane' đi với 'does'." },
    { id: "d5-p-10", q: "Question 10. They _______ to play the guitar.", options: ["A. learn", "B. learns"], correct: 0, explain: "Chủ ngữ 'They' đi với động từ nguyên mẫu 'learn'." },
    { id: "d5-p-11", q: "Question 11. My brother _______ at noon.", options: ["A. eats", "B. eat"], correct: 0, explain: "Chủ ngữ số ít 'My brother' đi với 'eats'." },
    { id: "d5-p-12", q: "Question 12. Her sister _______ singing.", options: ["A. enjoys", "B. enjoy"], correct: 0, explain: "Chủ ngữ số ít 'Her sister' đi với 'enjoys' (trước y là nguyên âm o nên chỉ thêm -s)." },
    { id: "d5-p-13", q: "Question 13. Tuan _______ to work by bus.", options: ["A. travel", "B. travels"], correct: 1, explain: "Chủ ngữ số ít 'Tuan' đi với 'travels'." },
    { id: "d5-p-14", q: "Question 14. Our son _______ his bike to school.", options: ["A. rides", "B. ride"], correct: 0, explain: "Chủ ngữ số ít 'Our son' (con trai chúng tôi) đi với 'rides'." },
    { id: "d5-p-15", q: "Question 15. My daughter _______ badminton with her friends in the afternoon.", options: ["A. plays", "B. play"], correct: 0, explain: "Chủ ngữ số ít 'My daughter' (con gái tôi) đi với 'plays'." }
  ],

  // 2. ĐỀ THI ONLINE UNIT 5 (20 CÂU TRÍCH XUẤT 100% TỪ FILE "NGÀY 5- kiểm tra.pdf")
  gatekeeperExam: [
    // BÀI 1: Thêm đuôi 's/es' cho các động từ tương ứng ở cột bên trái (8 câu tự luận ngắn)
    {
      id: "gk5-1",
      type: "INPUT",
      section: "Bài 1: Thêm đuôi 's/es' cho các động từ sau (8 câu)",
      prompt: "Câu 1: watch (xem) → Thêm đuôi s/es:",
      answer: "watches",
      explain: "Động từ 'watch' kết thúc bằng '-ch' nên ta thêm '-es' → watches."
    },
    {
      id: "gk5-2",
      type: "INPUT",
      section: "Bài 1: Thêm đuôi 's/es' cho các động từ sau (8 câu)",
      prompt: "Câu 2: study (học) → Thêm đuôi s/es:",
      answer: "studies",
      explain: "Động từ 'study' kết thúc bằng phụ âm 'd' + 'y' nên đổi 'y' thành 'i' rồi thêm '-es' → studies."
    },
    {
      id: "gk5-3",
      type: "INPUT",
      section: "Bài 1: Thêm đuôi 's/es' cho các động từ sau (8 câu)",
      prompt: "Câu 3: play (chơi) → Thêm đuôi s/es:",
      answer: "plays",
      explain: "Động từ 'play' kết thúc bằng nguyên âm 'a' + 'y' nên giữ nguyên 'y' và thêm '-s' → plays."
    },
    {
      id: "gk5-4",
      type: "INPUT",
      section: "Bài 1: Thêm đuôi 's/es' cho các động từ sau (8 câu)",
      prompt: "Câu 4: dance (nhảy) → Thêm đuôi s/es:",
      answer: "dances",
      explain: "Động từ 'dance' tận cùng có sẵn chữ 'e' nên chỉ cần thêm '-s' → dances."
    },
    {
      id: "gk5-5",
      type: "INPUT",
      section: "Bài 1: Thêm đuôi 's/es' cho các động từ sau (8 câu)",
      prompt: "Câu 5: go (đi) → Thêm đuôi s/es:",
      answer: "goes",
      explain: "Động từ 'go' chuyển thành 'goes' khi đi với chủ ngữ ngôi thứ 3 số ít."
    },
    {
      id: "gk5-6",
      type: "INPUT",
      section: "Bài 1: Thêm đuôi 's/es' cho các động từ sau (8 câu)",
      prompt: "Câu 6: do (làm) → Thêm đuôi s/es:",
      answer: "does",
      explain: "Động từ 'do' chuyển thành 'does' khi đi với chủ ngữ ngôi thứ 3 số ít."
    },
    {
      id: "gk5-7",
      type: "INPUT",
      section: "Bài 1: Thêm đuôi 's/es' cho các động từ sau (8 câu)",
      prompt: "Câu 7: visit (ghé thăm) → Thêm đuôi s/es:",
      answer: "visits",
      explain: "Động từ 'visit' theo quy tắc thông thường chỉ cần thêm '-s' → visits."
    },
    {
      id: "gk5-8",
      type: "INPUT",
      section: "Bài 1: Thêm đuôi 's/es' cho các động từ sau (8 câu)",
      prompt: "Câu 8: wash (rửa) → Thêm đuôi s/es:",
      answer: "washes",
      explain: "Động từ 'wash' kết thúc bằng '-sh' nên ta thêm '-es' → washes."
    },

    // BÀI 2: Chọn đáp án đúng (12 câu trắc nghiệm Question 1 -> Question 12)
    {
      id: "gk5-9",
      type: "MCQ",
      section: "Bài 2: Chọn dạng đúng của động từ thường ở hiện tại (12 câu)",
      q: "Câu 9 (Question 1): She _______ letters to her friends.",
      options: ["A. write", "B. writes"],
      correct: 1,
      explain: "Chủ ngữ ngôi thứ 3 số ít 'She' đi với động từ thêm -s: 'writes'."
    },
    {
      id: "gk5-10",
      type: "MCQ",
      section: "Bài 2: Chọn dạng đúng của động từ thường ở hiện tại (12 câu)",
      q: "Câu 10 (Question 2): They _______ books before bedtime.",
      options: ["A. read", "B. reads"],
      correct: 0,
      explain: "Chủ ngữ số nhiều 'They' đi với động từ nguyên mẫu 'read'."
    },
    {
      id: "gk5-11",
      type: "MCQ",
      section: "Bài 2: Chọn dạng đúng của động từ thường ở hiện tại (12 câu)",
      q: "Câu 11 (Question 3): His sisters _______ maths at home.",
      options: ["A. study", "B. studies"],
      correct: 0,
      explain: "Chủ ngữ 'His sisters' (những người chị/em gái của anh ấy - số nhiều) đi với động từ nguyên mẫu 'study'."
    },
    {
      id: "gk5-12",
      type: "MCQ",
      section: "Bài 2: Chọn dạng đúng của động từ thường ở hiện tại (12 câu)",
      q: "Câu 12 (Question 4): My children _______ candies.",
      options: ["A. enjoy", "B. enjoys"],
      correct: 0,
      explain: "Chủ ngữ 'My children' (các con của tôi - danh từ số nhiều của child) đi với động từ nguyên mẫu 'enjoy'."
    },
    {
      id: "gk5-13",
      type: "MCQ",
      section: "Bài 2: Chọn dạng đúng của động từ thường ở hiện tại (12 câu)",
      q: "Câu 13 (Question 5): We _______ to music in the morning.",
      options: ["A. listen", "B. listens"],
      correct: 0,
      explain: "Chủ ngữ 'We' đi với động từ nguyên mẫu 'listen'."
    },
    {
      id: "gk5-14",
      type: "MCQ",
      section: "Bài 2: Chọn dạng đúng của động từ thường ở hiện tại (12 câu)",
      q: "Câu 14 (Question 6): My parents _______ TV at night.",
      options: ["A. watch", "B. watches"],
      correct: 0,
      explain: "Chủ ngữ số nhiều 'My parents' (bố mẹ tôi) đi với động từ nguyên mẫu 'watch'."
    },
    {
      id: "gk5-15",
      type: "MCQ",
      section: "Bài 2: Chọn dạng đúng của động từ thường ở hiện tại (12 câu)",
      q: "Câu 15 (Question 7): Her brother _______ his bike to university.",
      options: ["A. ride", "B. rides"],
      correct: 1,
      explain: "Chủ ngữ số ít 'Her brother' (anh/em trai của cô ấy) đi với động từ thêm -s: 'rides'."
    },
    {
      id: "gk5-16",
      type: "MCQ",
      section: "Bài 2: Chọn dạng đúng của động từ thường ở hiện tại (12 câu)",
      q: "Câu 16 (Question 8): She _______ the dishes after dinner.",
      options: ["A. wash", "B. washes"],
      correct: 1,
      explain: "Chủ ngữ số ít 'She' đi với động từ thêm -es: 'washes'."
    },
    {
      id: "gk5-17",
      type: "MCQ",
      section: "Bài 2: Chọn dạng đúng của động từ thường ở hiện tại (12 câu)",
      q: "Câu 17 (Question 9): Huy _______ at parties.",
      options: ["A. sing", "B. sings"],
      correct: 1,
      explain: "Chủ ngữ tên riêng số ít 'Huy' đi với động từ thêm -s: 'sings'."
    },
    {
      id: "gk5-18",
      type: "MCQ",
      section: "Bài 2: Chọn dạng đúng của động từ thường ở hiện tại (12 câu)",
      q: "Câu 18 (Question 10): They _______ their parents with housework.",
      options: ["A. help", "B. helps"],
      correct: 0,
      explain: "Chủ ngữ số nhiều 'They' đi với động từ nguyên mẫu 'help' (Lưu ý: trong bản in PDF gốc bị gõ lặp 'help' ở cả A và B, đáp án chuẩn là động từ nguyên mẫu 'help')."
    },
    {
      id: "gk5-19",
      type: "MCQ",
      section: "Bài 2: Chọn dạng đúng của động từ thường ở hiện tại (12 câu)",
      q: "Câu 19 (Question 11): Susan _______ badminton.",
      options: ["A. like", "B. likes"],
      correct: 1,
      explain: "Chủ ngữ tên riêng số ít 'Susan' đi với động từ thêm -s: 'likes'."
    },
    {
      id: "gk5-20",
      type: "MCQ",
      section: "Bài 2: Chọn dạng đúng của động từ thường ở hiện tại (12 câu)",
      q: "Câu 20 (Question 12): Their students _______ chess every day.",
      options: ["A. play", "B. plays"],
      correct: 0,
      explain: "Chủ ngữ số nhiều 'Their students' (các học sinh của họ) đi với động từ nguyên mẫu 'play'."
    }
  ]
};