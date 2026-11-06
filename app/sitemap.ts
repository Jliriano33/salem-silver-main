import { MetadataRoute } from 'next';
import { routableDeals } from '@/lib/deals/registry';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.salemsilver.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://www.salemsilver.com/privacy-policy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: 'https://www.salemsilver.com/thank-you',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // Deal pages Jefri marked indexable, in both languages (goal NN).
    ...routableDeals()
      .filter((d) => d.published && d.indexable)
      .flatMap((d) => [`/deals/${d.slug}`, `/es/deals/${d.slug}`])
      .map((path) => ({
        url: `https://www.salemsilver.com${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
  ];
}
