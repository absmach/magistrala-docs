import Link from "@docusaurus/Link";
import { heroData } from "../data/data";
import { Button } from "./ui/button";

export function HeroSection() {
  return (
    <section className="tw-py-32">
      <div className="container">
        <div>
          <div className="tw-text-center tw-w-2/3 container">
            <div className="tw-mb-10">
              <div className="tw-space-y-1 tw-mb-4">
                <h2 className="tw-text-6xl">{heroData.title1}</h2>
                <h2 className="tw-text-6xl">{heroData.title2}</h2>
                <h2 className="tw-text-6xl">{heroData.title3}</h2>
              </div>
              <p className="tw-text-xl tw-text-muted-foreground tw-mr-2">
                {heroData.subtitle}
              </p>
            </div>
            <div className="tw-flex tw-flex-row tw-gap-4 tw-items-center tw-justify-center">
              <Button
                size="lg"
                variant="default"
                asChild={true}
                className="px-4 py-2 rounded w-48 hover:tw-scale-105"
              >
                <Link
                  href={heroData.getStartedButton.link}
                  className="web-link"
                >
                  {heroData.getStartedButton.text}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild={true}
                className="px-4 py-2 rounded w-48 hover:tw-scale-105"
              >
                <Link
                  href={heroData.requestDemoButton.link}
                  className="web-link"
                >
                  {heroData.requestDemoButton.text}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
