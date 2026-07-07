import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/core/providers/theme-provider";
import { QueryProvider } from "@/core/providers/query-provider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FieldService App",
  description: "FieldService Web App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster 
              position="top-center" 
              toastOptions={{
                duration: 3000,
                className: 'dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg',
                style: {
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                },
                success: {
                  iconTheme: { primary: '#10b981', secondary: '#fff' }
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#fff' }
                }
              }}
            />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
