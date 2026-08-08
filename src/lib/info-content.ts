/** Nội dung chi tiết trang Tuyển sinh / Giới thiệu / Liên hệ */

export const admissionsProcess = [
  {
    step: "01",
    title: "Chọn mã ngành",
    body: "Xem danh sách ngành trung cấp và ngắn hạn, chọn mã phù hợp nguyện vọng và điều kiện đầu vào.",
  },
  {
    step: "02",
    title: "Đăng ký online",
    body: "Điền hồ sơ trên cổng: họ tên, CCCD, liên hệ, trình độ và ngành xét tuyển.",
  },
  {
    step: "03",
    title: "Nộp lệ phí",
    body: "Thanh toán lệ phí xét tuyển 500.000đ qua cổng thanh toán online (demo / VNPay khi cấu hình).",
  },
  {
    step: "04",
    title: "Tra cứu & nhận MSSV",
    body: "Theo dõi trạng thái hồ sơ bằng mã hồ sơ + CCCD. Sau khi duyệt, nhận MSSV và tài khoản cổng học vụ.",
  },
] as const;

export const admissionsTracks = [
  {
    title: "Trung cấp – Hệ chính quy",
    body: "Y sĩ YHCT (5720102), Y sĩ đa khoa (5720101) và các ngành trung cấp khác. Thời gian học từ 1,5–2 năm (tùy mã).",
  },
  {
    title: "Trung cấp – Vừa làm vừa học",
    body: "Cùng mã ngành trung cấp, lịch học linh hoạt cho người đi làm; vẫn đủ điều kiện liên thông CĐ/ĐH sau tốt nghiệp.",
  },
  {
    title: "Ngắn hạn / Sơ cấp / Thường xuyên",
    body: "Châm cứu, Điều dưỡng sơ cấp, Bào chế đông dược, Xoa bóp bấm huyệt, Tác động cột sống, VLTL–PHCN, Chăm sóc mẹ bé…",
  },
] as const;

export const shortTermFees = [
  {
    name: "Điều dưỡng sơ cấp",
    duration: "06 tháng",
    fee: "6.200.000đ",
    slug: "dieu-duong-so-cap",
  },
  {
    name: "KTV Châm cứu",
    duration: "03 tháng",
    fee: "5.200.000đ",
    slug: "ky-thuat-cham-cuu",
  },
  {
    name: "Bào chế đông dược (bốc thuốc kê đơn)",
    duration: "06 tháng",
    fee: "5.500.000đ",
    slug: "bao-che-dong-duoc",
  },
  {
    name: "Xoa bóp bấm huyệt (CSSK không dùng thuốc)",
    duration: "Dưới 03 tháng",
    fee: "3.700.000đ",
    slug: "xoa-bop-bam-huyet",
  },
  {
    name: "Tác động cột sống",
    duration: "Dưới 03 tháng",
    fee: "4.700.000đ",
    slug: "tac-dong-cot-song",
  },
  {
    name: "VLTL – PHCN (ngắn hạn)",
    duration: "Dưới 03 tháng",
    fee: "5.200.000đ",
    slug: "vltl-phcn-ngan-han",
  },
  {
    name: "Chăm sóc mẹ và bé sau sinh",
    duration: "Dưới 03 tháng",
    fee: "4.200.000đ",
    slug: "cham-soc-me-be",
  },
] as const;

export const admissionsDocuments = [
  "Đơn xin học (theo mẫu nhà trường)",
  "Sơ yếu lý lịch (theo mẫu nhà trường)",
  "Căn cước công dân photo công chứng",
  "Bằng cấp liên quan photo công chứng (theo yêu cầu từng mã ngành)",
  "04 ảnh 3×4 chụp trong vòng 6 tháng",
] as const;

export const admissionsExtras = [
  {
    label: "Tài liệu học tập",
    value: "100.000đ – 150.000đ (tùy mã ngành)",
  },
  { label: "Thẻ học viên", value: "30.000đ" },
  { label: "Áo blue", value: "175.000đ/cái" },
  { label: "Lệ phí xét tuyển online", value: "500.000đ" },
] as const;

