import { Check } from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "@docusaurus/Link";
import { PricingData } from "../data/data";

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
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-8 tw-mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.title}
              title={plan.title}
              features={plan.features}
              ctaText={plan.ctaText}
              ctaVariant={plan.ctaVariant}
              ctaLink={plan.ctaLink}
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
  ctaVariant: "default" | "success";
  ctaLink: string;
}

function PricingCard({ title, features, ctaText, ctaVariant, ctaLink }: Props) {
  return (
    <Card className="tw-flex tw-flex-col tw-p-8 tw-transition-all">
      <CardHeader className="tw-p-4">
        <CardTitle className="tw-text-2xl tw-font-bold tw-text-center tw-mb-8">
          {title}
        </CardTitle>
        <ul className="tw-flex-1 tw-space-y-6 tw-mb-8">
          {features.map((feature) => (
            <li key={feature} className="tw-flex tw-items-start gap-4">
              <Check className="tw-h-6 tw-w-6" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </CardHeader>
      <CardFooter>
        <Button variant="default" asChild={true}>
          <Link href={ctaLink} className="web-link">
            {ctaText}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
