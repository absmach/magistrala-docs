export interface DocEdition {
  label: string;
  value: string;
  url: string;
}

// Both editions are built from the same content tree and deployed together
// (see scripts/build-editions.mjs) — this just controls which deployed path
// the switcher links to and which env value selects each build pass.
export const DOC_EDITIONS: DocEdition[] = [
  {
    label: "Enterprise Edition",
    value: "enterprise",
    url: "https://absmach.eu/docs/magistrala/",
  },
  {
    label: "Community Edition",
    value: "community",
    url: "https://absmach.eu/docs/magistrala/community/",
  },
];

export const CURRENT_EDITION: "community" | "enterprise" =
  process.env.NEXT_PUBLIC_EDITION === "community" ? "community" : "enterprise";
