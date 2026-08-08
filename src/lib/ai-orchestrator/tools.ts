import { hashPassword } from "@/lib/password";
import {
  createNews,
  deleteNews,
  getSchoolSettings,
  listAllNews,
  updateNews,
  upsertSchoolSettings,
} from "@/lib/cms";
import {
  listAdmissionApplications,
  updateAdmissionStatus,
  type AdmissionView,
} from "@/lib/admissions";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

function asJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export type OrchestratorToolName =
  | "get_site_settings"
  | "update_site_settings"
  | "list_news"
  | "create_news"
  | "update_news"
  | "delete_news"
  | "list_users"
  | "create_user"
  | "update_user"
  | "reset_user_password"
  | "list_admissions"
  | "update_admission_status";

export type ToolCall = {
  name: OrchestratorToolName;
  arguments: Record<string, unknown>;
};

export type ToolResult = {
  ok: boolean;
  action: string;
  summary: string;
  data?: unknown;
  error?: string;
};

const SETTINGS_KEYS = [
  "name",
  "shortName",
  "tagline",
  "phone",
  "email",
  "address",
  "facebook",
  "youtube",
  "logo",
  "logoIcon",
  "heroImage",
  "aboutImage",
  "admissionsImage",
  "aboutText",
] as const;

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v.trim() : fallback;
}

