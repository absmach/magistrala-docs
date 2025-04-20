import Link from "@docusaurus/Link";
import { Button } from "./ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { UsecasesData } from "../data/data";
import React from "react";

export function UsecasesSection() {
  const { sectionId, title, subtitle, useCases } = UsecasesData;
  return (
    <section id={sectionId} className="tw-py-32">
      <div className="container tw-mx-auto">
        <h2 className="tw-text-3xl lg:tw-text-5xl tw-text-center tw-mb-8 tw-font-normal">
          {title}
        </h2>
        <p className="tw-text-xl tw-text-gray-700 tw-text-center tw-mb-12">
          {subtitle}
        </p>
        <div className="tw-grid tw-grid-rows-1 md:tw-grid-cols-3 tw-gap-4">
          {useCases.map((useCase) => (
            <UsecaseCard
              key={useCase.title}
              title={useCase.title}
              description={useCase.description}
              imageUrl={useCase.imageUrl}
              ctaText={useCase.ctaText}
              ctaLink={useCase.ctaLink}
              secondaryCtaText={useCase.secondaryCtaText}
              secondaryCtaLink={useCase.secondaryCtaLink}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface Props {
  key?: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

function UsecaseCard({
  title,
  description,
  imageUrl,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
}: Props) {
  return (
    <Card className="tw-overflow-hidden tw-flex tw-flex-col tw-h-full">
      <div>
        {/* add image here */}
        <CardHeader className="tw-p-4">
          <CardTitle className="tw-text-lg">{title}</CardTitle>
          <CardDescription className="tw-text-muted-foreground tw-mt-2">
            {description}
          </CardDescription>
        </CardHeader>
      </div>
      <CardFooter className="tw-mt-auto tw-p-4 tw-flex tw-flex-row tw-gap-4">
        <Button variant="default" asChild={true}>
          <Link href={ctaLink || "#"} className="web-link">
            {ctaText}
          </Link>
        </Button>
        {secondaryCtaText && secondaryCtaLink && (
          <Button variant="outline" asChild={true}>
            <Link href={secondaryCtaLink} className="web-link">
              {secondaryCtaText}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
