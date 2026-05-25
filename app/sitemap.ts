import type { MetadataRoute } from "next";
import { toSiteUrl } from "@/lib/base-path";
import { source } from "@/lib/source";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return source.getPages().map((page) => ({
    url: toSiteUrl(page.url),
    priority: 0.7,
    changeFrequency: "weekly" as const,
  }));
}
