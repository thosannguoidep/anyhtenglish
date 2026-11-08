window.Day02Assessment = {
  // 1. Các bài tập gắn trực tiếp vào từng mục trong Tab "2. Ngữ Pháp"
  quiz1: [
    { id: "d2-q1-1", prompt: "1. woman (người phụ nữ) → số nhiều:", answer: "women", hint: "Bất quy tắc: đổi a thành e" },
    { id: "d2-q1-2", prompt: "2. child (đứa trẻ) → số nhiều:", answer: "children", hint: "Bất quy tắc: thêm -ren" },
    { id: "d2-q1-3", prompt: "3. lawyer (luật sư) → số nhiều:", answer: "lawyers", hint: "Quy tắc thường: thêm -s" },
    { id: "d2-q1-4", prompt: "4. box (cái hộp) → số nhiều:", answer: "boxes", hint: "Tận cùng là -x: thêm -es" },
    { id: "d2-q1-5", prompt: "5. parent (bố/mẹ) → số nhiều:", answer: "parents", hint: "Quy tắc thường: thêm -s" }
  ],

  quiz2: [
    { id: "d2-q2-1", q: "Question 1. _______ woman is my friend.", options: ["A. These", "B. This"], correct: 1, explain: "'woman' là danh từ số ít nên đi với 'This'." },
    { id: "d2-q2-2", q: "Question 2. _______ cats are lovely.", options: ["A. That", "B. Those"], correct: 1, explain: "'cats' là danh từ số nhiều nên đi với 'Those'." },
    { id: "d2-q2-3", q: "Question 3. These boxes _______ big.", options: ["A. are", "B. is"], correct: 0, explain: "'These boxes' là số nhiều nên đi với động từ to be 'are'." },
    { id: "d2-q2-4", q: "Question 4. That room _______ new.", options: ["A. is", "B. are"], correct: 0, explain: "'That room' là số ít nên đi với động từ to be 'is'." }
  ],

  quiz3: [
    { id: "d2-q3-1", q: "Question 1. Here _______ your apples.", options: ["A. are", "B. is"], correct: 0, explain: "Phía sau là danh từ số nhiều 'your apples' nên dùng 'are'." },
    { id: "d2-q3-2", q: "Question 2. There _______ an orange.", options: ["A. is", "B. are"], correct: 0, explain: "Phía sau là danh từ số ít 'an orange' nên dùng 'is'." },
    { id: "d2-q3-3", q: "Question 3. There is a _______.", options: ["A. box", "B. boxes"], correct: 0, explain: "Có 'There is a...' nên theo sau phải là danh từ số ít 'box'." },
    { id: "d2-q3-4", q: "Question 4. Here are his _______.", options: ["A. pictures", "B. picture"], correct: 0, explain: "Có 'Here are...' nên theo sau phải là danh từ số nhiều 'pictures'." }
  ],

  quiz4: [
    { id: "d2-q4-1", q: "Question 1. _______ he a doctor?", options: ["A. Are", "B. Is"], correct: 1, explain: "Chủ ngữ 'he' đi với 'Is' đảo lên đầu câu." },
    { id: "d2-q4-2", q: "Question 2. _______ they late?", options: ["A. Are", "B. Is"], correct: 0, explain: "Chủ ngữ 'they' đi với 'Are' đảo lên đầu câu." },
    { id: "d2-q4-3", q: "Question 3. Is Johnny your son? – No, he _______.", options: ["A. aren't", "B. isn't"], correct: 1, explain: "Trả lời phủ định cho ngôi 'he' là 'No, he isn't'." },
    { id: "d2-q4-4", q: "Question 4. Are they your parents? – Yes, they _______.", options: ["A. aren't", "B. are"], correct: 1, explain: "Trả lời khẳng định cho ngôi 'they' là 'Yes, they are'." }
  ],

  practice: [
    { id: "d2-p-1", q: "Question 1. _______ she kind?", options: ["A. Is", "B. Are"], correct: 0, explain: "Chủ ngữ 'she' đi với 'Is'." },
    { id: "d2-p-2", q: "Question 2. _______ they your parents?", options: ["A. Am", "B. Are"], correct: 1, explain: "Chủ ngữ 'they' đi với 'Are'." },
    { id: "d2-p-3", q: "Question 3. _______ this your room?", options: ["A. Are", "B. Is"], correct: 1, explain: "Chủ ngữ 'this' (số ít) đi với 'Is'." },
    { id: "d2-p-4", q: "Question 4. Is their daughter tall? – Yes, she _______.", options: ["A. is", "B. are"], correct: 0, explain: "Yes, she is." },
    { id: "d2-p-5", q: "Question 5. Is this picture lovely? – Yes, it _______.", options: ["A. isn't", "B. is"], correct: 1, explain: "Trả lời khẳng định với Yes: 'Yes, it is'." },
    { id: "d2-p-6", q: "Question 6. _______ that a firefighter?", options: ["A. Is", "B. Am"], correct: 0, explain: "Chủ ngữ 'that' (số ít) đi với 'Is'." },
    { id: "d2-p-7", q: "Question 7. Is she a lawyer? – No, she _______.", options: ["A. am not", "B. isn't"], correct: 1, explain: "Trả lời phủ định với 'she': 'No, she isn't'." },
    { id: "d2-p-8", q: "Question 8. _______ these your children? – Yes, they are.", options: ["A. Is", "B. Are"], correct: 1, explain: "Chủ ngữ 'these' (số nhiều) đi với 'Are'." },
    { id: "d2-p-9", q: "Question 9. Is his son busy? – No, _______.", options: ["A. he isn't", "B. he is"], correct: 0, explain: "Trả lời với 'No' cho 'his son' (he): 'No, he isn't'." },
    { id: "d2-p-10", q: "Question 10. _______ your kitchen old? – No, it isn't.", options: ["A. Are", "B. Is"], correct: 1, explain: "Chủ ngữ 'your kitchen' (số ít) đi với 'Is'." }
  ],

  // 2. BỘ ĐỀ THI SÁT HẠCH QUA NGÀY 2 (MẪU KHÁC BIỆT HOÀN TOÀN — 15 CÂU ĐỂ XÉT ĐIỀU KIỆN >= 80%)
  gatekeeperExam: [
    // Dạng 1: Biến đổi câu & Điền từ chuẩn xác (5 câu gõ ngắn)
    { id: "gk2-1", type: "INPUT", section: "Phần I: Biến đổi danh từ & cấu trúc câu", prompt: "Câu 1: Viết dạng số nhiều của danh từ 'baby' (đứa bé):", answer: "babies", explain: "'baby' kết thúc bằng phụ âm + y nên đổi y thành i + es -> babies." },
    { id: "gk2-2", type: "INPUT", section: "Phần I: Biến đổi danh từ & cấu trúc câu", prompt: "Câu 2: Viết dạng số nhiều của cụm 'this box' (chiếc hộp này → những chiếc hộp này):", answer: "these boxes", explain: "this -> these; box -> boxes => these boxes." },
    { id: "gk2-3", type: "INPUT", section: "Phần I: Biến đổi danh từ & cấu trúc câu", prompt: "Câu 3: Điền 1 từ còn thiếu để tạo câu hỏi: '_______ there new pictures in the room?'", answer: "are", explain: "Danh từ phía sau 'new pictures' là số nhiều nên đảo 'Are' lên trước 'there'." },
    { id: "gk2-4", type: "INPUT", section: "Phần I: Biến đổi danh từ & cấu trúc câu", prompt: "Câu 4: Dịch sang tiếng Anh: 'Đây là những người bạn của tôi' (Dùng Here...):", answer: "here are my friends", explain: "Here + are + my friends (danh từ số nhiều)." },
    { id: "gk2-5", type: "INPUT", section: "Phần I: Biến đổi danh từ & cấu trúc câu", prompt: "Câu 5: Hoàn thành câu trả lời ngắn: 'Is that your uncle? – No, he _______.'", answer: "isn't", explain: "No, he isn't." },

    // Dạng 2: Nhận diện lỗi sai & Chọn cấu trúc đúng (5 câu 4 đáp án A, B, C, D)
    { id: "gk2-6", type: "MCQ", section: "Phần II: Ngữ pháp tổng hợp (4 lựa chọn)", q: "Câu 6: Câu nào dưới đây viết ĐÚNG ngữ pháp?", options: ["A. Those woman are kind.", "B. These women are kind.", "C. This women is kind.", "D. That women are kind."], correct: 1, explain: "'These' (số nhiều) + 'women' (số nhiều) + 'are' là hoàn toàn chính xác." },
    { id: "gk2-7", type: "MCQ", section: "Phần II: Ngữ pháp tổng hợp (4 lựa chọn)", q: "Câu 7: Điền cặp từ thích hợp: '_______ is my aunt, and _______ are my uncles over there.'", options: ["A. This / those", "B. These / that", "C. Those / this", "D. That / this"], correct: 0, explain: "Vế 1 có 'is my aunt' (số ít) dùng 'This'; vế 2 có 'are my uncles over there' (số nhiều ở xa) dùng 'those'." },
    { id: "gk2-8", type: "MCQ", section: "Phần II: Ngữ pháp tổng hợp (4 lựa chọn)", q: "Câu 8: Chuyển câu 'There is an old kitchen.' sang thể nghi vấn:", options: ["A. Are there an old kitchen?", "B. Is there an old kitchen?", "C. There is an old kitchen?", "D. Is this an old kitchen?"], correct: 1, explain: "Đảo 'Is' lên trước 'there' -> 'Is there an old kitchen?'." },
    { id: "gk2-9", type: "MCQ", section: "Phần II: Ngữ pháp tổng hợp (4 lựa chọn)", q: "Câu 9: Chọn danh từ phù hợp: 'Here are two _______ and three _______.'", options: ["A. box / apple", "B. boxes / apples", "C. boxs / apples", "D. boxes / apple"], correct: 1, explain: "Sau số lượng 'two' và 'three' đều phải dùng danh từ số nhiều: 'boxes' và 'apples'." },
    { id: "gk2-10", type: "MCQ", section: "Phần II: Ngữ pháp tổng hợp (4 lựa chọn)", q: "Câu 10: Chọn từ đúng: '_______ your parents busy today?'", options: ["A. Is", "B. Am", "C. Are", "D. Isn't"], correct: 2, explain: "Chủ ngữ 'your parents' (bố mẹ của bạn - số nhiều) đi với 'Are'." },

    // Dạng 3: Phản xạ Giao tiếp Hỏi – Đáp (5 câu tình huống)
    { id: "gk2-11", type: "MCQ", section: "Phần III: Phản xạ Hỏi – Đáp với To Be", q: "Câu 11: 'Am I late for the meeting?' – 'No, _______.'", options: ["A. I am not", "B. you aren't", "C. he isn't", "D. they aren't"], correct: 1, explain: "Khi người hỏi dùng 'Am I...?', người nghe trả lời bằng ngôi 'you': 'No, you aren't'." },
    { id: "gk2-12", type: "MCQ", section: "Phần III: Phản xạ Hỏi – Đáp với To Be", q: "Câu 12: 'Are these boxes new?' – 'Yes, _______.'", options: ["A. these are", "B. it is", "C. they are", "D. she is"], correct: 2, explain: "Khi câu hỏi dùng 'Are these/those + N số nhiều?', câu trả lời dùng đại từ 'they': 'Yes, they are'." },
    { id: "gk2-13", type: "MCQ", section: "Phần III: Phản xạ Hỏi – Đáp với To Be", q: "Câu 13: 'Is that man a firefighter?' – 'Yes, _______.'", options: ["A. it is", "B. he is", "C. that is", "D. they are"], correct: 1, explain: "'that man' chỉ người đàn ông nên câu trả lời dùng đại từ 'he': 'Yes, he is'." },
    { id: "gk2-14", type: "MCQ", section: "Phần III: Phản xạ Hỏi – Đáp với To Be", q: "Câu 14: 'Is this your daughter's book?' – 'No, _______.'", options: ["A. she isn't", "B. it isn't", "C. this isn't", "D. they aren't"], correct: 1, explain: "Chủ ngữ chính là 'book' (cuốn sách - vật số ít) nên trả lời bằng 'it': 'No, it isn't'." },
    { id: "gk2-15", type: "MCQ", section: "Phần III: Phản xạ Hỏi – Đáp với To Be", q: "Câu 15: 'Are there doctors in the room?' – 'Yes, _______.'", options: ["A. they are", "B. there are", "C. here are", "D. it is"], correct: 1, explain: "Câu hỏi bắt đầu bằng 'Are there...?' thì trả lời là 'Yes, there are.'." }
  ]
};