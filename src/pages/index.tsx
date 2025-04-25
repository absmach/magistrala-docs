import React from "react";
import { HeroSection } from "../components/section-hero";
import { TrustedBySection } from "../components/section-trusted-by";
import { ProductSection } from "../components/section-product";
import { BenefitsSection } from "../components/section-benefits";
import { PricingSection } from "../components/section-pricing";
import { UsecasesSection } from "../components/section-usecases";
import { FaqSection } from "../components/section-faq";
import HeaderSection from "../components/section-header";
import { FooterSection } from "../components/section-footer";
import { UsedForSection } from "../components/section-use-for";

export default function HomePage() {
  return (
    <div className="web-body">
      <HeaderSection />
      <div className="tw-mt-4 container">
        <div className="row">
          <div className="col col--12">
            <HeroSection />
            <TrustedBySection />
            <ProductSection />
            <BenefitsSection />
            <UsedForSection />
            <UsecasesSection />
            <PricingSection />
            <FaqSection />
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
