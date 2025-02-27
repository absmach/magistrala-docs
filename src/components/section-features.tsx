import { FeaturesData } from "../data/data";

export function FeaturesSection() {
  const { sectionId, title, subtitle, features } = FeaturesData;
  return (
    <section id={sectionId} className="tw-py-32">
      <div className="container tw-mx-auto ">
        <h2 className="tw-text-3xl lg:tw-text-5xl tw-mb-8 tw-text-center">
          {title}
        </h2>
        <p className="tw-text-xl tw-text-gray-700 tw-mb-12 tw-text-center">
          {subtitle}
        </p>
        <div className="tw-space-y-12">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              imageUrl={feature.imageUrl}
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
  imageUrl: string;
  reverse?: boolean;
}

function FeatureCard({ title, description, imageUrl, reverse }: Props) {
  return (
    <div className="tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-justify-between tw-gap-8">
      <div className="tw-w-full md:tw-w-1/2 tw-space-y-4">
        <h3 className="tw-text-2xl lg:tw-text-4xl">{title}</h3>
        <p className="tw-text-gray-700 tw-text-lg lg:tw-text-xl">
          {description}
        </p>
      </div>
    </div>
  );
}
