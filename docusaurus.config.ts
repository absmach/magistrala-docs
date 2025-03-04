import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import tailwindPlugin from "./plugins/tailwind-config.cjs";

const config: Config = {
  title: "Magistrala",
  favicon: "img/favicon.png",

  url: "https://docs.magistrala.abstractmachines.fr",
  baseUrl: "/",

  organizationName: "absmach",
  projectName: "magistrala",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  onBrokenAnchors: "ignore",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [tailwindPlugin],

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/docs",
          sidebarPath: "sidebars.ts",
          editUrl: "https://github.com/absmach/magistrala-docs/blob/main",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          editUrl: "https://github.com/absmach/magistrala-docs/blob/main",
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
          blogSidebarTitle: "All Blog Posts",
          blogSidebarCount: "ALL",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],

  themeConfig: {
    navbar: {
      logo: {
        alt: "Magistrala Logo",
        srcDark: "img/logo-dark.png",
        src: "img/logo-light1.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "userSidebar",
          position: "left",
          label: "User Docs",
        },
        {
          type: "docSidebar",
          sidebarId: "devSidebar",
          position: "left",
          label: "Dev Docs",
        },
        { to: "/blog", label: "Blog", position: "right" },
        {
          href: "https://github.com/absmach/magistrala",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Overview",
              to: "/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/absmach/magistrala",
            },
            {
              label: "Gitter",
              href: "https://app.gitter.im/#/room/#absmach_magistrala:gitter.im?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge",
            },
            {
              label: "Google Group",
              href: "https://groups.google.com/forum/#!forum/mainflux",
            },
            {
              label: "Twitter",
              href: "hhttps://twitter.com/absmach",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Abstract Machines.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    typography: {
      fontFamily: "Inter, sans-serif",
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
