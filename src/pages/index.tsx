import Layout from "@theme/Layout";
import { useEffect } from "react";
import { HeroSection } from "../components/section-hero";
import { TrustedBySection } from "../components/section-trusted-by";
import { ProductSection } from "../components/section-product";
import { BenefitsSection } from "../components/section-benefits";
import { FeaturesSection } from "../components/section-features";
import { PricingSection } from "../components/section-pricing";
import { UsecasesSection } from "../components/section-usecases";
import { FaqSection } from "../components/section-faq";

export default function HomePage() {
  useEffect(() => {
    document
      .querySelector(".navbar__inner")
      .classList.add("container", "mx-auto");
  }, []);

  return (
    <Layout description="Magistrala bridges the gap between devices, applications, and systems. With multi-protocol messaging, customizable dashboards, and robust security, we make it easy to manage, monitor, and scale your operations.">
      <div className="tw-mt-4 container">
        <div className="row">
          <div className="col col--12">
            <HeroSection />
            <TrustedBySection />
            {/* <ProductSection /> */}
            {/* <BenefitsSection /> */}
            {/* <FeaturesSection /> */}
            {/* <UsecasesSection /> */}
            {/* <PricingSection /> */}
            {/* <FaqSection /> */}
          </div>
        </div>
      </div>
    </Layout>
  );
}
