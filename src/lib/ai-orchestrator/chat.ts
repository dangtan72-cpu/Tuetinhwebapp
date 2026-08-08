import {
  ORCHESTRATOR_TOOL_SPECS,
  runOrchestratorTool,
  type OrchestratorToolName,
  type ToolCall,
  type ToolResult,
} from "@/lib/ai-orchestrator/tools";

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

function extractJsonObject(text: string): Record<string, unknown> | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced?.[1] ?? text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Rule-based fallback when no OPENAI_API_KEY */
export function parseLocalIntent(message: string): ToolCall[] {
  const text = message.trim();
  const lower = text.toLowerCase();

  if (
    /^(help|trợ giúp|hướng dẫn|bạn làm được gì|làm được gì)/i.test(text) ||
    lower === "?"
  ) {
    return [];
  }

  if (/cài đặt|thông tin trường|xem settings|get_site/i.test(lower) && !/đổi|sửa|cập nhật|update/i.test(lower)) {
    return [{ name: "get_site_settings", arguments: {} }];
  }

  const tagline = text.match(
    /(?:đổi|sửa|cập nhật)\s+tagline\s*(?:thành|=|:)?\s*[“"']?(.+?)[”"']?\s*$/i,
  );
  if (tagline?.[1]) {
    return [{ name: "update_site_settings", arguments: { tagline: tagline[1].trim() } }];
  }

  const phone = text.match(
    /(?:đổi|sửa|cập nhật)\s+(?:sđt|số điện thoại|phone)\s*(?:thành|=|:)?\s*([+\d\s.-]{8,})/i,
  );
  if (phone?.[1]) {
    return [{ name: "update_site_settings", arguments: { phone: phone[1].trim() } }];
  }

  const about = text.match(
    /(?:đổi|sửa|cập nhật)\s+(?:giới thiệu|about(?:Text)?)\s*(?:thành|=|:)?\s*([\s\S]+)/i,
  );
  if (about?.[1]) {
    return [{ name: "update_site_settings", arguments: { aboutText: about[1].trim() } }];
  }

  if (/danh sách tin|list news|liệt kê tin|các bài viết/i.test(lower)) {
    return [{ name: "list_news", arguments: {} }];
  }

  const createNews = text.match(
    /(?:đăng|tạo|thêm)\s+(?:bài|tin)(?:\s+tức)?\s*[:\-]?\s*(.+)/i,
  );
  if (createNews?.[1]) {
    const title = createNews[1].trim().replace(/^["']|["']$/g, "");
    return [
      {
        name: "create_news",
        arguments: {
          title,
          category: "Tin tức",
          excerpt: title,
          body: title,
          published: true,
        },
      },
    ];
  }

  if (/danh sách (?:tài khoản|user|học sinh|giảng viên)|list users/i.test(lower)) {
    if (/học sinh|student/i.test(lower)) {
      return [{ name: "list_users", arguments: { role: "student" } }];
    }
    if (/giảng viên|teacher/i.test(lower)) {
      return [{ name: "list_users", arguments: { role: "teacher" } }];
    }
    if (/admin/i.test(lower)) {
      return [{ name: "list_users", arguments: { role: "admin" } }];
    }
    return [{ name: "list_users", arguments: {} }];
  }

  const createUser = text.match(
    /(?:tạo|thêm)\s+(?:tài khoản|user)\s+(.+?)\s+(\S+@\S+)(?:\s+(student|teacher|admin|học sinh|giảng viên))?/i,
  );
  if (createUser) {
    const roleRaw = (createUser[3] || "student").toLowerCase();
    const role =
      roleRaw.includes("giảng") || roleRaw === "teacher"
        ? "teacher"
        : roleRaw === "admin"
          ? "admin"
          : "student";
    return [
      {
        name: "create_user",
        arguments: {
          fullName: createUser[1].trim(),
          email: createUser[2].trim().toLowerCase(),
          role,
          password: "demo1234",
        },
      },
    ];
  }

  const resetPw = text.match(
    /(?:reset|đặt lại)\s+mật khẩu\s+(\S+)(?:\s+(?:thành|=)\s+(\S+))?/i,
  );
  if (resetPw) {
    const key = resetPw[1];
    const password = resetPw[2] || "demo1234";
    const args = key.includes("@")
      ? { email: key, password }
      : { studentId: key, password };
    return [{ name: "reset_user_password", arguments: args }];
  }

  if (/hồ sơ tuyển sinh|list admissions|danh sách hồ sơ/i.test(lower)) {
    return [{ name: "list_admissions", arguments: {} }];
  }

  const admission = text.match(
    /(?:đánh dấu|chuyển|cập nhật)\s+hồ sơ\s+(\S+)\s+(?:thành|sang|=)\s+(pending|paid|contacted|rejected|đã liên hệ|từ chối|đã thanh toán)/i,
  );
  if (admission) {
    const map: Record<string, string> = {
      "đã liên hệ": "contacted",
      "từ chối": "rejected",
      "đã thanh toán": "paid",
    };
    const status =
      map[admission[2].toLowerCase()] || admission[2].toLowerCase();
    return [
      {
        name: "update_admission_status",
        arguments: { refCode: admission[1], status },
      },
    ];
  }

  // JSON command mode: {"tool":"create_news","arguments":{...}}
  const json = extractJsonObject(text);
  if (json && typeof json.tool === "string") {
    return [
      {
        name: json.tool as OrchestratorToolName,
        arguments: (json.arguments as Record<string, unknown>) || {},
      },
    ];
  }

  return [];
}

function helpText(): string {
  return [
    "AI Orchestrator quản lý **nội dung & tài khoản** (không sửa giao diện).",
    "",
    "Ví dụ lệnh:",
    "• `xem cài đặt trường`",
    "• `đổi tagline thành ...`",
    "• `đổi số điện thoại thành ...`",
    "• `danh sách tin`",
    "• `đăng tin: Thông báo khai giảng 2026`",
    "• `danh sách tài khoản`",
    "• `tạo tài khoản Nguyễn Văn A a@email.com student`",
    "• `reset mật khẩu sv001@tuetinh.edu`",
    "• `danh sách hồ sơ tuyển sinh`",
    "• `đánh dấu hồ sơ TT-DK-2026-1002 thành contacted`",
    "",
    "Hoặc gửi JSON: `{\"tool\":\"create_news\",\"arguments\":{\"title\":\"...\"}}`",
    process.env.OPENAI_API_KEY
      ? "Đang dùng OpenAI để hiểu câu tự nhiên."
      : "Chưa có OPENAI_API_KEY — đang dùng bộ lệnh tiếng Việt / JSON.",
  ].join("\n");
}

async function planWithOpenAI(message: string): Promise<ToolCall[] | null> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const tools = ORCHESTRATOR_TOOL_SPECS.map((t) => ({
    type: "function" as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    },
  }));

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Bạn là AI Orchestrator quản trị webapp trường Tuệ Tĩnh. Chỉ quản lý nội dung, tin tức, tài khoản, hồ sơ tuyển sinh. Không đổi giao diện/CSS. Khi người dùng yêu cầu hành động, gọi function tools. Nếu chỉ hỏi/help thì trả lời ngắn bằng tiếng Việt, không gọi tool.",
        },
        { role: "user", content: message },
      ],
      tools,
      tool_choice: "auto",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI lỗi: ${err.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: {
      message?: {
        content?: string | null;
        tool_calls?: {
          function: { name: string; arguments: string };
        }[];
      };
    }[];
  };

  const msg = data.choices?.[0]?.message;
  const calls = msg?.tool_calls ?? [];
  if (calls.length === 0) {
    return null;
  }

  return calls.map((c) => ({
    name: c.function.name as OrchestratorToolName,
    arguments: JSON.parse(c.function.arguments || "{}") as Record<string, unknown>,
  }));
}

