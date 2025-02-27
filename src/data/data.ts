import { getCurrentYear } from "../lib/utils";

export const navigationLinks = [
  { label: "Features", href: "#features" },
  { label: "Solutions", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "/docs" },
  {
    label: "Blog",
    href: "https://medium.com/abstract-machines-blog",
  },
];

const Logo = {
  src: "/img/logo-light1.png",
  alt: "Magistrala Logo",
  width: "250px",
  height: "250px",
  placeholder: "/placeholder.svg",
};

export const HeaderData = {
  Logo: Logo,
  navigationLinks: navigationLinks,
  ctaButton: {
    text: "Try For Free",
    link: "#pricing",
  },
};

export const footerData = {
  companyInfo: {
    Logo: Logo,
    name: "Magistrala",
    description:
      "Connecting devices, sharing data, and visualizing insights with our powerful IoT platform built for the future.",
  },
  quickLinks: navigationLinks,
  socialLinks: [
    {
      platform: "Twitter",
      icon: "Twitter",
      href: "https://twitter.com/absmach",
    },
    {
      platform: "LinkedIn",
      icon: "Linkedin",
      href: "https://www.linkedin.com/company/abstract-machines",
    },
    {
      platform: "GitHub",
      icon: "Github",
      href: "https://github.com/absmach/magistrala",
    },
  ],
  contact: {
    email: "info@abstractmachines.fr",
  },
  newsletter: {
    title: "Newsletter",
    subtitle: "Stay in the loop",
    placeholder: "Your email address",
    buttonText: "Subscribe",
  },
  footerCopyright: {
    year: getCurrentYear(),
    rights: "All rights reserved.",
    policies: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
};

export const heroData = {
  title1: "Simplify Messaging",
  title2: "Empower Systems",
  title3: "Integrate Seamlessly",
  subtitle:
    "Magistrala bridges the gap between devices, applications, and systems. With multi-protocol messaging, customizable dashboards, and robust security, we make it easy to manage, monitor, and scale your operations.",
  getStartedButton: {
    text: "Get Started",
    link: "#",
  },
  requestDemoButton: {
    text: "Request For Demo",
    link: "#",
  },
  image: {
    url: "hero.webp",
    alt: "Hero Image",
  },
};

export const trustedByData = [
  {
    name: "Target",
    logo: "img/logos/target.png",
    style: {
      height: "70px",
    },
  },
  {
    name: "Greennet",
    logo: "img/logos/greennet.png",
    style: {
      height: "40px",
    },
  },
  {
    name: "EU Commission",
    logo: "img/logos/eu.png",
    style: {
      height: "70px",
    },
  },
  {
    name: "Telefonica",
    logo: "img/logos/telefonica.png",
    style: {
      height: "40px",
    },
  },
  {
    name: "TUe",
    logo: "img/logos/tue.png",
    style: {
      height: "40px",
    },
  },
  {
    name: "TNO",
    logo: "img/logos/tno.png",
    style: {
      height: "50px",
    },
  },
  {
    name: "Intel",
    logo: "img/logos/parc.png",
    style: {
      height: "40px",
    },
  },
  {
    name: "VTT",
    logo: "img/logos/vtt.png",
    style: {
      height: "50px",
    },
  },
  {
    name: "etf",
    logo: "img/logos/etf.png",
    style: {
      height: "70px",
    },
  },
  {
    name: "LF",
    logo: "img/logos/lf.png",
    style: {
      height: "50px",
    },
  },
];
