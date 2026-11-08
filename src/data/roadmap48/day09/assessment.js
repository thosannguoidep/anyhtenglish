window.Day09Assessment = {
  // 1. Bài tập hiển thị trực tiếp trong Tab "2. Ngữ Pháp" (Từ file NGÀY 9.pdf)
  quiz1: [
    { id: "d9-q1-1", q: "Question 1. He sings _______.", options: ["A. beautiful", "B. beautifully"], correct: 1, explain: "Bổ nghĩa cho động từ thường 'sings' cần dùng trạng từ 'beautifully'." },
    { id: "d9-q1-2", q: "Question 2. She is a great _______.", options: ["A. teacher", "B. teach"], correct: 0, explain: "Sau mạo từ 'a' và tính từ 'great' cần một danh từ chỉ người: 'teacher'." },
    { id: "d9-q1-3", q: "Question 3. My students are _______.", options: ["A. friendly", "B. friend"], correct: 0, explain: "Sau động từ to be 'are' cần một tính từ: 'friendly' (thân thiện - có đuôi -ly nhưng là tính từ)." },
    { id: "d9-q1-4", q: "Question 4. This question is _______.", options: ["A. easily", "B. easy"], correct: 1, explain: "Sau động từ to be 'is' cần một tính từ để mô tả cho chủ ngữ 'This question': 'easy'." }
  ],

  practice: [
    { id: "d9-p-1", q: "Câu 1: 'Her mother is happy.' — Hai từ 'mother' và 'happy' lần lượt thuộc từ loại nào?", options: ["A. Danh từ – Tính từ", "B. Tính từ – Trạng từ"], correct: 0, explain: "'mother' đứng sau tính từ sở hữu 'Her' là Danh từ; 'happy' đứng sau 'is' là Tính từ." },
    { id: "d9-p-2", q: "Câu 2: 'They have a lovely flat.' — Hai từ 'lovely' và 'flat' lần lượt thuộc từ loại nào?", options: ["A. Trạng từ – Danh từ", "B. Tính từ – Danh từ"], correct: 1, explain: "'lovely' (đáng yêu) là Tính từ đứng trước bổ nghĩa cho Danh từ 'flat' (căn hộ)." },
    { id: "d9-p-3", q: "Câu 3: 'He drives carefully.' — Từ 'carefully' thuộc từ loại nào?", options: ["A. Tính từ", "B. Trạng từ"], correct: 1, explain: "'carefully' đứng sau bổ nghĩa cho động từ thường 'drives' nên là Trạng từ." },
    { id: "d9-p-4", q: "Câu 4: 'The book is very great.' — Các từ 'book', 'very', 'great' lần lượt là:", options: ["A. Danh từ – Trạng từ – Tính từ", "B. Danh từ – Tính từ – Trạng từ"], correct: 0, explain: "'book' (Danh từ) + is + 'very' (Trạng từ chỉ mức độ) + 'great' (Tính từ)." },
    { id: "d9-p-5", q: "Câu 5: 'The weather is nice.' — Hai từ 'weather' và 'nice' lần lượt là:", options: ["A. Danh từ – Tính từ", "B. Tính từ – Danh từ"], correct: 0, explain: "'weather' đứng sau mạo từ 'The' là Danh từ; 'nice' đứng sau 'is' là Tính từ." },
    { id: "d9-p-6", q: "Câu 6: 'His room is tidy.' — Hai từ 'room' và 'tidy' lần lượt là:", options: ["A. Danh từ – Tính từ", "B. Danh từ – Trạng từ"], correct: 0, explain: "'room' đứng sau 'His' là Danh từ; 'tidy' (gọn gàng) đứng sau 'is' là Tính từ." },
    { id: "d9-p-7", q: "Câu 7: 'He sings well.' — Từ 'well' thuộc từ loại nào?", options: ["A. Tính từ", "B. Trạng từ"], correct: 1, explain: "'well' (tốt, hay) đứng sau bổ nghĩa cho động từ thường 'sings' nên là Trạng từ." },
    { id: "d9-p-8", q: "Câu 8: 'The homework is easy.' — Hai từ 'homework' và 'easy' lần lượt là:", options: ["A. Danh từ – Tính từ", "B. Động từ – Trạng từ"], correct: 0, explain: "'homework' là Danh từ làm chủ ngữ; 'easy' đứng sau 'is' là Tính từ." },
    { id: "d9-p-9", q: "Câu 9: 'Her daughter is careless.' — Hai từ 'daughter' và 'careless' lần lượt là:", options: ["A. Danh từ – Tính từ", "B. Danh từ – Trạng từ"], correct: 0, explain: "'daughter' là Danh từ; 'careless' (đuôi -less: bất cẩn) đứng sau 'is' là Tính từ." },
    { id: "d9-p-10", q: "Câu 10: 'The boy is quite active.' — Các từ 'boy', 'quite', 'active' lần lượt là:", options: ["A. Danh từ – Trạng từ – Tính từ", "B. Danh từ – Tính từ – Trạng từ"], correct: 0, explain: "'boy' (Danh từ) + is + 'quite' (Trạng từ chỉ mức độ) + 'active' (Tính từ)." }
  ],

  // 2. ĐỀ THI ONLINE UNIT 9 (20 CÂU TRÍCH XUẤT 100% TỪ FILE "NGÀY 9- kiểm tra.pdf")
  gatekeeperExam: [
    // BÀI 1: Chọn đáp án chỉ ra cách sắp xếp từ loại phù hợp (5 câu)
    {
      id: "gk9-1",
      type: "MCQ",
      section: "Bài 1: Chọn cách sắp xếp trật tự từ loại phù hợp (5 câu)",
      q: "Câu 1: Chọn cụm từ có trật tự từ loại ĐÚNG (Tính từ + Danh từ):",
      options: ["A. flowers beautiful", "B. beautiful flowers"],
      correct: 1,
      explain: "Trong tiếng Anh, Tính từ ('beautiful') luôn đứng TRƯỚC Danh từ ('flowers') → 'B. beautiful flowers'."
    },
    {
      id: "gk9-2",
      type: "MCQ",
      section: "Bài 1: Chọn cách sắp xếp trật tự từ loại phù hợp (5 câu)",
      q: "Câu 2: Chọn cụm từ có trật tự từ loại ĐÚNG (Trạng từ + Tính từ):",
      options: ["A. very good", "B. good very"],
      correct: 0,
      explain: "Trạng từ chỉ mức độ ('very') luôn đứng TRƯỚC Tính từ ('good') → 'A. very good'."
    },
    {
      id: "gk9-3",
      type: "MCQ",
      section: "Bài 1: Chọn cách sắp xếp trật tự từ loại phù hợp (5 câu)",
      q: "Câu 3: Chọn cụm từ có trật tự từ loại ĐÚNG (Tính từ + Danh từ):",
      options: ["A. nice weather", "B. weather nice"],
      correct: 0,
      explain: "Tính từ ('nice') đứng TRƯỚC Danh từ ('weather') → 'A. nice weather' (thời tiết đẹp)."
    },
    {
      id: "gk9-4",
      type: "MCQ",
      section: "Bài 1: Chọn cách sắp xếp trật tự từ loại phù hợp (5 câu)",
      q: "Câu 4: Chọn cụm từ có trật tự từ loại ĐÚNG (Động từ thường + Trạng từ):",
      options: ["A. fast go", "B. go fast"],
      correct: 1,
      explain: "Trạng từ chỉ cách thức ('fast') đứng SAU động từ thường ('go') → 'B. go fast' (đi nhanh)."
    },
    {
      id: "gk9-5",
      type: "MCQ",
      section: "Bài 1: Chọn cách sắp xếp trật tự từ loại phù hợp (5 câu)",
      q: "Câu 5: Chọn cụm từ có trật tự từ loại ĐÚNG (Trạng từ + Tính từ):",
      options: ["A. easy quite", "B. quite easy"],
      correct: 1,
      explain: "Trạng từ chỉ mức độ ('quite' - khá) đứng TRƯỚC Tính từ ('easy') → 'B. quite easy'."
    },

    // BÀI 2: Chọn đáp án để chỉ ra những từ được gạch chân trong câu thuộc từ loại nào (8 câu)
    {
      id: "gk9-6",
      type: "MCQ",
      section: "Bài 2: Xác định từ loại của từ được gạch chân (8 câu)",
      q: "Câu 6 (Question 1): She does her homework <u><strong class='text-blue-700'>carefully</strong></u>.",
      options: ["A. Tính từ", "B. Danh từ", "C. Trạng từ"],
      correct: 2,
      explain: "Từ 'carefully' (có đuôi -ly) đứng sau bổ nghĩa cho động từ thường 'does' nên là 'C. Trạng từ'."
    },
    {
      id: "gk9-7",
      type: "MCQ",
      section: "Bài 2: Xác định từ loại của từ được gạch chân (8 câu)",
      q: "Câu 7 (Question 2): My sister lives in a big <u><strong class='text-blue-700'>city</strong></u>.",
      options: ["A. Tính từ", "B. Danh từ", "C. Trạng từ"],
      correct: 1,
      explain: "Từ 'city' (thành phố - có đuôi -ty) đứng sau tính từ 'big' nên là 'B. Danh từ'."
    },
    {
      id: "gk9-8",
      type: "MCQ",
      section: "Bài 2: Xác định từ loại của từ được gạch chân (8 câu)",
      q: "Câu 8 (Question 3): The weather is <u><strong class='text-blue-700'>nice</strong></u> in the spring.",
      options: ["A. Tính từ", "B. Danh từ", "C. Trạng từ"],
      correct: 0,
      explain: "Từ 'nice' (tốt, đẹp) đứng sau động từ to be 'is' để mô tả thời tiết nên là 'A. Tính từ'."
    },
    {
      id: "gk9-9",
      type: "MCQ",
      section: "Bài 2: Xác định từ loại của từ được gạch chân (8 câu)",
      q: "Câu 9 (Question 4): Her mother washes the <u><strong class='text-blue-700'>dishes</strong></u> every day.",
      options: ["A. Tính từ", "B. Danh từ", "C. Trạng từ"],
      correct: 1,
      explain: "Từ 'dishes' (bát đĩa) đứng sau mạo từ 'the' nên là 'B. Danh từ'."
    },
    {
      id: "gk9-10",
      type: "MCQ",
      section: "Bài 2: Xác định từ loại của từ được gạch chân (8 câu)",
      q: "Câu 10 (Question 5): Quang and Hung are <u><strong class='text-blue-700'>great</strong></u> friends.",
      options: ["A. Tính từ", "B. Danh từ", "C. Trạng từ"],
      correct: 0,
      explain: "Từ 'great' (tuyệt vời) đứng trước danh từ 'friends' nên là 'A. Tính từ'."
    },
    {
      id: "gk9-11",
      type: "MCQ",
      section: "Bài 2: Xác định từ loại của từ được gạch chân (8 câu)",
      q: "Câu 11 (Question 6): Our children are <u><strong class='text-blue-700'>very</strong></u> active.",
      options: ["A. Tính từ", "B. Danh từ", "C. Trạng từ"],
      correct: 2,
      explain: "Từ 'very' (rất) đứng trước tính từ 'active' để chỉ mức độ nên là 'C. Trạng từ'."
    },
    {
      id: "gk9-12",
      type: "MCQ",
      section: "Bài 2: Xác định từ loại của từ được gạch chân (8 câu)",
      q: "Câu 12 (Question 7): They are <u><strong class='text-blue-700'>beautiful</strong></u> pictures.",
      options: ["A. Tính từ", "B. Danh từ", "C. Trạng từ"],
      correct: 0,
      explain: "Từ 'beautiful' (đuôi -ful) đứng trước danh từ 'pictures' nên là 'A. Tính từ'."
    },
    {
      id: "gk9-13",
      type: "MCQ",
      section: "Bài 2: Xác định từ loại của từ được gạch chân (8 câu)",
      q: "Câu 13 (Question 8): The homework is <u><strong class='text-blue-700'>quite</strong></u> easy.",
      options: ["A. Tính từ", "B. Danh từ", "C. Trạng từ"],
      correct: 2,
      explain: "Từ 'quite' (khá) đứng trước tính từ 'easy' để chỉ mức độ nên là 'C. Trạng từ'."
    },

    // BÀI 3: Chọn đáp án chỉ ra vị trí phù hợp (A) hoặc (B) trong câu của mỗi từ trong ngoặc (7 câu)
    {
      id: "gk9-14",
      type: "MCQ",
      section: "Bài 3: Chọn vị trí (A) hoặc (B) phù hợp cho từ trong ngoặc (7 câu)",
      q: "Câu 14 (Question 1): Kien is an (A) student (B) in my class. — Vị trí của từ (active):",
      options: ["A. Vị trí (A) → an active student", "B. Vị trí (B) → an student active"],
      correct: 0,
      explain: "'active' là tính từ nên phải đứng ở vị trí (A) ngay trước danh từ 'student': 'Kien is an active student in my class.'."
    },
    {
      id: "gk9-15",
      type: "MCQ",
      section: "Bài 3: Chọn vị trí (A) hoặc (B) phù hợp cho từ trong ngoặc (7 câu)",
      q: "Câu 15 (Question 2): The water is (A) hot (B). — Vị trí của từ (very):",
      options: ["A. Vị trí (A) → is very hot", "B. Vị trí (B) → is hot very"],
      correct: 0,
      explain: "'very' là trạng từ chỉ mức độ nên phải đứng ở vị trí (A) ngay trước tính từ 'hot': 'The water is very hot.'."
    },
    {
      id: "gk9-16",
      type: "MCQ",
      section: "Bài 3: Chọn vị trí (A) hoặc (B) phù hợp cho từ trong ngoặc (7 câu)",
      q: "Câu 16 (Question 3): He doesn't understand this (A) question (B). — Vị trí của từ (easy):",
      options: ["A. Vị trí (A) → this easy question", "B. Vị trí (B) → this question easy"],
      correct: 0,
      explain: "'easy' là tính từ nên đứng ở vị trí (A) trước danh từ 'question': 'He doesn't understand this easy question.'."
    },
    {
      id: "gk9-17",
      type: "MCQ",
      section: "Bài 3: Chọn vị trí (A) hoặc (B) phù hợp cho từ trong ngoặc (7 câu)",
      q: "Câu 17 (Question 4): (A) Jimmy swims (B). — Vị trí của từ (quickly):",
      options: ["A. Vị trí (A) → Quickly Jimmy swims", "B. Vị trí (B) → Jimmy swims quickly"],
      correct: 1,
      explain: "'quickly' là trạng từ chỉ cách thức nên đứng ở vị trí (B) sau động từ thường 'swims': 'Jimmy swims quickly.'."
    },
    {
      id: "gk9-18",
      type: "MCQ",
      section: "Bài 3: Chọn vị trí (A) hoặc (B) phù hợp cho từ trong ngoặc (7 câu)",
      q: "Câu 18 (Question 5): The film is (A) good (B). — Vị trí của từ (quite):",
      options: ["A. Vị trí (A) → is quite good", "B. Vị trí (B) → is good quite"],
      correct: 0,
      explain: "'quite' là trạng từ chỉ mức độ nên đứng ở vị trí (A) trước tính từ 'good': 'The film is quite good.'."
    },
    {
      id: "gk9-19",
      type: "MCQ",
      section: "Bài 3: Chọn vị trí (A) hoặc (B) phù hợp cho từ trong ngoặc (7 câu)",
      q: "Câu 19 (Question 6): (A) They drive (B). — Vị trí của từ (carelessly):",
      options: ["A. Vị trí (A) → Carelessly they drive", "B. Vị trí (B) → They drive carelessly"],
      correct: 1,
      explain: "'carelessly' là trạng từ chỉ cách thức nên đứng ở vị trí (B) sau động từ thường 'drive': 'They drive carelessly.'."
    },
    {
      id: "gk9-20",
      type: "MCQ",
      section: "Bài 3: Chọn vị trí (A) hoặc (B) phù hợp cho từ trong ngoặc (7 câu)",
      q: "Câu 20 (Question 7): My grandparents have (A) two (B) cats. — Vị trí của từ (small):",
      options: ["A. Vị trí (A) → small two cats", "B. Vị trí (B) → two small cats"],
      correct: 1,
      explain: "Tính từ 'small' đứng sau số đếm 'two' và ngay trước danh từ 'cats' ở vị trí (B): 'My grandparents have two small cats.'."
    }
  ]
};