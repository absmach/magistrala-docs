import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import tailwindPlugin from "./plugins/tailwind-config.cjs";

const config: Config = {
  title: "Magistrala",
  favicon: "img/Magistrala_logo_square_white.svg",

  url: "https://docs.magistrala.absmach.eu",
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

  plugins: [
    tailwindPlugin,
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        indexDocs: true,
        indexPages: true,
        language: ["en"],
        docsRouteBasePath: "/docs",
      },
    ],
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
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
          customCss: "src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],

  themeConfig: {
    metadata: [
      // SEO
      { name: 'title', content: 'Magistrala | Open Source IoT Platform' },
      { name: 'keywords', content: 'IoT, Cloud, Middleware, Open Source, Magistrala' },
      { name: 'author', content: 'Abstract Machines' },
      { name: 'description', content: 'Magistrala is an open-source, multi-protocol IoT platform designed for scalable and secure device communication and management.' },
      { name: 'robots', content: 'index, follow' },

      // Open Graph
      { property: 'og:title', content: 'Magistrala | Open Source IoT Platform' },
      { property: 'og:description', content: 'Secure, scalable, and multi-protocol middleware for building IoT solutions.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://docs.magistrala.absmach.eu/' },
      { property: 'og:image', content: 'https://docs.magistrala.absmach.eu/img/mg-preview.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Magistrala Logo' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@absmach' },
      { name: 'twitter:title', content: 'Magistrala | Open Source IoT Platform' },
      { name: 'twitter:description', content: 'Secure, scalable, and multi-protocol middleware for building IoT solutions.' },
      { name: 'twitter:image', content: 'https://docs.magistrala.absmach.eu/img/mg-preview.png' },
      { name: 'twitter:image:alt', content: 'Magistrala Logo' },
    ],
    navbar: {
      logo: {
        alt: "Magistrala Logo",
        srcDark: "img/Magistrala_logo_landscape_white.svg",
        src: "img/Magistrala_logo_landscape_black.svg",
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
          label: "Developer Docs",
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
              label: "LinkedIn",
              href: 'https://www.linkedin.com/company/abstract-machines',
            },
            {
              label: "Twitter",
              href: "https://twitter.com/absmach",
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
            {
              label: "Medium",
              href: "https://medium.com/abstract-machines-blog",
            }
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

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://docs.magistrala.absmach.eu',
      },
    },
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Abstract Machines',
        url: 'https://www.absmach.eu',
        logo: 'https://docs.magistrala.absmach.eu/img/Magistrala_logo_square_white.svg',
        sameAs: [
          'https://twitter.com/absmach',
          'https://github.com/absmach/magistrala',
          'https://www.linkedin.com/company/abstract-machines'
        ],
      }),
    },

  ],
};

export default config;
