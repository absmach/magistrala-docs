import Link from "@docusaurus/Link";
import { HeaderData } from "../data/data";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Menu } from "lucide-react";
import { Separator } from "./ui/separator";

export default function HeaderSection() {
  return (
    <header className="tw-sticky tw-top-0 tw-z-50 tw-shadow-sm tw-py-4 tw-bg-white">
      <div className="container tw-mx-auto tw-flex tw-items-center tw-justify-between">
        <Link href="/" className="web-link">
          <img
            src={HeaderData.logo.src}
            alt={HeaderData.logo.alt}
            width={HeaderData.logo.width}
            height={HeaderData.logo.height}
          />
        </Link>
        <nav className="tw-hidden md:tw-flex tw-flex-1 tw-justify-center">
          <ul className="tw-flex tw-space-x-8 tw-items-center">
            {HeaderData.navigationLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="web-link tw-text-xl tw-transition-colors hover:tw-text-blue-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="tw-hidden md:tw-flex tw-items-center tw-gap-6">
          <Button aria-label={HeaderData.ctaButton.text} asChild={true}>
            <Link href={HeaderData.ctaButton.link} className="web-link">
              {HeaderData.ctaButton.text}
            </Link>
          </Button>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild={true}>
        <Button className="md:tw-hidden" aria-label="Toggle Mobile menu">
          <Menu className="tw-h-6 tw-w-6 tw-text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle className="tw-hidden">Menu</SheetTitle>
        </SheetHeader>
        <Separator className="tw-my-8" />
        <nav className="tw-flex tw-flex-col tw-gap-4">
          <ul className="tw-flex tw-flex-col tw-space-y-4 tw-items-center">
            {HeaderData.navigationLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="web-link tw-text-xl tw-hover:text-blue-600 tw-transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Separator className="tw-my-4" />

          <Button aria-label={HeaderData.ctaButton.text} asChild={true}>
            <Link className="web-link" href={HeaderData.ctaButton.link}>
              {HeaderData.ctaButton.text}
            </Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
