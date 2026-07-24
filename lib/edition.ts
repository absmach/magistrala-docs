export interface DocEdition {
  label: string;
  value: string;
  path: string;
}

// Enterprise and Community are always merged into the same deployment/origin
// (see scripts/build-editions.mjs), so switching just navigates to the other
// edition's base path on the current origin — a relative path, not a fixed
// domain, so this works the same on localhost, previews, and production.
export const DOC_EDITIONS: DocEdition[] = [
  {
    label: "Enterprise Edition",
    value: "enterprise",
    path: "/docs/magistrala/",
  },
  {
    label: "Community Edition",
    value: "community",
    path: "/docs/magistrala/community/",
  },
];

export const CURRENT_EDITION: "community" | "enterprise" =
  process.env.NEXT_PUBLIC_EDITION === "community" ? "community" : "enterprise";
