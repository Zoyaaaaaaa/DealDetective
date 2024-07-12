import type { Metadata } from "next";
import "./globals.css";
import { Inter, Space_Grotesk } from 'next/font/google'
import Navbar from "@/components/Navbar";
const inter = Inter({ subsets: ['latin'] })
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700']
 })
export const metadata: Metadata = {
  title: "DealDetective",
  description: "Empower your business with our advanced data scraping service, extracting valuable insights from the web efficiently and reliably. Harness the power of automation to gather, analyze, and leverage data seamlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="max-w-10xl mx-auto">
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  );
}
