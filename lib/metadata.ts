import type { Metadata } from "next/types";

function resolveTitle(title: Metadata["title"]): string {
  if (!title) return "Magistrala — Open-Source IoT Platform for Cloud & Edge";
  if (typeof title === "string") return title;
  if ("default" in title && title.default) return title.default;
  return "Magistrala — Open-Source IoT Platform for Cloud & Edge";
}

export function createMetadata(
  override: Metadata,
  ogSlug = "magistrala",
): Metadata {
  const ogUrl = `${baseUrl}/og/${ogSlug}/image.webp`;
  const resolvedTitle = resolveTitle(override.title);
  const canonicalUrl =
    override.alternates?.canonical ??
    (override.openGraph?.url as string | URL | undefined);
  const alternates = canonicalUrl
    ? {
        ...override.alternates,
        canonical: canonicalUrl,
      }
    : override.alternates;
  const openGraphUrl = override.openGraph?.url;
  return {
    ...override,
    ...(alternates ? { alternates } : {}),
    openGraph: {
      title: resolvedTitle,
      description: override.description ?? undefined,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: "Magistrala — Open Source IoT Platform for Cloud & Edge",
        },
      ],
      siteName: "Magistrala",
      ...(openGraphUrl ? { url: openGraphUrl } : {}),
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      site: "@absmach",
      creator: "@absmach",
      title: resolvedTitle,
      description: override.description ?? undefined,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: "Magistrala — Open Source IoT Platform for Cloud & Edge",
        },
      ],
      ...override.twitter,
    },
  };
}

export const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://magistrala.absmach.eu";
