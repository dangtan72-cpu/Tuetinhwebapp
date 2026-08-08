export type Program = {
  slug: string;
  /** Mã ngành (Bộ GDĐT / mã nhà trường) */
  code: string;
  name: string;
  level: string;
  duration: string;
  summary: string;
  highlights: string[];
  image: string;
  category: "trung-cap" | "ngan-han";
  audience: string;
  tuition?: string;
  objectives: string[];
  curriculum: string[];
  careers: string[];
  documents: string[];
};

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}

export function getProgramByCode(code: string): Program | undefined {
  const key = code.trim().toLowerCase();
  return programs.find((p) => p.code.toLowerCase() === key);
}

export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
};

export type ScheduleItem = {
  id: string;
  day: string;
  time: string;
  subject: string;
  room: string;
  teacher: string;
};

export type GradeItem = {
  code: string;
  subject: string;
  credits: number;
  midterm: number;
  final: number;
  total: number;
};

export type CertificateRecord = {
  code: string;
  fullName: string;
  program: string;
  level: string;
  issueDate: string;
  status: "valid" | "revoked";
};

export const school = {
  name: "Trường Trung cấp Y Dược Tuệ Tĩnh Hà Nội",
  shortName: "Tuệ Tĩnh Hà Nội",
  tagline: "Đào tạo nguồn nhân lực y dược cổ truyền vì sức khỏe cộng đồng",
  phone: "+84 24 3643 5458",
  email: "daotao@yduoctuetinh.edu.vn",
  address: "Hà Nội, Việt Nam",
  facebook: "https://www.facebook.com/YDuocTueTinhHaNoi",
  youtube: "http://www.youtube.com/@yduoctuetinhhanoi",
  logo: "/brand/logo.webp",
  logoIcon: "/brand/logo-icon.png",
  heroImage: "/gallery/campus-1.webp",
  aboutImage: "/gallery/campus-2.webp",
  admissionsImage: "/gallery/admissions-banner.webp",
};

const commonDocuments = [
  "Đơn xin học (theo mẫu nhà trường)",
  "Sơ yếu lý lịch (theo mẫu nhà trường)",
  "CCCD photo công chứng",
  "Bằng cấp liên quan photo công chứng (theo yêu cầu từng mã ngành)",
  "04 ảnh 3×4 chụp trong vòng 6 tháng",
];

