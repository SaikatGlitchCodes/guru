import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/AuthProvider";
import DebugAuth from "@/components/DebugAuth";
import FloatingFeedback from "@/components/FloatingFeedback";
import { GoogleAnalytics, MicrosoftClarity } from "@/components/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://toptutor.com'),
  title: {
    default: "Toptutor - #1 Online Tutoring Platform | Find Expert Tutors & Teaching Jobs",
    template: "%s | Toptutor - Premier Online Tutoring Platform"
  },
  description: "🎓 India's #1 online tutoring platform connecting 10,000+ expert tutors with students worldwide. ✅ Free student requests ✅ Instant tutor matching ✅ Verified profiles ✅ 500+ subjects. Start learning today!",
  keywords: [
    "online tutoring",
    "find tutors",
    "teaching jobs",
    "private tutors",
    "online teachers",
    "study help",
    "homework help",
    "exam preparation",
    "NEET coaching",
    "JEE preparation",
    "CBSE tutors",
    "ICSE tutors",
    "coding tutors",
    "math tutors",
    "english tutors",
    "science tutors",
    "language tutors",
    "music teachers",
    "fitness trainers",
    "academic support",
    "personalized learning",
    "one-on-one tutoring",
    "group classes",
    "affordable tutoring",
    "verified tutors",
    "expert teachers",
    "student-tutor matching",
    "online education",
    "distance learning",
    "virtual classrooms",
    "tutoring platform India",
    "best online tutors",
    "tutor marketplace",
    "teaching career",
    "earn teaching online",
    "tutor jobs"
  ].join(", "),
  authors: [{ name: "Toptutor Team" }],
  creator: "Toptutor",
  publisher: "Toptutor Educational Services",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://toptutor.com',
    siteName: 'Toptutor',
    title: 'Toptutor - India\'s Premier Online Tutoring Platform',
    description: '🎓 Connect with 10,000+ expert tutors across 500+ subjects. Free student requests, instant matching, verified profiles. Start your learning journey today!',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Toptutor - Online Tutoring Platform',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'Toptutor - Connect with Expert Tutors',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@toptutor_in',
    creator: '@toptutor_in',
    title: 'Toptutor - India\'s #1 Online Tutoring Platform',
    description: '🎓 10,000+ expert tutors ✅ 500+ subjects ✅ Free student requests ✅ Instant matching. Start learning today!',
    images: ['/twitter-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    },
  },
  alternates: {
    canonical: 'https://toptutor.com',
    languages: {
      'en-IN': 'https://toptutor.com',
      'hi-IN': 'https://toptutor.com/hi',
    },
  },
  category: 'Education',
  classification: 'Online Education Platform',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'FindGuru',
    'application-name': 'FindGuru',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#2563eb',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#2563eb',
  },
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://toptutor.com/#organization",
        "name": "Toptutor",
        "url": "https://toptutor.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://toptutor.com/logo.png",
          "width": 200,
          "height": 60
        },
        "sameAs": [
          "https://www.facebook.com/toptutor.in",
          "https://twitter.com/toptutor_in",
          "https://www.linkedin.com/company/toptutor",
          "https://www.instagram.com/toptutor.in"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-9999999999",
          "contactType": "customer service",
          "availableLanguage": ["English", "Hindi"]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://toptutor.com/#website",
        "url": "https://toptutor.com",
        "name": "Toptutor",
        "description": "India's premier online tutoring platform connecting expert tutors with students",
        "publisher": {
          "@id": "https://toptutor.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://toptutor.com/find-tutors?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "EducationalOrganization",
        "name": "Toptutor",
        "url": "https://toptutor.com",
        "description": "Premier online tutoring platform with verified expert tutors",
        "hasCredential": "Verified Online Education Platform",
        "offers": {
          "@type": "Offer",
          "name": "Online Tutoring Services",
          "description": "Expert tutoring across 500+ subjects",
          "category": "Education"
        }
      }
    ]
  };

  return (
    <html lang="en" dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Shortcut icon for older browsers */}
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* DNS Prefetch for better performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Additional PWA icons */}
        <link rel="icon" href="/icon-192x192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/icon-512x512.png" sizes="512x512" type="image/png" />
        
        {/* Structured Data */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        
        {/* Critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .critical-css {
              font-display: swap;
            }
            /* Add critical CSS here for above-the-fold content */
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        itemScope 
        itemType="https://schema.org/WebPage"
      >
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
        <MicrosoftClarity CLARITY_PROJECT_ID={process.env.NEXT_PUBLIC_CLARITY_ID} />
        
        <AuthProvider requireAuth={false}>
          <Navbar />
          <main role="main" id="main-content">
            {children}
          </main>
          <Toaster />
          <DebugAuth />
          <FloatingFeedback />
        </AuthProvider>
      </body>
    </html>
  );
}
