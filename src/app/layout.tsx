import type { Metadata, Viewport } from "next";
import { DM_Sans, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ResumeBanner } from "@/components/layout/ResumeBanner";
import { PageTransition } from "@/components/layout/PageTransition";
import { SkipLink } from "@/components/layout/SkipLink";
import { StorageBanner } from "@/components/layout/StorageBanner";
import { DemoModeShell } from "@/components/demo/DemoModeShell";
import { DemoModeProvider } from "@/lib/demo-mode";
import { LaunchpadProvider } from "@/lib/store";
import "@/styles/globals.css";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Digital Collaboration Launchpad — For Student Teams",
  description:
    "Go from 'just assigned' to 'actually working' in 15 minutes. GRPI-powered team setup for university group projects.",
  openGraph: {
    title: "Digital Collaboration Launchpad — For Student Teams",
    description:
      "Go from 'just assigned' to 'actually working' in 15 minutes. GRPI-powered team setup for university group projects.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F5F0E8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-body antialiased">
        <LaunchpadProvider>
          <DemoModeProvider>
            <SkipLink />
            <StorageBanner />
            <ResumeBanner />
            <div data-print-hide>
              <Header />
            </div>
            <main id="main-content" className="flex-1 w-full min-w-0" tabIndex={-1}>
              <PageTransition>{children}</PageTransition>
            </main>
            <div data-print-hide>
              <Footer />
            </div>
            <DemoModeShell />
          </DemoModeProvider>
        </LaunchpadProvider>
      </body>
    </html>
  );
}
