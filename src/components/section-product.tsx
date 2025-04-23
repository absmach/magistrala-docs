import React from "react";
import { ProductData } from "../data/data";

export function ProductSection() {
  const { sectionId, title, content, imageUrl, alt } = ProductData;
  return (
    <section id={sectionId} className="tw-py-32">
      <div className="container tw-mx-auto">
        <div className="tw-flex tw-flex-col lg:tw-flex-row tw-items-start tw-gap-12">
          <div className="tw-w-full lg:tw-w-1/2">
            <img
              src={imageUrl}
              alt={alt}
              width="300px"
              height="225px"
              className="tw-w-full tw-rounded-lg tw-object-cover"
            />
          </div>
          <div className="tw-w-full lg:tw-w-1/2 tw-space-y-6">
            <h2 className="tw-text-3xl lg:tw-text-5xl tw-mb-8 tw-font-normal">
              {title}
            </h2>
            <div className="tw-space-y-6 tw-text-gray-700">
              <p className="tw-text-lg tw-leading-relaxed">
                {content.overview}
              </p>
              <p className="tw-text-lg tw-leading-relaxed">
                {content.security}
              </p>
              <p className="tw-text-lg tw-leading-relaxed">
                {content.community}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
