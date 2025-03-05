import { CircleCheck } from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "@docusaurus/Link";
import { PricingData } from "../data/data";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useState } from "react";

export function PricingSection() {
  const { sectionId, title, subtitle, plans } = PricingData;
  const [annual, setAnnual] = useState(false);
  return (
    <section id={sectionId} className="tw-py-32">
      <div className="container tw-mx-auto">
        <h2 className="tw-text-3xl lg:tw-text-5xl tw-text-center tw-mb-8 tw-font-normal">
          {title}
        </h2>
        <p className="tw-text-xl tw-text-gray-700 tw-text-center tw-mb-12">
          {subtitle}
        </p>
        <div className="tw-flex tw-flex-row tw-w-full tw-justify-center tw-items-center tw-gap-2 tw-mb-10">
          <Switch
            id="billing-period"
            checked={annual}
            onCheckedChange={setAnnual}
          />
          <Label htmlFor="billing period">
            Annual billing{" "}
            <span className="tw-text-primary">(Save up to 10%)</span>
          </Label>
        </div>
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-8 tw-mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.title}
              title={plan.title}
              features={plan.features}
              ctaText={plan.ctaText}
              ctaLink={plan.ctaLink}
              price={plan.price}
              annual={annual}
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
  price?: { custom: boolean; month: string; year: string };
  annual: boolean;
}

function PricingCard({
  title,
  features,
  ctaText,
  ctaLink,
  price,
  annual,
}: Props) {
  return (
    <Card className="tw-flex tw-flex-col tw-h-full tw-transition-all">
      <CardHeader className="tw-p-4">
        <CardTitle className="tw-text-2xl tw-font-bold tw-mb-4">
          {title}
        </CardTitle>
        <div>
          {price.custom ? (
            <span className="tw-text-3xl">{price.month}</span>
          ) : (
            <div>
              <span className="tw-text-3xl">
                € {annual ? price.year : price.month}
              </span>
              <span className="tw-text-gray-500 tw-text-sm tw-ml-2">/mo</span>
            </div>
          )}
        </div>
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
      <CircleCheck className="tw-h-5 tw-w-5 tw-text-primary" />
      <span className="text-gray-600 tw-max-w-[80%]">{feature}</span>
    </div>
  );
}
