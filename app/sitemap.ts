import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

const DOMAIN =
  process.env.NEXT_PUBLIC_SITE_URL || "https://magistrala.absmach.eu";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return source.getPages().map((page) => ({
    url: `${DOMAIN}${page.url}`,
    priority: 0.7,
    changeFrequency: "weekly" as const,
  }));
}
