"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { faqs } from "./landing-data";

export function Faq() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section ref={ref} className="w-full bg-surface py-10 sm:py-12 md:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div
          className={`text-center mb-6 sm:mb-10 animate-on-scroll ${
            isVisible ? "is-visible" : ""
          }`}
        >
          <span className="text-xs text-primary uppercase tracking-widest font-bold">
            Frequently Asked Questions
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface mt-1">
            Clear Answers to Common Questions
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant mt-1">
            Everything you need to know about ToolNext&apos;s utilities and
            privacy model.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${index}`}
              className={`rounded-2xl bg-card shadow-sm px-4 sm:px-6 border-0 border-l-[3px] border-l-transparent data-open:border-l-primary hover:shadow-md hover:border-l-primary/50 transition-all duration-300 ${
                index % 2 === 0 ? "animate-slide-left" : "animate-slide-right"
              } stagger-${index + 1} ${isVisible ? "is-visible" : ""}`}
            >
              <AccordionTrigger className="py-4 sm:py-5 text-left font-heading text-sm sm:text-base font-bold text-on-surface hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm md:text-base text-on-surface-variant leading-relaxed pb-4 sm:pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
