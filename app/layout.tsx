import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

// Suppress hydration warnings for browser extensions
const suppressHydrationWarning = process.env.NODE_ENV === 'development';

export const metadata: Metadata = {
  title: "Desishub Candidate Assessor",
  description: "Register and assess new candidates for Desishub.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning={suppressHydrationWarning}>
      <body suppressHydrationWarning={suppressHydrationWarning}>
        <SessionProvider session={session}>
          <header style={{ backgroundColor: 'var(--primary-300)' }} className="shadow-sm border-b border-accent-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-100)' }}>Dessishub Candidate Assessor</h1>
                <nav className="space-x-4">
                  <a href="/" className="hover:underline" style={{ color: 'var(--accent-100)' }}>Home</a>
                </nav>
              </div>
            </div>
          </header>
          <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-100)' }}>{children}</main>
          <footer className="border-t" style={{ backgroundColor: 'var(--primary-300)', borderColor: 'var(--accent-200)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <p className="text-center" style={{ color: 'var(--text-200)' }}>
                &copy; 2024 Dessishub. All rights reserved. neo-codes
              </p>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}