function bool(v: unknown, fallback = true): boolean {
  if (typeof v === "boolean") return v;
  if (v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  return fallback;
}

export async function runOrchestratorTool(
  call: ToolCall,
  actorId: string,
): Promise<ToolResult> {
  try {
    const result = await executeTool(call);
    await prisma.adminActionLog.create({
      data: {
        actorId,
        action: call.name,
        summary: result.summary,
        payload: asJson({
          args: call.arguments,
          ok: result.ok,
        }),
      },
    });
    return result;
  } catch (e) {
    const error = e instanceof Error ? e.message : "Lỗi không xác định";
    await prisma.adminActionLog.create({
      data: {
        actorId,
        action: call.name,
        summary: `Lỗi: ${error}`,
        payload: asJson({ args: call.arguments, error }),
      },
    });
    return { ok: false, action: call.name, summary: error, error };
  }
}

async function executeTool(call: ToolCall): Promise<ToolResult> {
  const args = call.arguments;

  switch (call.name) {
    case "get_site_settings": {
      const settings = await getSchoolSettings();
      return {
        ok: true,
        action: call.name,
        summary: "Đã lấy cài đặt trường",
        data: settings,
      };
    }

    case "update_site_settings": {
      const current = await getSchoolSettings();
      const next = { ...current };
      for (const key of SETTINGS_KEYS) {
        if (args[key] !== undefined && args[key] !== null) {
          (next as Record<string, string>)[key] = str(args[key], next[key]);
        }
      }
      await upsertSchoolSettings(next);
      return {
        ok: true,
        action: call.name,
        summary: "Đã cập nhật nội dung/cài đặt trường (không đổi giao diện)",
        data: next,
      };
    }

    case "list_news": {
      const news = await listAllNews();
      return {
        ok: true,
        action: call.name,
        summary: `Có ${news.length} bài viết`,
        data: news.map((n) => ({
          id: n.id,
          title: n.title,
          category: n.category,
          published: n.published,
          date: n.date,
        })),
      };
    }

    case "create_news": {
      const title = str(args.title);
      if (!title) throw new Error("Thiếu tiêu đề bài viết");
      const row = await createNews({
        title,
        category: str(args.category, "Tin tức") || "Tin tức",
        excerpt: str(args.excerpt, title),
        body: str(args.body),
        imageUrl: str(args.imageUrl, "/gallery/news-1.webp") || "/gallery/news-1.webp",
        published: bool(args.published, true),
      });
      return {
        ok: true,
        action: call.name,
        summary: `Đã đăng bài: ${row.title}`,
        data: { id: row.id, slug: row.slug, title: row.title },
      };
    }

    case "update_news": {
      const id = str(args.id);
      if (!id) throw new Error("Thiếu id bài viết");
      const existing = await prisma.newsArticle.findUnique({ where: { id } });
      if (!existing) throw new Error("Không tìm thấy bài viết");
      const row = await updateNews(id, {
        title: str(args.title, existing.title) || existing.title,
        category: str(args.category, existing.category) || existing.category,
        excerpt: str(args.excerpt, existing.excerpt),
        body: str(args.body, existing.body),
        imageUrl: str(args.imageUrl, existing.imageUrl) || existing.imageUrl,
        published:
          args.published !== undefined
            ? bool(args.published, existing.published)
            : existing.published,
      });
      return {
        ok: true,
        action: call.name,
        summary: `Đã sửa bài: ${row.title}`,
        data: { id: row.id, title: row.title, published: row.published },
      };
    }

    case "delete_news": {
      const id = str(args.id);
      if (!id) throw new Error("Thiếu id bài viết");
      const row = await deleteNews(id);
      return {
        ok: true,
        action: call.name,
        summary: `Đã xóa bài: ${row.title}`,
        data: { id: row.id },
      };
    }

    case "list_users": {
      const role = str(args.role);
      const users = await prisma.user.findMany({
        where: role ? { role: role as "student" | "teacher" | "admin" } : undefined,
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          id: true,
          email: true,
          studentId: true,
          fullName: true,
          role: true,
          program: true,
          className: true,
          cohort: true,
          createdAt: true,
        },
      });
      return {
        ok: true,
        action: call.name,
        summary: `Có ${users.length} tài khoản`,
        data: users,
      };
    }

    case "create_user": {
      const email = str(args.email).toLowerCase();
      const fullName = str(args.fullName);
      const role = (str(args.role, "student") || "student") as
        | "student"
        | "teacher"
        | "admin";
      if (!email || !fullName) throw new Error("Thiếu email hoặc họ tên");
      if (!["student", "teacher", "admin"].includes(role)) {
        throw new Error("Role không hợp lệ");
      }
      const year = new Date().getFullYear();
      const studentId =
        str(args.studentId) ||
        (role === "teacher"
          ? `GV${Date.now().toString().slice(-4)}`
          : role === "admin"
            ? `AD${Date.now().toString().slice(-4)}`
            : `SV${year}${String(Math.floor(Math.random() * 900) + 100)}`);
      const password = str(args.password, "demo1234") || "demo1234";
      const user = await prisma.user.create({
        data: {
          email,
          studentId,
          passwordHash: hashPassword(password),
          fullName,
          program: str(args.program, "Chưa phân ngành") || "Chưa phân ngành",
          className: str(args.className, "Chờ phân lớp") || "Chờ phân lớp",
          cohort: str(args.cohort, `${year}`) || `${year}`,
          role,
        },
      });
      return {
        ok: true,
        action: call.name,
        summary: `Đã tạo tài khoản ${user.fullName} (${user.role}) — mật khẩu tạm: ${password}`,
        data: {
          id: user.id,
          email: user.email,
          studentId: user.studentId,
          role: user.role,
          tempPassword: password,
        },
      };
    }

    case "update_user": {
      const id = str(args.id);
      const email = str(args.email).toLowerCase();
      const studentId = str(args.studentId);
      const where = id
        ? { id }
        : email
          ? { email }
          : studentId
            ? { studentId }
            : null;
      if (!where) throw new Error("Cần id / email / studentId");
      const existing = await prisma.user.findFirst({ where });
      if (!existing) throw new Error("Không tìm thấy tài khoản");
      const roleRaw = str(args.role);
      const user = await prisma.user.update({
        where: { id: existing.id },
        data: {
          fullName: str(args.fullName) || undefined,
          program: str(args.program) || undefined,
          className: str(args.className) || undefined,
          cohort: str(args.cohort) || undefined,
          email: email || undefined,
          studentId: str(args.newStudentId) || undefined,
          role:
            roleRaw && ["student", "teacher", "admin"].includes(roleRaw)
              ? (roleRaw as "student" | "teacher" | "admin")
              : undefined,
        },
      });
      return {
        ok: true,
        action: call.name,
        summary: `Đã cập nhật tài khoản ${user.fullName}`,
        data: {
          id: user.id,
          email: user.email,
          studentId: user.studentId,
          role: user.role,
        },
      };
    }

    case "reset_user_password": {
      const id = str(args.id);
      const email = str(args.email).toLowerCase();
      const studentId = str(args.studentId);
      const where = id
        ? { id }
        : email
          ? { email }
          : studentId
            ? { studentId }
            : null;
      if (!where) throw new Error("Cần id / email / studentId");
      const existing = await prisma.user.findFirst({ where });
      if (!existing) throw new Error("Không tìm thấy tài khoản");
      const password = str(args.password, "demo1234") || "demo1234";
      await prisma.user.update({
        where: { id: existing.id },
        data: { passwordHash: hashPassword(password) },
      });
      return {
        ok: true,
        action: call.name,
        summary: `Đã đặt lại mật khẩu cho ${existing.fullName}: ${password}`,
        data: { id: existing.id, email: existing.email, tempPassword: password },
      };
    }

    case "list_admissions": {
      const apps = await listAdmissionApplications();
      const status = str(args.status) as AdmissionView["status"] | "";
      const filtered = status
        ? apps.filter((a) => a.status === status)
        : apps;
      return {
        ok: true,
        action: call.name,
        summary: `${filtered.length} hồ sơ tuyển sinh`,
        data: filtered.map((a) => ({
          id: a.id,
          refCode: a.refCode,
          fullName: a.fullName,
          program: a.program,
          status: a.status,
          issuedStudentId: a.issuedStudentId,
        })),
      };
    }

    case "update_admission_status": {
      const id = str(args.id);
      const refCode = str(args.refCode);
      const status = str(args.status) as AdmissionView["status"];
      if (!["pending", "paid", "contacted", "accepted", "rejected"].includes(status)) {
        throw new Error("Trạng thái không hợp lệ");
      }
      const app = id
        ? await prisma.admissionApplication.findUnique({ where: { id } })
        : refCode
          ? await prisma.admissionApplication.findUnique({ where: { refCode } })
          : null;
      if (!app) throw new Error("Không tìm thấy hồ sơ");
      if (status === "accepted") {
        throw new Error(
          "Cấp MSSV dùng trang Hồ sơ tuyển sinh (Duyệt & cấp MSSV), không đặt accepted trực tiếp tại đây",
        );
      }
      await updateAdmissionStatus(app.id, status, str(args.adminNote) || null);
      return {
        ok: true,
        action: call.name,
        summary: `Hồ sơ ${app.refCode} → ${status}`,
        data: { id: app.id, refCode: app.refCode, status },
      };
    }

    default:
      throw new Error(`Tool không hỗ trợ: ${call.name}`);
  }
}