export const programs: Program[] = [
  {
    slug: "y-hoc-co-truyen",
    code: "5720102",
    name: "Y sĩ Y học cổ truyền",
    level: "Trung cấp",
    duration: "1,5–2 năm",
    summary:
      "Đào tạo y sĩ YHCT với nền tảng lý luận, chẩn trị và thực hành lâm sàng Đông y.",
    highlights: ["Châm cứu", "Bào chế đông dược", "Thực tập cơ sở"],
    image: "/gallery/career-yhct.webp",
    category: "trung-cap",
    audience:
      "Học sinh đã tốt nghiệp THPT hoặc tương đương; hoặc đã tốt nghiệp TC/CĐ/ĐH trở lên.",
    objectives: [
      "Nắm lý luận YHCT cơ bản và phương pháp chẩn trị Đông y.",
      "Thực hành châm cứu, xoa bóp, bào chế và kê đơn thuốc nam an toàn.",
      "Tham gia chăm sóc sức khỏe cộng đồng và liên thông lên CĐ/ĐH.",
    ],
    curriculum: [
      "Lý luận YHCT cơ bản",
      "Chẩn đoán học Đông y",
      "Kỹ thuật châm cứu – cứu ngải",
      "Dược liệu & bào chế đông dược",
      "Thực tập lâm sàng / cơ sở dưỡng sinh",
    ],
    careers: [
      "Cơ sở y tế công lập và tư nhân",
      "Phòng chẩn trị YHCT, dưỡng sinh",
      "Học liên thông CĐ, ĐH YHCT",
    ],
    documents: commonDocuments,
  },
  {
    slug: "y-si-da-khoa",
    code: "5720101",
    name: "Y sĩ đa khoa",
    level: "Trung cấp",
    duration: "1,5–2 năm",
    summary:
      "Đào tạo y sĩ đa khoa hệ trung cấp, sẵn sàng hỗ trợ khám chữa bệnh và chăm sóc ban đầu.",
    highlights: ["Y khoa cơ bản", "Thực hành lâm sàng", "Liên thông"],
    image: "/gallery/campus-2.webp",
    category: "trung-cap",
    audience:
      "Học sinh đã tốt nghiệp THPT hoặc tương đương; hoặc đã tốt nghiệp TC/CĐ/ĐH trở lên.",
    objectives: [
      "Trang bị kiến thức y khoa cơ bản và kỹ năng thực hành.",
      "Hỗ trợ khám chữa bệnh, sơ cấp cứu và chăm sóc người bệnh.",
      "Tạo lộ trình liên thông lên cao đẳng, đại học.",
    ],
    curriculum: [
      "Giải phẫu – Sinh lý",
      "Bệnh học nội – ngoại cơ bản",
      "Kỹ năng điều dưỡng & sơ cấp cứu",
      "Đạo đức nghề y",
      "Thực tập bệnh viện / trạm y tế",
    ],
    careers: [
      "Trạm y tế, phòng khám, bệnh viện",
      "Hỗ trợ khám chữa bệnh cộng đồng",
      "Liên thông CĐ/ĐH Y khoa, Điều dưỡng",
    ],
    documents: commonDocuments,
  },
  {
    slug: "dieu-duong",
    code: "5720301",
    name: "Điều dưỡng",
    level: "Trung cấp / Liên thông",
    duration: "24–36 tháng",
    summary:
      "Chương trình điều dưỡng gắn với chăm sóc toàn diện và kỹ năng thực hành lâm sàng.",
    highlights: ["Chăm sóc lâm sàng", "Đạo đức nghề", "Thực tập bệnh viện"],
    image: "/gallery/program-me-be.webp",
    category: "trung-cap",
    audience: "Tốt nghiệp THPT trở lên; ưu tiên thí sinh có định hướng ngành CSSK.",
    objectives: [
      "Thực hiện quy trình điều dưỡng và chăm sóc toàn diện.",
      "Giao tiếp, đạo đức nghề và phối hợp nhóm y tế.",
      "Thực tập tại bệnh viện, sẵn sàng làm việc sau tốt nghiệp.",
    ],
    curriculum: [
      "Điều dưỡng cơ bản",
      "Chăm sóc người bệnh nội – ngoại",
      "Dược lý điều dưỡng",
      "Đạo đức và pháp luật nghề",
      "Thực tập lâm sàng",
    ],
    careers: [
      "Điều dưỡng viên tại bệnh viện, phòng khám",
      "Chăm sóc sức khỏe cộng đồng",
      "Liên thông CĐ/ĐH Điều dưỡng",
    ],
    documents: commonDocuments,
  },
  {
    slug: "ky-thuat-vltl-phcn",
    code: "5720603",
    name: "Kỹ thuật VLTL – PHCN",
    level: "Trung cấp",
    duration: "24–36 tháng",
    summary:
      "Vật lý trị liệu và phục hồi chức năng kết hợp kiến thức YHCT ứng dụng.",
    highlights: ["VLTL", "PHCN", "Thực hành lâm sàng"],
    image: "/gallery/picture4.webp",
    category: "trung-cap",
    audience: "Tốt nghiệp THPT trở lên, đủ sức khỏe học tập và thực hành.",
    objectives: [
      "Áp dụng kỹ thuật VLTL – PHCN cho các nhóm bệnh thường gặp.",
      "Phối hợp YHCT và vật lý trị liệu trong chăm sóc người bệnh.",
      "Thực hành an toàn tại phòng kỹ thuật và cơ sở lâm sàng.",
    ],
    curriculum: [
      "Giải phẫu vận động",
      "Kỹ thuật VLTL cơ bản",
      "Phục hồi chức năng",
      "Tác động cột sống / xoa bóp hỗ trợ",
      "Thực tập lâm sàng",
    ],
    careers: [
      "Kỹ thuật viên VLTL – PHCN",
      "Cơ sở phục hồi chức năng, dưỡng sinh",
      "Liên thông chuyên ngành PHCN",
    ],
    documents: commonDocuments,
  },
  {
    slug: "ky-thuat-cham-cuu",
    code: "TT-CC-01",
    name: "Kỹ thuật châm cứu (KTV Châm cứu)",
    level: "Sơ cấp / Ngắn hạn",
    duration: "03 tháng",
    summary:
      "Tập trung kỹ thuật châm cứu, an toàn thực hành và ứng dụng điều trị thường gặp.",
    highlights: ["Thực hành huyệt", "An toàn kỹ thuật", "Ca lâm sàng"],
    image: "/gallery/activity-cham-cuu.webp",
    category: "ngan-han",
    audience: "Tốt nghiệp THPT trở lên.",
    tuition: "5.200.000đ",
    objectives: [
      "Nhận diện huyệt vị và thao tác châm cứu an toàn.",
      "Ứng dụng điều trị các chứng thường gặp theo YHCT.",
      "Nhận chứng chỉ sơ cấp kỹ thuật châm cứu.",
    ],
    curriculum: [
      "Lý thuyết huyệt vị cơ bản",
      "Kỹ thuật châm – cứu ngải",
      "An toàn và chống chỉ định",
      "Thực hành ca lâm sàng",
    ],
    careers: [
      "Hỗ trợ trị liệu tại phòng YHCT",
      "Bổ sung kỹ năng cho nhân viên CSSK",
      "Học tiếp các mã ngành YHCT khác",
    ],
    documents: commonDocuments,
  },
  {
    slug: "dieu-duong-so-cap",
    code: "TT-CC-02",
    name: "Điều dưỡng sơ cấp",
    level: "Sơ cấp / Ngắn hạn",
    duration: "06 tháng",
    summary:
      "Đào tạo kỹ năng điều dưỡng sơ cấp phục vụ chăm sóc người bệnh và cộng đồng.",
    highlights: ["Chăm sóc cơ bản", "Thực hành", "Chứng chỉ sơ cấp"],
    image: "/gallery/program-me-be.webp",
    category: "ngan-han",
    audience: "Tốt nghiệp THPT trở lên.",
    tuition: "6.200.000đ",
    objectives: [
      "Thực hiện chăm sóc điều dưỡng cơ bản an toàn.",
      "Hỗ trợ người bệnh tại cơ sở y tế và tại nhà.",
      "Nhận chứng chỉ điều dưỡng sơ cấp.",
    ],
    curriculum: [
      "Điều dưỡng cơ bản",
      "Chăm sóc người bệnh thường gặp",
      "Vệ sinh – chống nhiễm khuẩn",
      "Thực hành tại cơ sở",
    ],
    careers: [
      "Hỗ trợ điều dưỡng tại phòng khám, bệnh viện",
      "Chăm sóc người cao tuổi / tại nhà",
      "Học tiếp trung cấp Điều dưỡng",
    ],
    documents: commonDocuments,
  },
  {
    slug: "bao-che-dong-duoc",
    code: "TT-CC-03",
    name: "Bào chế đông dược (bốc thuốc kê đơn)",
    level: "Sơ cấp / Ngắn hạn",
    duration: "06 tháng",
    summary:
      "Nhận diện dược liệu, bào chế và bảo quản thuốc YHCT theo quy trình chuẩn.",
    highlights: ["Dược liệu", "Bào chế", "Thực tế vườn thuốc"],
    image: "/gallery/activity-dong-duoc.webp",
    category: "ngan-han",
    audience:
      "Tốt nghiệp THPT trở lên hoặc có chứng chỉ thuộc nhóm ngành CSSK.",
    tuition: "5.500.000đ",
    objectives: [
      "Nhận diện và bảo quản dược liệu thông dụng.",
      "Bào chế, cân thuốc, bốc thuốc theo kê đơn.",
      "Thực tế tại vườn thuốc / xưởng bào chế.",
    ],
    curriculum: [
      "Dược liệu học cơ bản",
      "Kỹ thuật bào chế đông dược",
      "Bốc thuốc kê đơn",
      "Thực tế vườn thuốc nam",
    ],
    careers: [
      "Nhà thuốc YHCT, phòng chẩn trị",
      "Cơ sở bào chế đông dược",
      "Học tiếp chuyên sâu YHCT / dược liệu",
    ],
    documents: commonDocuments,
  },
  {
    slug: "xoa-bop-bam-huyet",
    code: "TT-CC-04",
    name: "Xoa bóp bấm huyệt (CSSK không dùng thuốc)",
    level: "Thường xuyên / Ngắn hạn",
    duration: "Dưới 03 tháng",
    summary:
      "Phương pháp trị liệu bằng tay, phục hồi chức năng và chăm sóc sức khỏe cộng đồng.",
    highlights: ["Kỹ thuật bấm huyệt", "PHCN", "Hướng nghiệp"],
    image: "/gallery/program-xoa-bop.webp",
    category: "ngan-han",
    audience: "Từ 15 tuổi trở lên và đủ sức khỏe học tập.",
    tuition: "3.700.000đ",
    objectives: [
      "Thành thạo kỹ thuật xoa bóp – bấm huyệt cơ bản.",
      "Hỗ trợ giảm đau, thư giãn và CSSK cộng đồng.",
      "Nhận chứng chỉ chương trình thường xuyên.",
    ],
    curriculum: [
      "Huyệt vị và đường kinh cơ bản",
      "Kỹ thuật xoa bóp – bấm huyệt",
      "Chỉ định và chống chỉ định",
      "Thực hành trên người bệnh mẫu",
    ],
    careers: [
      "Cơ sở dưỡng sinh, spa trị liệu",
      "Hỗ trợ PHCN cộng đồng",
      "Bổ sung kỹ năng cho nhân viên CSSK",
    ],
    documents: commonDocuments,
  },
  {
    slug: "tac-dong-cot-song",
    code: "TT-CC-05",
    name: "Tác động cột sống (CSSK không dùng thuốc)",
    level: "Thường xuyên / Ngắn hạn",
    duration: "Dưới 03 tháng",
    summary:
      "Kỹ thuật tác động cột sống hỗ trợ điều trị đau lưng, đau cổ vai gáy và phục hồi vận động.",
    highlights: ["Cột sống", "Giảm đau", "Thực hành"],
    image: "/gallery/picture4.webp",
    category: "ngan-han",
    audience: "Từ 15 tuổi trở lên và đủ sức khỏe học tập.",
    tuition: "4.700.000đ",
    objectives: [
      "Hiểu cấu trúc cột sống và nguyên tắc an toàn.",
      "Thực hành kỹ thuật tác động cột sống cơ bản.",
      "Ứng dụng hỗ trợ các chứng đau thường gặp.",
    ],
    curriculum: [
      "Giải phẫu cột sống cơ bản",
      "Kỹ thuật tác động an toàn",
      "Đánh giá tư thế – vận động",
      "Thực hành lâm sàng mẫu",
    ],
    careers: [
      "Cơ sở VLTL – PHCN, dưỡng sinh",
      "Hỗ trợ trị liệu đau cơ xương khớp",
      "Học tiếp VLTL – PHCN",
    ],
    documents: commonDocuments,
  },
  {
    slug: "vltl-phcn-ngan-han",
    code: "TT-CC-06",
    name: "VLTL – PHCN (CSSK không dùng thuốc)",
    level: "Thường xuyên / Ngắn hạn",
    duration: "Dưới 03 tháng",
    summary:
      "Chương trình ngắn hạn vật lý trị liệu – phục hồi chức năng phục vụ chăm sóc sức khỏe cộng đồng.",
    highlights: ["VLTL", "PHCN", "Chứng chỉ ngắn hạn"],
    image: "/gallery/campus-extra-7343.webp",
    category: "ngan-han",
    audience:
      "Tốt nghiệp THPT trở lên, có chứng chỉ thuộc nhóm ngành CSSK.",
    tuition: "5.200.000đ",
    objectives: [
      "Áp dụng kỹ thuật VLTL – PHCN cơ bản an toàn.",
      "Hỗ trợ phục hồi vận động cho người bệnh.",
      "Bổ sung chứng chỉ ngắn hạn nhóm CSSK.",
    ],
    curriculum: [
      "Nguyên lý VLTL – PHCN",
      "Kỹ thuật điều trị thường gặp",
      "An toàn thực hành",
      "Thực hành tại phòng kỹ thuật",
    ],
    careers: [
      "Hỗ trợ kỹ thuật tại cơ sở PHCN",
      "Chăm sóc sức khỏe cộng đồng",
      "Học tiếp trung cấp VLTL – PHCN",
    ],
    documents: commonDocuments,
  },
  {
    slug: "cham-soc-me-be",
    code: "TT-CC-07",
    name: "Chăm sóc mẹ và bé sau sinh",
    level: "Thường xuyên / Ngắn hạn",
    duration: "Dưới 03 tháng",
    summary:
      "Đào tạo kỹ năng chăm sóc sản phụ và trẻ sơ sinh giai đoạn hậu sản.",
    highlights: ["Mẹ & bé", "Hậu sản", "Thực hành"],
    image: "/gallery/program-me-be.webp",
    category: "ngan-han",
    audience: "Từ 15 tuổi trở lên và đủ sức khỏe học tập.",
    tuition: "4.200.000đ",
    objectives: [
      "Chăm sóc sản phụ sau sinh đúng quy trình.",
      "Hỗ trợ chăm sóc trẻ sơ sinh an toàn.",
      "Nhận chứng chỉ chương trình thường xuyên.",
    ],
    curriculum: [
      "Chăm sóc hậu sản",
      "Chăm sóc trẻ sơ sinh",
      "Dinh dưỡng mẹ và bé",
      "Thực hành kỹ năng cơ bản",
    ],
    careers: [
      "Chăm sóc mẹ bé tại nhà / cơ sở dịch vụ",
      "Hỗ trợ tại phòng khám sản",
      "Bổ sung kỹ năng CSSK gia đình",
    ],
    documents: commonDocuments,
  },
];

