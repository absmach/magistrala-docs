import { BenefitsData } from "../data/data";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function BenefitsSection() {
  const { sectionId, title, subtitle, benefits } = BenefitsData;
  return (
    <section id={sectionId} className="tw-py-32">
      <div className="container tw-mx-auto tw-text-center">
        <h2 className="tw-text-3xl lg:tw-text-5xl tw-mb-8">{title}</h2>
        <p className="tw-text-xl tw-text-gray-700 tw-mb-12">{subtitle}</p>
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-8">
          {benefits.map((benefit) => (
            <BenefitsCard
              key={benefit.title}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface Props {
  title: string;
  description: string;
  imageUrl?: string;
}
function BenefitsCard({ title, description, imageUrl }: Props) {
  // Add Image (Update this card)
  return (
    <Card>
      <CardHeader className="tw-p-4">
        <CardTitle className="tw-text-xl">{title}</CardTitle>
        <CardDescription className="tw-font-medium tw-mt-2">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
