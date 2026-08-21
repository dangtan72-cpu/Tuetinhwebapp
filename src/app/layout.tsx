import type { Metadata } from "next";
import { Be_Vietnam_Pro, Fraunces } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const dynamic = "force-dynamic";

const body = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Tuệ Tĩnh · TamvangHub | Cổng tuyển sinh",
    template: "%s | Tuệ Tĩnh · TamvangHub",
  },
  description:
    "TamvangHub - Cổng tuyển sinh của Trường Trung cấp Y Dược Tuệ Tĩnh Hà Nội: ngành học, đăng ký xét tuyển, tin tức và cổng học vụ.",
  icons: {
    icon: "/favicon.png",
    apple: "/brand/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${body.variable} ${display.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