export const news: NewsItem[] = [
  {
    slug: "cau-chuyen-buoi-sang-thang-7",
    title: "Câu chuyện về một buổi sáng tháng 7 đầy xúc động",
    date: "2026-07-26",
    category: "Hoạt động",
    excerpt:
      "Không gian ấm cúng tại trường ghi lại khoảnh khắc gắn kết giữa thầy cô và sinh viên.",
    image: "/gallery/news-1.webp",
  },
  {
    slug: "ngay-hoi-viec-lam-nguoi-cao-tuoi",
    title: "Tham gia Ngày hội tư vấn, giới thiệu việc làm cho người cao tuổi 2026",
    date: "2026-07-20",
    category: "Cộng đồng",
    excerpt:
      "Nhà trường đồng hành tư vấn sức khỏe và hướng nghiệp cho người cao tuổi tại Hà Nội.",
    image: "/gallery/campus-extra-7348.webp",
  },
  {
    slug: "lop-k36a1-thao-duoc",
    title: "Lớp K36A1.2 và hành trình chạm vào thảo dược",
    date: "2026-07-12",
    category: "Đào tạo",
    excerpt:
      "Sinh viên trải nghiệm nhận diện và sử dụng thảo dược qua buổi học thực tế.",
    image: "/gallery/activity-thao-duoc.webp",
  },
  {
    slug: "thong-bao-tuyen-sinh-2026-2027",
    title: "Thông báo tuyển sinh năm học 2026–2027",
    date: "2026-06-15",
    category: "Tuyển sinh",
    excerpt:
      "Mở đăng ký các mã ngành dài hạn và ngắn hạn cho năm học mới.",
    image: "/gallery/admissions-banner.webp",
  },
];

