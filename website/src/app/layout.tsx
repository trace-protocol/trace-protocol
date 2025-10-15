import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TRACE Protocol — Trusted records for autonomous systems",
  description:
    "Open standard for Action → Policy → Evidence. SDKs (TS/Python), reference server, and docs.",
  metadataBase: new URL("https://traceprotocol.org"),
  openGraph: {
    title: "TRACE Protocol",
    description:
      "Trusted records for autonomous systems — Action → Policy → Evidence.",
    url: "https://traceprotocol.org",
    siteName: "TRACE Protocol",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "TRACE Protocol",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TRACE Protocol",
    description:
      "Trusted records for autonomous systems — Action → Policy → Evidence.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-white text-slate-800">
        {children}
      </body>
    </html>
  );
}
