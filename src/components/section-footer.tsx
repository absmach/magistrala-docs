import React from "react";
import Link from "@docusaurus/Link";
import { FooterData } from "../data/data";
import { Separator } from "./ui/separator";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "./ui/button";

const icons = {
  Twitter,
  Linkedin,
  Github,
} as const;

export function FooterSection() {
  return (
    <footer className="tw-bg-blue-200 tw-py-12">
      <div className="container tw-mx-auto">
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-gap-8 tw-mb-8">
          <CompanyInfo />
          <QuickLinks />
          <SocialLinks />
          <Newsletter />
        </div>
        <Separator />
        <CopyRight />
      </div>
    </footer>
  );
}

function CompanyInfo() {
  const { logo, description } = FooterData.companyInfo;

  return (
    <div className="tw-space-y-4 tw-max-w-sm">
      <img
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
      />
      <p className="tw-text-muted-foreground tw-leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function CopyRight() {
  const { year, rights, policies } = FooterData.footerCopyright;

  return (
    <div className="tw-mt-12">
      <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-space-y-4 md:tw-space-y-0">
        <p className="tw-text-sm tw-text-muted-foreground">
          &copy; {year} Abstract Machines. {rights}
        </p>
        <div className="tw-flex tw-space-x-4 tw-text-sm tw-text-muted-foreground">
          {policies.map((policy) => (
            <Link
              key={policy.label}
              href={policy.href}
              className="web-link hover:tw-text-primary tw-transition-colors"
            >
              {policy.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickLinks() {
  const { quickLinks } = FooterData;

  return (
    <div className="tw-space-y-4">
      <h3 className="tw-text-lg tw-font-normal">Quick Links</h3>
      <ul className="tw-flex tw-flex-col tw-space-y-2">
        {quickLinks.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="web-link hover:tw-text-primary tw-transition-colors tw-text-muted-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLinks() {
  const { socialLinks } = FooterData;

  return (
    <div className="tw-space-y-8">
      <div className="tw-space-y-4">
        <h3 className="tw-text-lg tw-font-normal">Connect With Us</h3>
        <ul className="tw-flex tw-flex-col tw-space-y-2">
          {socialLinks.map((link) => {
            const Icon = icons[link.icon as keyof typeof icons];
            return (
              <li key={link.platform}>
                <Link
                  href={link.href}
                  target="_blank"
                  className="web-link hover:tw-text-primary tw-transition-colors tw-flex tw-items-center tw-text-muted-foreground"
                >
                  <Icon className="tw-mr-2 tw-h-4 tw-w-4" />
                  {link.platform}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="tw-space-y-4">
        <h3 className="tw-text-lg tw-font-normal">Acknowledgments</h3>
        <a
          href="https://storyset.com/technology"
          target="_blank"
          className="tw-text-muted-foreground"
        >
          Technology illustrations by Storyset
        </a>
      </div>
    </div>
  );
}

function Newsletter() {
  const { title, subtitle, placeholder, buttonText } = FooterData.newsletter;

  return (
    <div className="tw-space-y-4">
      <h3 className="tw-text-lg tw-font-semibold">{title}</h3>
      <p className="tw-text-sm tw-text-muted-foreground">{subtitle}</p>
      <div className="tw-flex tw-flex-row tw-items-center tw-gap-2">
        <input
          type="email"
          placeholder={placeholder}
          className="tw-flex-1 tw-min-w-0 tw-p-2 tw-rounded-md tw-border-gray-300 tw-text-gray-800"
        />
        <Button
          aria-label={buttonText}
          className="tw-px-4 tw-py-2 tw-text-sm tw-whitespace-nowrap"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
