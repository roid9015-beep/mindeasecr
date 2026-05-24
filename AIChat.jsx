import "@/styles/globals.css";

export const metadata = {
  title: "MindEase AI — Your Emotional Clarity Companion",
  description:
    "MindEase AI is your always-available AI companion for stress relief, emotional clarity, and overthinking support.",
  keywords: [
    "stress relief AI","anxiety support AI","overthinking help",
    "emotional support AI","mental clarity app","AI companion",
  ],
  openGraph: {
    title: "MindEase AI — Feel Calmer. Think Clearer.",
    description: "Your always-available AI companion for stress relief and emotional clarity.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindEase AI — Feel Calmer. Think Clearer.",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0b12",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
