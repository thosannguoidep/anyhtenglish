window.Roadmap48Data = {
  title: "Lộ Trình 48 Ngày Lấy Gốc Toàn Diện Tiếng Anh",
  subtitle: "Lấy gốc Tiếng Anh & Luyện thi TOEIC (Nghe - Đọc) cấp tốc mục tiêu 550-700+ • Quản lý theo từng tệp ngày học độc lập.",
  phases: [
    {
      id: "phase1",
      name: "Giai đoạn 1 (Ngày 1 – 12)",
      title: "To Be, Từ Loại, Mạo Từ & Chuẩn Hóa Ngữ Âm IPA",
      desc: "Nắm vững các ngôi nhân xưng, tính từ sở hữu, mạo từ a/an/the, động từ To Be và nền tảng từ loại."
    },
    {
      id: "phase2",
      name: "Giai đoạn 2 (Ngày 13 – 24)",
      title: "Làm Chủ 6 Thì Cốt Lõi & Cấu Trúc Câu Đơn",
      desc: "Nắm chắc công thức, dấu hiệu nhận biết 6 thì quan trọng nhất và 5 mẫu câu giao tiếp cơ bản."
    },
    {
      id: "phase3",
      name: "Giai đoạn 3 (Ngày 25 – 36)",
      title: "Ngữ Pháp Trung Cấp & Tư Duy Ghép Câu Phức",
      desc: "Chinh phục Câu bị động, Câu điều kiện, Mệnh đề quan hệ và Liên từ học thuật."
    },
    {
      id: "phase4",
      name: "Giai đoạn 4 (Ngày 37 – 48)",
      title: "Thực Chiến Giao Tiếp, Email, Đọc Hiểu & TOEIC",
      desc: "Ứng dụng vào viết Email, họp trực tuyến, phỏng vấn xin việc và giải đề chuẩn TOEIC."
    }
  ],

  days: Array.from({ length: 48 }, (_, idx) => {
    const dayNum = idx + 1;
    const phaseId =
      dayNum <= 12 ? "phase1" :
      dayNum <= 24 ? "phase2" :
      dayNum <= 36 ? "phase3" : "phase4";

    return {
      day: dayNum,
      phaseId,
      isPlaceholder: true,
      title: `Bài học Ngày ${dayNum} (Chưa nạp tệp day${String(dayNum).padStart(2, "0")}.js)`,
      formula: `Hãy tạo tệp src/data/roadmap48/day${String(dayNum).padStart(2, "0")}.js`,
      theory: `Khi có tài liệu Ngày ${dayNum}, bạn chỉ cần tạo tệp day${String(dayNum).padStart(2, "0")}.js trong thư mục src/data/roadmap48/.`,
      vocab: [],
      quiz: []
    };
  })
};

window.registerRoadmapDay = function (dayObject) {
  if (!dayObject || !dayObject.day) return;
  const targetIndex = window.Roadmap48Data.days.findIndex(d => d.day === dayObject.day);
  const normalizedDay = { ...dayObject, isPlaceholder: false };

  if (targetIndex !== -1) {
    window.Roadmap48Data.days[targetIndex] = normalizedDay;
  } else {
    window.Roadmap48Data.days.push(normalizedDay);
    window.Roadmap48Data.days.sort((a, b) => a.day - b.day);
  }
};