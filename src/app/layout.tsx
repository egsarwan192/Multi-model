import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Multi-LLM Chat",
    template: "%s | Multi-LLM Chat"
  },
  description: "Access multiple AI models through a single interface. Chat with OpenAI, Anthropic, Google, and Deepseek models instantly without login.",
  keywords: ["AI", "Chat", "LLM", "OpenAI", "Anthropic", "Google", "Deepseek", "ChatGPT"],
  authors: [{ name: "Multi-LLM Chat" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://multi-llm-chat.vercel.app",
    siteName: "Multi-LLM Chat",
    title: "Multi-LLM Chat",
    description: "Access multiple AI models through a single interface. Chat with OpenAI, Anthropic, Google, and Deepseek models instantly.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multi-LLM Chat",
    description: "Access multiple AI models through a single interface. No login required.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
