import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkuGEO — 让 AI 推荐你的品牌 | GEO 生成式引擎优化",
  description:
    "不只是 Google 排名。让 ChatGPT、DeepSeek、Claude 主动推荐你的产品。SkuGEO 通过 GEO 策略，让 AI 搜索成为你的增长引擎。",
  icons: {
    icon: [{ url: "/favicon.svg?v=20260226", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh"
      className="scroll-smooth"
    >
      <body className="bg-[var(--color-void)] text-[var(--color-text-primary)] antialiased transition-colors duration-500">
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
