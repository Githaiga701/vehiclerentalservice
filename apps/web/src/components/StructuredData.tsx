"use client";

import { usePathname } from "next/navigation";

interface StructuredDataProps {
  type?: "website" | "organization" | "service" | "product";
  data?: any;
}

export function StructuredData({ type = "website", data }: StructuredDataProps) {
  const pathname = usePathname();

  const getStructuredData = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    switch (type) {
      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "VehicleRent Kenya",
          "description": "Kenya's premier vehicle rental platform",
          "url": baseUrl,
          "logo": `${baseUrl}/icons/icon-192x192.png`,
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+254-700-000-000",
            "contactType": "customer service",
            "availableLanguage": ["English", "Swahili"]
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "KE",
            "addressLocality": "Nairobi"
          },
          "sameAs": [
            "https://facebook.com/vehiclerentkenya",
            "https://twitter.com/vehiclerentke",
            "https://instagram.com/vehiclerentkenya"
          ]
        };

      case "service":
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Vehicle Rental Service",
          "description": "Premium vehicle rental services across Kenya",
          "provider": {
            "@type": "Organization",
            "name": "VehicleRent Kenya"
          },
          "areaServed": {
            "@type": "Country",
            "name": "Kenya"
          },
          "serviceType": "Vehicle Rental",
          "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "priceCurrency": "KES"
          }
        };

      case "product":
        return data ? {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": data.name,
          "description": data.description,
          "image": data.images,
          "offers": {
            "@type": "Offer",
            "price": data.price,
            "priceCurrency": "KES",
            "availability": "https://schema.org/InStock"
          },
          "brand": {
            "@type": "Brand",
            "name": data.make
          }
        } : null;

      default:
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "VehicleRent Kenya",
          "description": "Kenya's premier vehicle rental platform",
          "url": baseUrl,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/vehicles?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        };
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}

// Breadcrumb structured data
export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${baseUrl}${item.url}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}