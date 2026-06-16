import "@/styles/globals.css";

export const metadata = {
  title: "MindEase AI — Feel Calmer. Think Clearer.",
  description: "Your always-available AI companion for stress relief, emotional clarity, and overthinking support. Not therapy — something better.",
  keywords: ["stress relief AI","anxiety support AI","overthinking help","emotional support AI","mental clarity app","AI companion"],
  openGraph: {
    title: "MindEase AI — Feel Calmer. Think Clearer.",
    description: "Your always-available AI companion for stress relief and emotional clarity.",
    type: "website",
  },
};
export const viewport = { width:"device-width", initialScale:1, themeColor:"#0a0b12" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MindEase AI" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
