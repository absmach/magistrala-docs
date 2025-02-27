import { trustedByData } from "../data/data";

export function TrustedBySection() {
  return (
    <section className="tw-py-12">
      <div className="container">
        <h2 className="tw-text-3xl tw-text-center tw-mb-10">
          Our Clients and Partners
        </h2>
        <div className="tw-relative tw-w-full tw-overflow-hidden">
          <div className="tw-flex tw-w-[300%] tw-gap-4">
            {/* First set of logos */}
            <div className="tw-flex tw-w-1/2 tw-animate-marquee tw-items-center">
              {trustedByData.map((t) => (
                <img
                  key={`first-${t.name}`}
                  src={t.logo || "/placeholder.svg"}
                  alt={t.name}
                  style={t.style}
                  className="tw-h-12 tw-mx-8 tw-flex-shrink-0"
                />
              ))}
            </div>
            {/* Second set of logos */}
            <div className="tw-flex tw-w-1/2 tw-animate-marquee tw-items-center">
              {trustedByData.map((t) => (
                <img
                  key={`second-${t.name}`}
                  src={t.logo || "/placeholder.svg"}
                  alt={t.name}
                  style={t.style}
                  className="tw-h-12 tw-mx-8 tw-flex-shrink-0"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
