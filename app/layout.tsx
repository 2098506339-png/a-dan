import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "豌豆 Wandou · AI漫剧创作者 / AI Comic Creator",
  description: "豌豆的中英双语个人介绍、AI漫剧经历与精选作品集。A bilingual portfolio of Wandou's AI comic stories and selected work.",
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