export const admissionsBenefits = [
  "Được học liên thông lên CĐ, ĐH và sau ĐH (đối với hệ trung cấp).",
  "Được tuyển dụng vào các cơ sở y tế, phòng chẩn trị, dưỡng sinh sau tốt nghiệp.",
  "Thực hành tại lab, cơ sở dưỡng sinh và vườn thuốc nam.",
  "Có cổng học vụ: lịch học, bài tập, lớp online và tra cứu văn bằng.",
] as const;

export const aboutSections = [
  {
    title: "Sứ mệnh",
    body: "Đào tạo nguồn nhân lực y dược cổ truyền và chăm sóc sức khỏe cộng đồng: không chỉ truyền đạt kiến thức mà còn rèn luyện tay nghề, đạo đức nghề và năng lực hành nghề thực tế.",
  },
  {
    title: "Lịch sử hình thành",
    body: "Tiền thân là lớp “Tấm Lòng Vàng”. Trải qua hơn 35 năm xây dựng và phát triển, Trường Trung cấp Y Dược Tuệ Tĩnh Hà Nội trở thành cái nôi đào tạo nhân lực YHCT, gắn lý thuyết với thực tiễn lâm sàng và cộng đồng.",
  },
  {
    title: "Thế mạnh đào tạo",
    body: "Chương trình gắn thực hành tại lab, cơ sở dưỡng sinh Đông y và vườn thuốc nam; đội ngũ giảng viên giàu kinh nghiệm; lộ trình ngắn hạn – trung cấp – liên thông rõ ràng.",
  },
  {
    title: "Hệ thống đào tạo",
    body: "Trung cấp chính quy và vừa làm vừa học; chứng chỉ sơ cấp / thường xuyên ngắn hạn; hỗ trợ hướng nghiệp và tuyển dụng sau tốt nghiệp.",
  },
] as const;

export const aboutMilestones = [
  {
    label: "35+",
    text: "năm xây dựng và phát triển",
  },
  {
    label: "YHCT",
    text: "trọng tâm di sản Tuệ Tĩnh",
  },
  {
    label: "Thực hành",
    text: "lab · dưỡng sinh · vườn thuốc",
  },
  {
    label: "Cổng số",
    text: "tuyển sinh & học vụ online",
  },
] as const;

export const contactDepartments = [
  {
    name: "Phòng Tuyển sinh",
    role: "Tư vấn mã ngành, hồ sơ xét tuyển, học phí ngắn hạn",
  },
  {
    name: "Phòng Đào tạo",
    role: "Lịch học, lớp học, chứng chỉ và hỗ trợ học vụ",
  },
  {
    name: "Cổng học vụ",
    role: "Tài khoản sinh viên / giảng viên, lớp online, bài tập",
  },
] as const;

export const contactHours = [
  { day: "Thứ 2 – Thứ 6", time: "07:30 – 17:00" },
  { day: "Thứ 7", time: "08:00 – 11:30 (theo lịch tư vấn)" },
  { day: "Chủ nhật", time: "Nghỉ (trừ ngày mở lớp đặc biệt)" },
] as const;

export const careerTracks = [
  {
    title: "Nghề Y sĩ YHCT",
    body: "Lộ trình hành nghề tại cơ sở y tế, phòng chẩn trị và dưỡng sinh; có thể liên thông CĐ/ĐH YHCT.",
    href: "/nganh-dao-tao/y-hoc-co-truyen",
  },
  {
    title: "Điều dưỡng & chăm sóc",
    body: "Cơ hội việc làm tại bệnh viện, phòng khám và chăm sóc cộng đồng; học tiếp trung cấp / CĐ Điều dưỡng.",
    href: "/nganh-dao-tao/dieu-duong",
  },
  {
    title: "Trị liệu không dùng thuốc",
    body: "Châm cứu, xoa bóp bấm huyệt, tác động cột sống, VLTL–PHCN phục vụ CSSK cộng đồng.",
    href: "/nganh-dao-tao/xoa-bop-bam-huyet",
  },
  {
    title: "Bào chế đông dược",
    body: "Nhà thuốc YHCT, phòng chẩn trị và cơ sở bào chế – kê đơn bốc thuốc.",
    href: "/nganh-dao-tao/bao-che-dong-duoc",
  },
] as const;
