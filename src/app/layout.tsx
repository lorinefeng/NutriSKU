import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Noto_Sans_SC } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NutriSKU — 让 AI 推荐你的品牌 | GEO 生成式引擎优化",
  description:
    "不只是 Google 排名。让 ChatGPT、DeepSeek、Claude 主动推荐你的产品。NutriSKU 通过 GEO 策略，让 AI 搜索成为你的增长引擎。",
  icons: {
    icon: "/favicon.svg",
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
      className={`scroll-smooth ${dmSans.variable} ${playfair.variable} ${notoSansSC.variable}`}
    >
      <body className="bg-[#0c0c10] text-[#f0ece6] antialiased">
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
