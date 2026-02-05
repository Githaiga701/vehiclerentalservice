import { Metadata } from "next";

const siteConfig = {
  name: "VehicleRent Kenya",
  description: "Kenya's premier vehicle rental platform. Rent cars, SUVs, Matatus, and Nganyas with ease. Available in Nairobi, Mombasa, and nationwide.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  keywords: [
    "car rental Kenya",
    "vehicle rental Nairobi",
    "SUV rental Mombasa", 
    "Matatu rental",
    "Nganya rental",
    "luxury car rental Kenya",
    "long term car lease Kenya",
    "airport car rental JKIA",
    "wedding car rental",
    "business car rental"
  ]
};

export function generateSEO({
  title,
  description,
  image,
  url,
  keywords = [],
  noIndex = false
}: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const seoTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const seoDescription = description || siteConfig.description;
  const seoImage = image || siteConfig.ogImage;
  const seoUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const seoKeywords = [...siteConfig.keywords, ...keywords];

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords.join(", "),
    authors: [{ name: "VehicleRent Kenya" }],
    creator: "VehicleRent Kenya",
    publisher: "VehicleRent Kenya",
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url || "/",
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: seoUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: seoImage,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
      locale: "en_KE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [seoImage],
      creator: "@vehiclerentke",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
    },
  };
}

// Page-specific SEO configurations
export const pageSEO = {
  home: generateSEO({
    title: "Premium Car Rental Service",
    description: "Rent premium vehicles across Kenya. From luxury sedans to Matatus and Nganyas. Book online with instant confirmation and 24/7 support.",
    keywords: ["car rental Kenya", "vehicle booking", "luxury car rental", "Matatu rental", "Nganya rental"]
  }),
  
  explore: generateSEO({
    title: "Explore Our Vehicle Collection",
    description: "Browse our extensive fleet of vehicles. Filter by occasion - weddings, business, road trips, and more. Find the perfect vehicle for any event.",
    url: "/explore",
    keywords: ["vehicle collection", "car categories", "wedding cars", "business vehicles", "road trip cars"]
  }),
  
  vehicles: generateSEO({
    title: "Available Vehicles for Rent",
    description: "View all available vehicles for rent in Kenya. SUVs, sedans, luxury cars, Matatus, and Nganyas. Competitive prices and instant booking.",
    url: "/vehicles",
    keywords: ["available cars", "rent vehicles", "car booking", "vehicle prices"]
  }),
  
  listCar: generateSEO({
    title: "List Your Vehicle - Earn Extra Income",
    description: "List your car, SUV, Matatu, or Nganya on our platform. Earn money through rentals and long-term leasing. Join thousands of vehicle owners.",
    url: "/list-car",
    keywords: ["list car", "earn money", "vehicle leasing", "car sharing", "passive income"]
  }),
  
  login: generateSEO({
    title: "Login to Your Account",
    description: "Secure login with OTP verification. Access your bookings, manage your vehicles, and track your earnings.",
    url: "/login",
    noIndex: true
  }),
  
  register: generateSEO({
    title: "Create Your Account",
    description: "Join VehicleRent Kenya today. Quick registration with phone verification. Start renting or listing vehicles immediately.",
    url: "/register",
    keywords: ["sign up", "create account", "join platform"]
  })
};

export default siteConfig;