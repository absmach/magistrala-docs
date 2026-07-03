export interface DocVersion {
  label: string;
  value: string;
  url: string;
}

// Each version is a fully separate deployment (see README.md).
// Update this list on every branch when a new version is cut.
export const DOC_VERSIONS: DocVersion[] = [
  {
    label: "Latest",
    value: "latest",
    url: "https://absmach.eu/docs/magistrala/",
  },
  {
    label: "v0.30.0",
    value: "v0.30.0",
    url: "https://absmach.eu/docs/magistrala/v0-30-0/",
  },
];

export const CURRENT_VERSION = "v0.30.0";
