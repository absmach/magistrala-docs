import { TrustedByData } from "../data/data";
import Marquee from "react-fast-marquee";

export function TrustedBySection() {
  return (
    <section className="tw-py-14">
      <div className="container">
        <h2 className="tw-text-3xl tw-text-center tw-mb-10 tw-font-normal">
          Our Clients and Partners
        </h2>
        <div className="tw-relative tw-w-full tw-overflow-hidden">
          <div className="tw-flex tw-w-[500%] md:tw-w-[300%] tw-gap-4">
            <Marquee autoFill={true}>
              {TrustedByData.map((t) => (
                <img
                  key={`first-${t.name}`}
                  src={t.logo || "/placeholder.svg"}
                  alt={t.name}
                  style={t.style}
                  className="tw-h-12 tw-mx-8 tw-flex-shrink-0"
                />
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
}