export const galleryHighlights = [
  {
    src: "/gallery/campus-1.webp",
    alt: "Không gian Trường Trung cấp Y Dược Tuệ Tĩnh Hà Nội",
  },
  {
    src: "/gallery/activity-dong-duoc.webp",
    alt: "Sinh viên thực tế môn Đông dược – bào chế",
  },
  {
    src: "/gallery/activity-thao-duoc.webp",
    alt: "Trải nghiệm thực tế tại cơ sở dưỡng sinh và vườn thuốc nam",
  },
  {
    src: "/gallery/campus-extra-7343.webp",
    alt: "Hoạt động đào tạo tại trường",
  },
];

export const audienceLinks = [
  {
    title: "Thí sinh / Phụ huynh",
    description: "Ngành học, điều kiện xét tuyển và đăng ký online",
    href: "/tuyen-sinh",
  },
  {
    title: "Học sinh đang học",
    description: "Đăng nhập cổng học vụ, lịch học và kết quả",
    href: "/dang-nhap",
  },
  {
    title: "Cựu sinh viên",
    description: "Tra cứu văn bằng, chứng chỉ đã cấp",
    href: "/van-bang",
  },
  {
    title: "Đối tác / Doanh nghiệp",
    description: "Hướng nghiệp, tuyển dụng và hợp tác đào tạo",
    href: "/huong-nghiep",
  },
];

