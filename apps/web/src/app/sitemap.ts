import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Static pages with priorities
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/explore', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/vehicles', priority: 0.9, changeFrequency: 'hourly' as const },
    { path: '/list-car', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/how-it-works', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/faq', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/login', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/register', priority: 0.5, changeFrequency: 'monthly' as const },
  ]

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))

  // Category pages for better SEO
  const categoryEntries: MetadataRoute.Sitemap = [
    'luxury',
    'suv', 
    'sedan',
    'compact',
    'matatu',
    'nganya'
  ].map((category) => ({
    url: `${baseUrl}/vehicles?category=${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Location pages for local SEO
  const locationEntries: MetadataRoute.Sitemap = [
    'nairobi',
    'mombasa',
    'kisumu',
    'nakuru',
    'eldoret'
  ].map((location) => ({
    url: `${baseUrl}/vehicles?location=${location}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Occasion-based pages for targeted SEO
  const occasionEntries: MetadataRoute.Sitemap = [
    'wedding',
    'funeral',
    'graduation',
    'roadtrip',
    'business',
    'airport',
    'safari',
    'family'
  ].map((occasion) => ({
    url: `${baseUrl}/explore?occasion=${occasion}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    ...staticEntries,
    ...categoryEntries,
    ...locationEntries,
    ...occasionEntries
  ]
}