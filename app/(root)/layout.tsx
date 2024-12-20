import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import Topbar from '@/components/shared/Topbar';
import LeftSidebar from '@/components/shared/LeftSidebar';
import RightSidebar from '@/components/shared/RightSidebar';
import Botttombar from '@/components/shared/Botttombar';
import { Toaster } from '@/components/ui/toaster';
import Loading from './loading';
import { Suspense } from "react";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: "%s | MusicBox",
    default: "MusicBox"
  },
  description: "App dedicated to music reviewers",
};
/* console.log(metadata); */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Suspense fallback={<Loading />}>
            <Topbar />
            <main className='flex flex-row'>
              <LeftSidebar />
              <section className='main-container'>
                <div className='w-full max-w-4xl'>{children}</div>
              </section>
              <RightSidebar />
            </main>
            <Toaster />
            <Botttombar />
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}