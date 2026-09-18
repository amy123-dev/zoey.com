import type { Metadata } from "next";
import "./zoey.css";
import "./reading.css";
import "./theme-polish.css";

export const metadata: Metadata = {
  title: "Zoey · 英语笔记与默写",
  description: "Zoey 英语学习：第一季美音基础、第二季自然口语、Real Speak 与独立中译英默写。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
