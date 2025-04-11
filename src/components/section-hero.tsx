import Link from "@docusaurus/Link";
import { HeroData } from "../data/data";
import { Button } from "./ui/button";

export function HeroSection() {
  return (
    <section className="tw-py-28">
      <div className="w-full md:container">
        <div>
          <div className="tw-text-center md:tw-w-2/3 container">
            <div className="tw-mb-10">
              <div className="tw-space-y-1 tw-mb-4">
                <h2 className="tw-text-4xl md:tw-text-6xl tw-font-normal">
                  {HeroData.title1}
                </h2>
              </div>
              <p className="tw-text-xl tw-text-muted-foreground tw-mr-2">
                {HeroData.subtitle}
              </p>
            </div>
            <div className="tw-flex tw-flex-row tw-gap-4 tw-items-center tw-justify-center">
              <Button
                size="lg"
                variant="default"
                asChild={true}
                className="px-4 py-2 tw-rounded-md w-48 hover:tw-scale-105"
              >
                <Link
                  href={HeroData.getStartedButton.link}
                  className="web-link"
                >
                  {HeroData.getStartedButton.text}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild={true}
                className="px-4 py-2 rounded w-48 hover:tw-scale-105"
              >
                <Link
                  className="web-link"
                  target="_self"
                  href={HeroData.requestDemoButton.link}
                >
                  {HeroData.requestDemoButton.text}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