export const demoSchedule: ScheduleItem[] = [
  {
    id: "1",
    day: "Thứ 2",
    time: "07:30 – 09:30",
    subject: "Lý luận YHCT cơ bản",
    room: "P.201",
    teacher: "ThS. Nguyễn Minh Anh",
  },
  {
    id: "2",
    day: "Thứ 2",
    time: "09:45 – 11:45",
    subject: "Thực hành châm cứu",
    room: "Lab A",
    teacher: "BS. Trần Quốc Việt",
  },
  {
    id: "3",
    day: "Thứ 3",
    time: "07:30 – 09:30",
    subject: "Dược liệu học",
    room: "P.105",
    teacher: "ThS. Lê Thu Hà",
  },
  {
    id: "4",
    day: "Thứ 4",
    time: "13:30 – 15:30",
    subject: "Xoa bóp bấm huyệt",
    room: "Lab B",
    teacher: "CN. Phạm Đức Thành",
  },
  {
    id: "5",
    day: "Thứ 5",
    time: "07:30 – 11:45",
    subject: "Thực tập lâm sàng",
    room: "CS thực hành",
    teacher: "BSCKI. Hoàng Lan",
  },
  {
    id: "6",
    day: "Thứ 6",
    time: "09:45 – 11:45",
    subject: "Đạo đức nghề y",
    room: "P.301",
    teacher: "TS. Vũ Thanh Sơn",
  },
];

