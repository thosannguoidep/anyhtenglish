window.Unit3Data = {
  id: "unit3",
  title: "UNIT 3: INTERNET BROWSING",
  pages: "Slide Bài Giảng Trên Lớp",
  description: "Từ vựng và cụm từ chuyên ngành về trình duyệt Web, thao tác Internet và luyện gõ từ vựng (Văn bản câu trả lời ngắn).",

  // Danh sách từ vựng & cụm từ trích xuất từ 2 slide máy chiếu + ảnh mẫu
  vocabulary: [
    { id: 1, word: "Web address", ipa: "/ˈweb əˌdres/", meaning: "Địa chỉ trang web", group: "Từ vựng (Browser UI)" },
    { id: 2, word: "Bookmarks bar", ipa: "/ˈbʊkmɑːks bɑːr/", meaning: "Thanh dấu trang", group: "Từ vựng (Browser UI)" },
    { id: 3, word: "Back button", ipa: "/bæk ˈbʌtn/", meaning: "Nút quay lại", group: "Từ vựng (Browser UI)" },
    { id: 4, word: "Tab", ipa: "/tæb/", meaning: "Thẻ (trên trình duyệt)", group: "Từ vựng (Browser UI)" },
    { id: 5, word: "Link", ipa: "/lɪŋk/", meaning: "Đường liên kết", group: "Từ vựng (Browser UI)" },
    { id: 6, word: "Refresh button", ipa: "/rɪˈfreʃ ˈbʌtn/", meaning: "Nút làm mới / tải lại trang", group: "Từ vựng (Browser UI)" },
    { id: 7, word: "follow a link", ipa: "/ˈfɒləʊ ə lɪŋk/", meaning: "Truy cập theo đường liên kết", group: "Cụm từ (Internet Actions)" },
    { id: 8, word: "take part in a webinar", ipa: "/teɪk pɑːt ɪn ə ˈwebɪnɑːr/", meaning: "Tham gia hội thảo trực tuyến", group: "Cụm từ (Internet Actions)" },
    { id: 9, word: "stream video", ipa: "/striːm ˈvɪdiəʊ/", meaning: "Phát video trực tuyến", group: "Cụm từ (Internet Actions)" },
    { id: 10, word: "update your status", ipa: "/ʌpˈdeɪt jɔː ˈsteɪtəs/", meaning: "Cập nhật trạng thái", group: "Cụm từ (Internet Actions)" },
    { id: 11, word: "post a comment", ipa: "/pəʊst ə ˈkɒment/", meaning: "Đăng bình luận", group: "Cụm từ (Internet Actions)" },
    { id: 12, word: "download photos", ipa: "/ˌdaʊnˈləʊd ˈfəʊtəʊz/", meaning: "Tải ảnh xuống", group: "Cụm từ (Internet Actions)" },
    { id: 13, word: "browse web pages", ipa: "/braʊz web ˈpeɪdʒɪz/", meaning: "Duyệt các trang web", group: "Cụm từ (Internet Actions)" },
    { id: 14, word: "enter a password", ipa: "/ˈentər ə ˈpɑːswɜːd/", meaning: "Nhập mật khẩu", group: "Cụm từ (Internet Actions)" },
    { id: 15, word: "Speaker", ipa: "/ˈspiːkər/", meaning: "Loa", group: "Thiết bị ngoại vi (Mẫu)" }
  ],

  // Câu hỏi trắc nghiệm củng cố nhanh cho Unit 3
  mcqs: [
    { id: 1, q: "1. Where do you type the URL such as 'https://github.com'?", options: ["a) Back button", "b) Web address", "c) Bookmarks bar", "d) Refresh button"], correct: 1, paperChoice: 1, explanation: "Địa chỉ trang web (Web address) là nơi nhập đường dẫn URL." },
    { id: 2, q: "2. Which button reloads the current web page?", options: ["a) Refresh button", "b) Back button", "c) Tab", "d) Link"], correct: 0, paperChoice: 0, explanation: "Refresh button = Nút làm mới / tải lại trang." },
    { id: 3, q: "3. What phrase means 'watching a video online without downloading the file first'?", options: ["a) download photos", "b) post a comment", "c) stream video", "d) enter a password"], correct: 2, paperChoice: 2, explanation: "stream video = Phát video trực tuyến." },
    { id: 4, q: "4. To join an online seminar on Zoom or Google Meet, you _______.", options: ["a) update your status", "b) take part in a webinar", "c) browse web pages", "d) follow a link"], correct: 1, paperChoice: 1, explanation: "take part in a webinar = Tham gia hội thảo trực tuyến." }
  ],

  cloze: {
    title: "Internet Browsing Habits",
    wordBank: ["Web address", "Bookmarks bar", "Refresh button", "follow a link", "stream video", "enter a password"],
    blanks: [
      { index: 1, answer: "Web address", context: "First, open your browser and type the (1) _______ into the address bar." },
      { index: 2, answer: "Bookmarks bar", context: "You can save your favorite websites on the (2) _______ for quick access." },
      { index: 3, answer: "follow a link", context: "Click on the blue text to (3) _______ to another web page." },
      { index: 4, answer: "Refresh button", context: "If the page does not load properly, click the (4) _______ to reload it." },
      { index: 5, answer: "enter a password", context: "To log in to your account, you must (5) _______ that is alphanumeric." },
      { index: 6, answer: "stream video", context: "High-speed internet allows users to (6) _______ in 4K smoothly." }
    ]
  },

  matching: [
    { id: 1, term: "1. Web address", correctLetter: "C", definition: "C. Địa chỉ trang web (URL)" },
    { id: 2, term: "2. Bookmarks bar", correctLetter: "A", definition: "A. Thanh dấu trang lưu các web yêu thích" },
    { id: 3, term: "3. Refresh button", correctLetter: "D", definition: "D. Nút làm mới / tải lại trang" },
    { id: 4, term: "4. take part in a webinar", correctLetter: "B", definition: "B. Tham gia hội thảo trực tuyến" },
    { id: 5, term: "5. browse web pages", correctLetter: "E", definition: "E. Duyệt các trang web" }
  ],

  translations: [
    {
      id: "u3-en-1",
      direction: "EN_TO_VI",
      source: "1. You can click the refresh button to reload the web page, or click the back button to return to the previous tab.",
      handwritten: "Bạn có thể nhấn nút làm mới để tải lại trang web, hoặc nhấn nút quay lại để trở về thẻ trước đó.",
      modelAnswer: "Bạn có thể nhấp vào nút làm mới để tải lại trang web, hoặc nhấp vào nút quay lại để trở về thẻ trước đó.",
      keywords: ["nút làm mới", "tải lại", "nút quay lại", "thẻ"]
    }
  ]
};