import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Force dynamic rendering so pages don't try to access the database during build
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://asgaritravels.com"),
  title: {
    default: "Asgari Tour & Travels - Kashmir & Ladakh Luxury Tours",
    template: "%s | Asgari Tour & Travels",
  },
  description:
    "Discover the paradise of Kashmir & Ladakh with Asgari Tour & Travels. Curated luxury tour packages to Srinagar, Gulmarg, Pahalgam, Sonmarg, Leh, Nubra Valley, Pangong Lake & more. Book your dream Himalayan escape today.",
  keywords: [
    "Kashmir tour packages", "Ladakh tour", "Srinagar travel", "Gulmarg skiing",
    "Pahalgam tour", "Sonmarg trip", "Leh Ladakh bike trip", "Pangong Lake tour",
    "Nubra Valley", "Dal Lake houseboat", "Kashmir honeymoon packages",
    "Asgari Tour Travels", "Kashmir holiday packages", "Ladakh adventure tours",
  ],
  authors: [{ name: "Asgari Tour & Travels" }],
  creator: "Asgari Tour & Travels",
  openGraph: {
    title: "Asgari Tour & Travels - Kashmir & Ladakh Luxury Tours",
    description: "Curated luxury tour packages across Kashmir & Ladakh. Srinagar, Gulmarg, Pahalgam, Leh, Pangong & more.",
    url: "https://asgaritravels.com",
    siteName: "Asgari Tour & Travels",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asgari Tour & Travels - Kashmir & Ladakh Luxury Tours",
    description: "Curated luxury tour packages across Kashmir & Ladakh.",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: "/" },
  category: "travel",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#c8860b" />
        <link rel="apple-touch-icon" href="/icons/icon-512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Asgari Tours" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${sans.variable} ${display.variable} ${mono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col overflow-x-hidden`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
        <Toaster />
        <SonnerToaster />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(e) {
                    console.log('SW registration failed:', e);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
