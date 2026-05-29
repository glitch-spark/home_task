import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/AppHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creator Intake Review",
  description: "Influur internal tool — review creator applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppHeader />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
