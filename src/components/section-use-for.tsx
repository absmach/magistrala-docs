import { Building, Factory, Laptop } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { UsedForData } from "../data/data";

export function UsedForSection() {
  const { sectionId, title, usedFor } = UsedForData;
  return (
    <section id={sectionId} className="tw-py-32">
      <div className="container tw-mx-auto">
        <h2 className="tw-text-3xl lg:tw-text-5xl tw-text-center tw-mb-8 tw-font-normal">
          {title}
        </h2>

        <div className="tw-grid tw-grid-rows-1 md:tw-grid-cols-3 tw-gap-4">
          {usedFor.map((usedFor) => (
            <UsedForCard key={usedFor.title} usedFor={usedFor} />
          ))}
        </div>
      </div>
    </section>
  );
}

const icons = {
  Laptop,
  Building,
  Factory,
};

function UsedForCard({
  usedFor,
}: {
  usedFor: { title: string; description: string; icon: string };
}) {
  const Icon = icons[usedFor.icon as keyof typeof icons];
  return (
    <Card className="tw-overflow-hidden tw-flex tw-flex-col tw-h-full">
      <Icon className="tw-w-16 tw-h-16 tw-mx-auto tw-mt-4" />
      <CardHeader className="tw-p-4">
        <CardTitle className="tw-text-xl tw-mx-auto">{usedFor.title}</CardTitle>
        <CardDescription className="tw-text-muted-foreground tw-mt-2 tw-text-lg">
          {usedFor.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
