"use client";

export function DemoLoginFill({
  email,
  password,
  label,
}: {
  email: string;
  password: string;
  label: string;
}) {
  return (
    <button
      type="button"
      className="mt-2 rounded-md border border-line bg-paper px-2.5 py-1 text-xs font-medium text-brand hover:bg-brand-soft"
      onClick={() => {
        const form = document.getElementById("login-form") as HTMLFormElement | null;
        if (!form) return;
        const login = form.elements.namedItem("login") as HTMLInputElement | null;
        const pass = form.elements.namedItem("password") as HTMLInputElement | null;
        if (login) login.value = email;
        if (pass) pass.value = password;
      }}
    >
      Điền {label}
    </button>
  );
}
