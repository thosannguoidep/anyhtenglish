# 🎓 LingoPro — Full-Stack IT English (ESP) & TOEIC Platform

Nền tảng học Tiếng Anh Chuyên Ngành Công Nghệ Thông Tin (**Unit 1: Working in IT** & **Unit 2: IT Systems**) kết hợp ôn luyện từ vựng lặp lại ngắt quãng (**Spaced Repetition SM-2**) và Phòng thi ảo **TOEIC Reading Part 7**.

## 🚀 Kiến trúc Hệ thống (Full-Stack Architecture)

- **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript (Modular MVC Architecture), Web Speech API, Web Audio Synthesizer.
- **Backend:** Node.js, Express.js, RESTful API, JWT Role-based Access Control (`ADMIN` / `LEARNER`).
- **Database:** MongoDB & Mongoose ORM (Tích hợp công cụ nạp tự động 80 thuật ngữ và 60 câu hỏi qua `seedRunner.js`).

## 📂 Cấu trúc Thư mục

```text
lingopro-edtech/
├── index.html                  # Giao diện chính (Chạy trực tiếp trên GitHub Pages / Live Server)
├── assets/css/style.css        # Hiệu ứng 3D Flashcard & Bút dạ quang Highlight
├── src/
│   ├── data/                   # Dữ liệu Unit 1 (Trang 1-7), Unit 2 (Trang 8-13) & TOEIC
│   ├── services/               # AudioEngine (Web Speech API) & ApiClient
│   └── controllers/            # AppController điều phối giao diện & thuật toán SM-2
└── backend/                    # Máy chủ Node.js + Express + MongoDB
    ├── config/db.js
    ├── models/
    ├── controllers/
    ├── routes/
    ├── seeds/seedRunner.js
    ├── package.json
    └── server.js