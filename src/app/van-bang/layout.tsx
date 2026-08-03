import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tra cứu văn bằng",
};

export default function CertificateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
