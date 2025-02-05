import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Koora Live Matches - بث مباشر للمباريات",
  description: "Watch live football matches with Koora. بث مباشر لأحدث المباريات وتحليل النتائج.",
  keywords: "koora live, football live matches, بث مباشر, koora, live football",
  authors: [{ name: "Anas Akil" }],
  openGraph: {
    title: "Koora Live Matches - بث مباشر للمباريات",
    description: "Watch live football matches with Koora. بث مباشر لأحدث المباريات وتحليل النتائج.",
    url: "https://kooranext.com",
    siteName: "KooraNext",
    images: [
      {
        url: "https://kooranext.com/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "Koora live matches",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Koora Live Matches - بث مباشر للمباريات",
    description: "Watch live football matches with Koora. بث مباشر لأحدث المباريات وتحليل النتائج.",
    creator: "@kooranext", 
    images: [
      {
        url: "https://kooranext.com/og-image.jpg", 
      },
    ],
  },
  alternates: {
    languages: {
      ar: "/ar", 
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <script async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6784576418150334"
          crossOrigin="anonymous"></script>
          <meta name="google-adsense-account" content="ca-pub-6784576418150334"></meta>
     
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
