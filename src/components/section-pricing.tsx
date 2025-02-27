import { CircleCheck } from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "@docusaurus/Link";
import { PricingData } from "../data/data";
import { Separator } from "./ui/separator";

export function PricingSection() {
  const { sectionId, title, subtitle, plans } = PricingData;
  return (
    <section id={sectionId} className="tw-py-32">
      <div className="container tw-mx-auto">
        <h2 className="tw-text-3xl lg:tw-text-5xl tw-text-center tw-mb-8">
          {title}
        </h2>
        <p className="tw-text-xl tw-text-gray-700 tw-text-center tw-mb-12">
          {subtitle}
        </p>
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-8 tw-mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.title}
              title={plan.title}
              features={plan.features}
              ctaText={plan.ctaText}
              ctaLink={plan.ctaLink}
              price={plan.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface Props {
  title: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  price?: string;
}

function PricingCard({ title, features, ctaText, ctaLink, price }: Props) {
  return (
    <Card className="tw-flex tw-flex-col tw-h-full tw-transition-all">
      <CardHeader className="tw-p-4">
        <CardTitle className="tw-text-2xl tw-font-bold tw-mb-4">
          {title}
        </CardTitle>
        <p className="tw-text-lg tw-text-muted-foreground">{price}</p>
        <Separator className="!tw-my-4" />
        <ul className="tw-space-y-6 tw-mb-8">
          {features.map((feature) => (
            <li key={feature}>
              <Feature feature={feature} />
            </li>
          ))}
        </ul>
      </CardHeader>
      <CardFooter className="tw-mt-auto">
        <Button variant="default" asChild={true}>
          <Link href={ctaLink} className="web-link">
            {ctaText}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function Feature({ feature }: { feature: string }) {
  return (
    <div className="tw-flex tw-flex-row tw-w-full tw-gap-4">
      <CircleCheck className="tw-h-5 tw-w-5" />
      <span className="text-gray-600 tw-max-w-[80%]">{feature}</span>
    </div>
  );
}
