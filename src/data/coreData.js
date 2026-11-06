window.CoreData = {
  user: {
    name: "Lưu Văn Nam",
    role: "ADMIN",
    streak: 14,
    xp: 2450
  },

  initialSrsCards: [
    {
      id: "srs-1",
      word: "Database administrator",
      ipa: "/ˈdeɪtəbeɪs ədˈmɪnɪstreɪtər/",
      pos: "n. phrase",
      meaning: "Quản trị viên cơ sở dữ liệu (DBA)",
      example: "The database administrator is responsible for keeping corporate data secure.",
      unit: "Unit 1",
      efactor: 2.5,
      interval: 1,
      repetitions: 0
    },
    {
      id: "srs-2",
      word: "Alphanumeric",
      ipa: "/ˌælfənjuːˈmerɪk/",
      pos: "adj",
      meaning: "Bao gồm cả chữ cái và chữ số",
      example: "Passwords must be alphanumeric and at least eight characters long.",
      unit: "Unit 1",
      efactor: 2.5,
      interval: 1,
      repetitions: 0
    },
    {
      id: "srs-3",
      word: "System specifications",
      ipa: "/ˈsɪstəm ˌspesɪfɪˈkeɪʃənz/",
      pos: "n. phrase",
      meaning: "Bản đặc tả hệ thống / Thông số kỹ thuật",
      example: "Check the system specifications before installing the new software.",
      unit: "Unit 2",
      efactor: 2.5,
      interval: 1,
      repetitions: 0
    },
    {
      id: "srs-4",
      word: "Solid state drive (SSD)",
      ipa: "/ˈsɒlɪd steɪt draɪv/",
      pos: "n. phrase",
      meaning: "Ổ đĩa thể rắn (tốc độ cao, bền hơn HDD)",
      example: "A solid state drive is faster and more durable than a traditional hard drive.",
      unit: "Unit 2",
      efactor: 2.5,
      interval: 1,
      repetitions: 0
    },
    {
      id: "srs-5",
      word: "Peripherals",
      ipa: "/pəˈrɪfərəlz/",
      pos: "n. plural",
      meaning: "Thiết bị ngoại vi (chuột, bàn phím, máy in...)",
      example: "The keyboard, mouse, and printer are common computer peripherals.",
      unit: "Unit 2",
      efactor: 2.5,
      interval: 1,
      repetitions: 0
    },
    {
      id: "srs-6",
      word: "Open-source software",
      ipa: "/ˌəʊpən ˈsɔːs ˈsɒftweər/",
      pos: "n. phrase",
      meaning: "Phần mềm mã nguồn mở",
      example: "Anyone who knows how to code can modify open-source software.",
      unit: "Unit 2",
      efactor: 2.5,
      interval: 1,
      repetitions: 0
    }
  ],

  toeicExam: {
    title: "TOEIC Reading Part 7 — IT System Maintenance & Server Upgrade",
    timeLimitSeconds: 600,
    passageHtml: `
      <div class="space-y-4 text-sm leading-relaxed">
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-700">
          <p class="text-xs text-indigo-400 font-mono uppercase mb-1">Memo 1 — Internal Notice</p>
          <p><strong>To:</strong> All Engineering & Operations Staff</p>
          <p><strong>From:</strong> Marcus Vance, Chief Information Officer (CIO)</p>
          <p><strong>Date:</strong> November 10, 2026</p>
          <p><strong>Subject:</strong> Scheduled Database Server Upgrade & Security Policy</p>
          <hr class="my-2 border-slate-800"/>
          <p>Please be advised that our Database Administrators and Support Technicians will conduct a critical hardware upgrade this Saturday from 10:00 PM to 04:00 AM. During this window, all legacy mechanical hard disk drives (HDDs) in Server Rack B will be replaced with high-speed <strong>Solid State Drives (SSDs)</strong>, and server memory will be expanded via the DIMM slots.</p>
          <p class="mt-2">To prevent data loss, all employees must <strong>back up important files</strong> to the cloud storage before Friday at 6:00 PM. Additionally, following our new security protocol, every employee must update their login credentials to an <strong>alphanumeric password</strong> of at least 10 characters.</p>
        </div>
      </div>
    `,
    questions: [
      {
        id: 147,
        q: "Who sent the internal notice regarding the server upgrade?",
        options: [
          "A. A support technician",
          "B. The Chief Information Officer (CIO)",
          "C. An external hardware vendor",
          "D. The project manager"
        ],
        correct: 1,
        explanation: "Trong phần đầu Memo ghi rõ: 'From: Marcus Vance, Chief Information Officer (CIO)'."
      },
      {
        id: 148,
        q: "What hardware component is being installed to replace the legacy hard disk drives?",
        options: [
          "A. Optical drives",
          "B. Power supply units",
          "C. Solid State Drives (SSDs)",
          "D. Graphics card sockets"
        ],
        correct: 2,
        explanation: "Đoạn 1 nêu rõ: 'all legacy mechanical hard disk drives (HDDs)... will be replaced with high-speed Solid State Drives (SSDs)'."
      },
      {
        id: 149,
        q: "What are employees required to do before Friday at 6:00 PM?",
        options: [
          "A. Install new open-source software",
          "B. Back up their important files",
          "C. Attend a teleconference",
          "D. Replace their computer monitors"
        ],
        correct: 1,
        explanation: "Đoạn 2 yêu cầu: 'all employees must back up important files to the cloud storage before Friday at 6:00 PM'."
      }
    ]
  }
};