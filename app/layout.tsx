import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "豌豆 · AI漫剧创作者",
  description: "豌豆的个人介绍、AI漫剧经历与精选作品集。",
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