export const ORCHESTRATOR_TOOL_SPECS = [
  {
    name: "get_site_settings",
    description: "Xem thông tin/cài đặt nội dung trường (tagline, SĐT, about...)",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "update_site_settings",
    description:
      "Cập nhật nội dung trường (không sửa giao diện). Fields: name, shortName, tagline, phone, email, address, facebook, youtube, logo, logoIcon, heroImage, aboutImage, admissionsImage, aboutText",
    parameters: {
      type: "object",
      properties: Object.fromEntries(
        SETTINGS_KEYS.map((k) => [k, { type: "string" }]),
      ),
    },
  },
  {
    name: "list_news",
    description: "Liệt kê tin tức",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "create_news",
    description: "Đăng bài tin tức mới",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        category: { type: "string" },
        excerpt: { type: "string" },
        body: { type: "string" },
        imageUrl: { type: "string" },
        published: { type: "boolean" },
      },
      required: ["title"],
    },
  },
  {
    name: "update_news",
    description: "Sửa bài tin theo id",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        category: { type: "string" },
        excerpt: { type: "string" },
        body: { type: "string" },
        imageUrl: { type: "string" },
        published: { type: "boolean" },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_news",
    description: "Xóa bài tin theo id",
    parameters: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "list_users",
    description: "Danh sách tài khoản; lọc role student|teacher|admin",
    parameters: {
      type: "object",
      properties: { role: { type: "string" } },
    },
  },
  {
    name: "create_user",
    description: "Tạo tài khoản mới",
    parameters: {
      type: "object",
      properties: {
        email: { type: "string" },
        fullName: { type: "string" },
        role: { type: "string" },
        studentId: { type: "string" },
        password: { type: "string" },
        program: { type: "string" },
        className: { type: "string" },
        cohort: { type: "string" },
      },
      required: ["email", "fullName"],
    },
  },
  {
    name: "update_user",
    description: "Sửa tài khoản theo id/email/studentId",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        studentId: { type: "string" },
        fullName: { type: "string" },
        role: { type: "string" },
        program: { type: "string" },
        className: { type: "string" },
        cohort: { type: "string" },
        newStudentId: { type: "string" },
      },
    },
  },
  {
    name: "reset_user_password",
    description: "Đặt lại mật khẩu tài khoản",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        studentId: { type: "string" },
        password: { type: "string" },
      },
    },
  },
  {
    name: "list_admissions",
    description: "Danh sách hồ sơ tuyển sinh",
    parameters: {
      type: "object",
      properties: { status: { type: "string" } },
    },
  },
  {
    name: "update_admission_status",
    description: "Cập nhật trạng thái hồ sơ (pending|paid|contacted|rejected)",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string" },
        refCode: { type: "string" },
        status: { type: "string" },
        adminNote: { type: "string" },
      },
      required: ["status"],
    },
  },
] as const;
