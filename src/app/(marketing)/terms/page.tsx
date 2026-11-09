import { Info, Scale } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  MarketingPageFrame,
  type PolicySectionData,
  PolicySections,
} from "@/components/marketing/marketing-page";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use | ToolNext",
  description:
    "Read the terms for using ToolNext, including availability, accuracy limitations, acceptable use, and service changes.",
  alternates: { canonical: "/terms" },
};

const sections: PolicySectionData[] = [
  {
    id: "agreement",
    title: "1. Agreement and service description",
    content: (
      <>
        <p>
          These Terms of Use (“Terms”) apply when you access or use the ToolNext
          website, tool directory, and any utility made available through it
          (together, the “Service”). By using the Service, you agree to these
          Terms. If you do not agree, do not use it.
        </p>
        <p>
          ToolNext is a growing product. The directory can include both tools
          that are available and ideas marked “Coming soon.” A planned listing
          is descriptive only: it is not an offer, a promise to deliver, or an
          active tool.
        </p>
        <p>
          The Service currently provides browser-based utilities without
          requiring an account. Features, availability, and these Terms may
          change as the product develops.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "2. Eligibility and your responsibility",
    content: (
      <>
        <p>
          You may use the Service only if you can legally agree to these Terms
          where you live. If you use it for an organization, you represent that
          you have authority to accept these Terms for that organization.
        </p>
        <p>
          You are responsible for your device, browser, network connection, the
          information you enter, and how you interpret or use a tool’s output.
          Check results that matter to you independently before relying on them.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "3. Acceptable use",
    content: (
      <>
        <p>
          Use the Service lawfully and in a way that does not interfere with
          other users or the operation of the site. You must not:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Attempt to disrupt, overload, probe, or gain unauthorized access to
            the Service, its infrastructure, or another person’s systems.
          </li>
          <li>
            Use automated requests in a way that harms availability or bypasses
            reasonable technical limits.
          </li>
          <li>
            Use the Service to violate applicable laws, infringe others’ rights,
            or process information you are not authorized to use.
          </li>
          <li>
            Misrepresent a tool’s results as certified, authoritative, or
            produced by a qualified professional when they are not.
          </li>
          <li>
            Remove or interfere with notices, security controls, or restrictions
            that protect the Service or its users.
          </li>
        </ul>
        <p>
          We may restrict access when reasonably necessary to protect the
          Service, users, or infrastructure, or to comply with law.
        </p>
      </>
    ),
  },
  {
    id: "tool-outputs",
    title: "4. Tool outputs are for general assistance",
    content: (
      <>
        <p>
          Tools are provided for convenience and general informational use. They
          are not a substitute for professional advice, certified measurement,
          legal or financial review, medical guidance, engineering analysis, or
          another qualified service.
        </p>
        <p>
          Although we aim to make the available tools useful, outputs may be
          incomplete, rounded, affected by input formatting, or unsuitable for a
          particular purpose. Always verify calculations, conversions, and other
          outputs independently when accuracy is important—especially before
          making a safety-critical, financial, legal, health, or operational
          decision.
        </p>
        <p>
          The Service does not guarantee that its results meet a regulatory,
          industry, accessibility, or professional standard unless a specific
          tool explicitly says so and identifies its basis.
        </p>
      </>
    ),
  },
  {
    id: "your-content",
    title: "5. Your inputs and content",
    content: (
      <>
        <p>
          You retain whatever rights you have in information you enter. The
          current available tools process their calculations in your browser;
          some inputs and settings may be saved in local browser storage as
          explained in the{" "}
          <Link
            href="/privacy"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          . No ownership of your input is transferred to ToolNext by using these
          browser tools.
        </p>
        <p>
          Do not enter material that you are not entitled to use, or
          confidential, personal, or sensitive information that should not be
          stored on your device. A browser-based tool is not a secure vault.
        </p>
        <p>
          Some future tools may require server-side processing or an external
          service. If so, the relevant tool should identify that requirement and
          its data handling before you submit information to it.
        </p>
      </>
    ),
  },
  {
    id: "availability",
    title: "6. Availability, changes, and maintenance",
    content: (
      <>
        <p>
          We may add, change, pause, or remove tools or features; correct
          errors; perform maintenance; or change how the Service is organized.
          We do not promise that any tool or the whole Service will be
          continuously available, compatible with every device, or free of
          defects.
        </p>
        <p>
          A “Coming soon” label is not a delivery date or a commitment to build
          a tool. Catalog descriptions and planned features can change as we
          learn what is useful and feasible.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    title: "7. Third-party services and links",
    content: (
      <p>
        The Service may rely on hosting, network, or other infrastructure
        providers, and a future tool may link to or depend on an external
        service. Those services are operated by others and may have their own
        terms and privacy practices. We are not responsible for third-party
        services we do not control. Review their terms before using them.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    title: "8. Service materials and feedback",
    content: (
      <>
        <p>
          The Service’s name, branding, original interface, and site materials
          are owned by or licensed to the operator, subject to third-party
          rights and open-source licenses. These Terms do not grant you
          ownership of those materials. You may use the Service for its intended
          purpose and may link to public pages.
        </p>
        <p>
          If you send feedback through a channel made available by the operator,
          do not include confidential information. You allow the operator to
          consider and use general suggestions to improve the Service, without
          an obligation to adopt them or pay for them, subject to any rights
          that cannot be waived under applicable law.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "9. Disclaimers",
    content: (
      <p>
        To the extent allowed by applicable law, the Service is provided “as is”
        and “as available,” without warranties or conditions of any kind,
        whether express, implied, or statutory. This includes, without
        limitation, implied warranties of merchantability, fitness for a
        particular purpose, title, non-infringement, accuracy, availability, and
        error-free operation. Nothing in these Terms excludes a warranty or
        right that applicable law does not allow to be excluded.
      </p>
    ),
  },
  {
    id: "liability",
    title: "10. Limitation of liability",
    content: (
      <p>
        To the extent permitted by applicable law, the operator will not be
        liable for indirect, incidental, special, consequential, exemplary, or
        punitive damages, or for loss of data, profits, goodwill, or business
        opportunities arising from or related to your use of—or inability to
        use—the Service. Any limitation applies only to the extent the law
        allows. Nothing in these Terms excludes or limits liability, consumer
        rights, or remedies that cannot legally be excluded or limited.
      </p>
    ),
  },
  {
    id: "indemnity",
    title: "11. Responsibility for misuse",
    content: (
      <p>
        To the extent permitted by applicable law, you are responsible for
        losses or claims caused by your unlawful use of the Service or material
        breach of these Terms. This section does not require you to waive rights
        or protections that cannot legally be waived.
      </p>
    ),
  },
  {
    id: "law",
    title: "12. Applicable law and disputes",
    content: (
      <p>
        These Terms are subject to applicable law. Mandatory consumer
        protections and rights that cannot be waived remain in effect. The site
        operator’s legal identity, governing-law choice, and dispute forum have
        not been supplied in the current deployment configuration; those details
        should be reviewed and published by the operator before launch or before
        offering paid or account-based services.
      </p>
    ),
  },
  {
    id: "changes-to-terms",
    title: "13. Updates to these Terms",
    content: (
      <p>
        We may revise these Terms to reflect product, operational, or legal
        changes. The “Last updated” date identifies the latest revision.
        Continued use after an update takes effect means you accept the revised
        Terms to the extent applicable law permits. If you do not agree, stop
        using the Service.
      </p>
    ),
  },
  {
    id: "contact",
    title: "14. Contact",
    content: contactEmail ? (
      <p>
        For questions about these Terms, contact the site operator at{" "}
        <a
          href={`mailto:${contactEmail}`}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          {contactEmail}
        </a>
        .
      </p>
    ) : (
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
        <Info
          className="mt-1 size-4 shrink-0 text-amber-700 dark:text-amber-300"
          aria-hidden="true"
        />
        <p>
          A direct contact address has not been configured for this deployment.
          The site operator should publish a monitored support and legal contact
          address before launch.
        </p>
      </div>
    ),
  },
];

export default function TermsPage() {
  return (
    <MarketingPageFrame
      eyebrow="Terms & conditions"
      title="Terms of Use"
      description="The ground rules for using ToolNext, understanding tool availability, and deciding how much to rely on a tool’s output."
      icon={Scale}
      updatedAt="November 9, 2026"
    >
      <PolicySections sections={sections} />
      <p className="mt-6 text-xs leading-relaxed text-outline">
        These Terms are general product terms, not legal advice. They should be
        reviewed by the service operator for the operator’s identity,
        jurisdiction, and applicable consumer-protection requirements before
        publication.
      </p>
    </MarketingPageFrame>
  );
}
