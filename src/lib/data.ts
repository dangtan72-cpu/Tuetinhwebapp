export type Program = {
  slug: string;
  name: string;
  level: string;
  duration: string;
  summary: string;
  highlights: string[];
  image: string;
};

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

export const programs: Program[] = [
  {
    slug: "y-hoc-co-truyen",
    name: "Y học cổ truyền",
    level: "Trung cấp / Ngắn hạn",
    duration: "12–36 tháng",
    summary:
      "Đào tạo y sĩ YHCT với nền tảng lý luận, chẩn trị và thực hành lâm sàng Đông y.",
    highlights: ["Châm cứu", "Bào chế đông dược", "Thực tập cơ sở"],
    image: "/gallery/career-yhct.webp",
  },
  {
    slug: "dieu-duong",
    name: "Điều dưỡng",
    level: "Trung cấp / Liên thông",
    duration: "24–36 tháng",
    summary:
      "Chương trình điều dưỡng gắn với chăm sóc toàn diện và kỹ năng thực hành lâm sàng.",
    highlights: ["Chăm sóc lâm sàng", "Đạo đức nghề", "Thực tập bệnh viện"],
    image: "/gallery/program-me-be.webp",
  },
  {
    slug: "ky-thuat-cham-cuu",
    name: "Kỹ thuật châm cứu",
    level: "Chứng chỉ ngắn hạn",
    duration: "3–6 tháng",
    summary:
      "Tập trung kỹ thuật châm cứu, an toàn thực hành và ứng dụng điều trị thường gặp.",
    highlights: ["Thực hành huyệt", "An toàn kỹ thuật", "Ca lâm sàng"],
    image: "/gallery/activity-cham-cuu.webp",
  },
  {
    slug: "xoa-bop-bam-huyet",
    name: "Xoa bóp bấm huyệt",
    level: "Chứng chỉ ngắn hạn",
    duration: "3–6 tháng",
    summary:
      "Phương pháp trị liệu bằng tay, phục hồi chức năng và chăm sóc sức khỏe cộng đồng.",
    highlights: ["Kỹ thuật bấm huyệt", "PHCN", "Hướng nghiệp"],
    image: "/gallery/program-xoa-bop.webp",
  },
  {
    slug: "bao-che-dong-duoc",
    name: "Bào chế đông dược",
    level: "Ngắn hạn / Trung cấp",
    duration: "6–24 tháng",
    summary:
      "Nhận diện dược liệu, bào chế và bảo quản thuốc YHCT theo quy trình chuẩn.",
    highlights: ["Dược liệu", "Bào chế", "Thực tế vườn thuốc"],
    image: "/gallery/activity-dong-duoc.webp",
  },
  {
    slug: "ky-thuat-vltl-phcn",
    name: "Kỹ thuật VLTL – PHCN",
    level: "Trung cấp",
    duration: "24–36 tháng",
    summary:
      "Vật lý trị liệu và phục hồi chức năng kết hợp kiến thức YHCT ứng dụng.",
    highlights: ["VLTL", "PHCN", "Thực hành lâm sàng"],
    image: "/gallery/picture4.webp",
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