export async function runOrchestratorChat(input: {
  message: string;
  actorId: string;
}): Promise<{
  reply: string;
  results: ToolResult[];
  mode: "openai" | "local";
}> {
  const message = input.message.trim();
  if (!message) {
    return { reply: "Anh/chị gửi yêu cầu quản trị.", results: [], mode: "local" };
  }

  if (/^(help|trợ giúp|hướng dẫn|\?)/i.test(message)) {
    return { reply: helpText(), results: [], mode: "local" };
  }

  let mode: "openai" | "local" = "local";
  let calls: ToolCall[] = [];

  try {
    const planned = await planWithOpenAI(message);
    if (planned && planned.length > 0) {
      calls = planned;
      mode = "openai";
    } else if (planned === null && process.env.OPENAI_API_KEY) {
      // OpenAI answered without tools — try local, else help-ish
      calls = parseLocalIntent(message);
      mode = "openai";
      if (calls.length === 0) {
        // Re-ask OpenAI for plain text via a lightweight completion already done:
        // We don't have the text; fall through to local help.
        return {
          reply:
            "Em hiểu yêu cầu mang tính hỏi/thảo luận. Gõ `help` để xem lệnh, hoặc nêu rõ hành động (đăng tin / sửa tagline / tạo tài khoản…).",
          results: [],
          mode: "openai",
        };
      }
    } else {
      calls = parseLocalIntent(message);
    }
  } catch {
    calls = parseLocalIntent(message);
    mode = "local";
  }

  if (calls.length === 0) {
    return {
      reply:
        "Chưa nhận diện được lệnh. Gõ `help` để xem ví dụ.\n\n" + helpText(),
      results: [],
      mode,
    };
  }

  const results: ToolResult[] = [];
  for (const call of calls) {
    results.push(await runOrchestratorTool(call, input.actorId));
  }

  const lines = results.map((r) =>
    r.ok ? `✓ ${r.summary}` : `✗ ${r.summary}`,
  );

  return {
    reply: lines.join("\n"),
    results,
    mode,
  };
}