export const demoGrades: GradeItem[] = [
  {
    code: "YHCT101",
    subject: "Lý luận YHCT cơ bản",
    credits: 3,
    midterm: 8.0,
    final: 8.5,
    total: 8.3,
  },
  {
    code: "CC201",
    subject: "Kỹ thuật châm cứu",
    credits: 4,
    midterm: 7.5,
    final: 8.0,
    total: 7.8,
  },
  {
    code: "DL110",
    subject: "Dược liệu học",
    credits: 3,
    midterm: 8.5,
    final: 9.0,
    total: 8.8,
  },
  {
    code: "XB120",
    subject: "Xoa bóp bấm huyệt",
    credits: 3,
    midterm: 7.0,
    final: 7.5,
    total: 7.3,
  },
];

export const certificates: CertificateRecord[] = [
  {
    code: "TT-VB-2024-0158",
    fullName: "Nguyễn Văn An",
    program: "Y học cổ truyền",
    level: "Trung cấp",
    issueDate: "2024-06-20",
    status: "valid",
  },
  {
    code: "TT-CC-2025-0042",
    fullName: "Trần Thị Bình",
    program: "Kỹ thuật châm cứu",
    level: "Chứng chỉ ngắn hạn",
    issueDate: "2025-10-12",
    status: "valid",
  },
  {
    code: "TT-VB-2023-0091",
    fullName: "Lê Minh Cường",
    program: "Điều dưỡng",
    level: "Trung cấp",
    issueDate: "2023-07-05",
    status: "revoked",
  },
];

export const whyChooseUs = [
  {
    title: "Đào tạo gắn thực tiễn",
    body: "Thực hành tại lab, cơ sở dưỡng sinh và vườn thuốc nam.",
  },
  {
    title: "Di sản YHCT Việt Nam",
    body: "Kế thừa tinh hoa Tuệ Tĩnh trong chương trình hiện đại.",
  },
  {
    title: "Hướng nghiệp rõ lộ trình",
    body: "Hỗ trợ việc làm, chứng chỉ ngắn hạn và liên thông.",
  },
  {
    title: "Cổng số hóa học vụ",
    body: "Đăng ký tuyển sinh, lịch học, điểm và tra cứu văn bằng online.",
  },
];
