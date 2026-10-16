import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/site/theme-provider";
import { StructuredData } from "@/components/site/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Geist Mono solo se usa en demos (lazy-loaded), no pre-cargar
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// URL dinámica: lee de variables de entorno o usa la URL de Vercel
function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return "https://impulsala.vercel.app";
}

const SITE_URL = getSiteUrl();
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const metadata: Metadata = {
  title: "Impulsala | Desarrollo Web, SEO y Automatización con IA | Diagnóstico Gratis",
  description:
    "Rediseñamos tu sitio web, lo posicionamos en Google y automatizamos ventas con IA. Resultados medibles en 30 días o devolución. Agenda diagnóstico gratis en Bogotá, Colombia.",
  keywords: [
    "agencia de desarrollo web",
    "diseño web profesional",
    "SEO para empresas",
    "automatización con IA",
    "marketing digital",
    "desarrollo de software a medida",
    "campañas publicitarias Google Ads",
    "agencia digital",
    "chatbots IA",
    "posicionamiento Google",
  ],
  authors: [{ name: "Impulsala" }],
  creator: "Impulsala",
  publisher: "Impulsala",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Impulsala | Agencia de Desarrollo Web + SEO + IA",
    description:
      "Transforma tu negocio digital con desarrollo web profesional, SEO avanzado y automatización con IA. Diagnóstico gratuito.",
    url: SITE_URL,
    siteName: "Impulsala",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Impulsala - Agencia de desarrollo web, SEO y automatización con IA",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Impulsala | Agencia de Desarrollo Web + SEO + IA",
    description:
      "Transforma tu negocio digital con desarrollo web profesional, SEO avanzado y automatización con IA. Diagnóstico gratuito.",
    images: [OG_IMAGE],
  },
  verification: {
    google: "google-site-verification-code-here",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* DNS prefetch for remote images */}
        <link rel="dns-prefetch" href="https://sfile.chatglm.cn" />

        {/* Referencia al sitemap.xml — para crawlers */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('nexus-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = stored ? stored === 'dark' : prefersDark;
                  if (isDark) document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="nexus-theme"
        >
          {children}
          <Toaster />
        </ThemeProvider>
        {/* Schema.org JSON-LD — al final del body para no bloquear el primer paint */}
        <StructuredData />
      </body>
    </html>
  );
}
