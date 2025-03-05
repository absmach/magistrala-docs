import { faqData } from "../data/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export function FaqSection() {
  const { sectionId, title, subtitle, faqs } = faqData;
  return (
    <section id={sectionId} className="tw-py-32">
      <div className="container tw-mx-auto">
        <h2 className="tw-text-3xl lg:tw-text-5xl tw-text-center tw-mb-8 tw-font-normal">
          {title}
        </h2>
        <p className="tw-text-xl tw-text-gray-700 tw-text-center tw-mb-12">
          {subtitle}
        </p>
        <div className="tw-overflow-hidden tw-shadow-md tw-rounded-lg tw-p-6">
          {faqs.map((faq, index) => (
            <div key={faq.title} className="tw-mb-8">
              <h3 className="tw-text-2xl tw-mb-4 tw-font-normal">{faq.title}</h3>
              <FaqItem faqCategory={faq} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface Props {
  faqCategory: {
    title: string;
    faqs: {
      question: string;
      answer: string;
    }[];
  };
  index: number;
}
function FaqItem({ faqCategory, index }: Props) {
  return (
    <Accordion type="single" collapsible={true}>
      {faqCategory.faqs.map((faq, faqIndex) => (
        <AccordionItem key={faq.question} value={`faq-${index}-${faqIndex}`}>
          <AccordionTrigger className="!tw-text-lg tw-mb-2 tw-font-normal tw-text-black">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
