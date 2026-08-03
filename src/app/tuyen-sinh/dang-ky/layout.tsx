import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký xét tuyển",
};

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
