import { Info, LockKeyhole } from "lucide-react";
import type { Metadata } from "next";
import {
  MarketingPageFrame,
  type PolicySectionData,
  PolicySections,
} from "@/components/marketing/marketing-page";
import { contactEmail } from "@/lib/site";
import { availableTools } from "@/lib/tool-registry/tools";

export const metadata: Metadata = {
  title: "Privacy Policy | ToolNext",
  description:
    "Learn what ToolNext processes, what stays in your browser, and how to manage local tool data and offline site storage.",
  alternates: { canonical: "/privacy" },
};

const sections: PolicySectionData[] = [
  {
    id: "scope",
    title: "1. Scope and current service",
    content: (
      <>
        <p>
          This policy describes the ToolNext website, its directory, and the
          tools currently marked “Available.” It reflects the product as of
          November 9, 2026. A tool marked “Coming soon” is a catalog listing,
          not an active tool.
        </p>
        <p>
          ToolNext currently has {availableTools.length} tools marked available.
          The website does not currently require an account to use them. Future
          tools may have different data needs; this policy and the relevant tool
          page should explain those differences before such a tool is used.
        </p>
      </>
    ),
  },
  {
    id: "tool-inputs",
    title: "2. Tool inputs and calculations",
    content: (
      <>
        <p>
          The current available tool calculations run in the browser. The
          implementations do not upload tool inputs to a ToolNext application
          server for processing. This includes text transformations, JSON
          formatting, date and numeric calculations, color conversion, URL
          parsing and building, hashing, subtitle text conversion, and local
          generators.
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Word Counter:</strong> the text you enter is counted in the
            page and may be saved in this browser to restore it later.
          </li>
          <li>
            <strong>Percentage Calculator:</strong> the two entered values may
            be saved in this browser.
          </li>
          <li>
            <strong>Unit Converter:</strong> the entered amount and selected
            units may be saved in this browser.
          </li>
          <li>
            <strong>Color Picker:</strong> the color value may be saved in this
            browser. If you choose a copy action, your browser may write that
            value to the device clipboard.
          </li>
          <li>
            <strong>Other available tool pages:</strong> their current inputs
            and results are held in page memory while you use the page and are
            not saved by those tools in local storage.
          </li>
        </ul>
        <p>
          Browser-based processing is not a guarantee that the device itself is
          private or secure. Other people or software with access to your device
          or browser profile may be able to see information left there. Do not
          enter sensitive, confidential, or regulated information.
        </p>
      </>
    ),
  },
  {
    id: "local-storage",
    title: "3. Local storage and recent searches",
    content: (
      <>
        <p>
          ToolNext uses browser storage to preserve convenience settings. The
          current app may store the following on the device and browser profile
          you are using:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Tool input or settings for the four homepage quick tools: Word
            Counter, Percentage Calculator, Unit Converter, and Color Picker.
          </li>
          <li>
            Up to five recent tool-directory searches, so they can be shown
            again in the browser.
          </li>
          <li>
            Browser-managed site resources used to display the application and
            support its offline fallback.
          </li>
        </ul>
        <p>
          This data is stored locally by your browser, not in a ToolNext
          account. Use a tool’s Clear or Reset control where available, or clear
          site data for this website in your browser settings to remove local
          storage. Clearing site data may also remove the service worker’s cache
          and reset other site preferences.
        </p>
        <p>
          Browser storage can be disabled, restricted, or removed by browser
          settings, private browsing modes, extensions, or device policies. When
          storage is unavailable, saved values may not persist between visits.
        </p>
      </>
    ),
  },
  {
    id: "offline-cache",
    title: "4. Offline cache and service worker",
    content: (
      <>
        <p>
          The site can register a service worker in production. It uses
          network-first behavior for GET requests and may place successful
          responses in browser Cache Storage so the app can reuse cached content
          if a later request cannot reach the network. If a navigation cannot
          load and has no cached response, the service worker may show a
          dedicated offline page instead of substituting the homepage. The
          browser manages this cache on your device; its contents and lifetime
          can depend on browser behavior and site updates.
        </p>
        <p>
          You can remove this cache by clearing the website’s stored data in
          your browser settings. You can also use browser controls to unregister
          the site’s service worker. Clearing cached data does not delete
          information held in infrastructure logs by a hosting provider.
        </p>
      </>
    ),
  },
  {
    id: "request-data",
    title: "5. Website requests and infrastructure",
    content: (
      <>
        <p>
          Loading any website involves network requests. The operator’s hosting,
          content-delivery, DNS, security, or similar infrastructure providers
          may receive routine technical information, such as an IP address,
          user-agent or device/browser details, requested URL, referring page,
          and the time and status of a request. Providers may process this
          information to deliver, protect, troubleshoot, and operate the
          service.
        </p>
        <p>
          The exact information, retention period, and locations depend on the
          providers and deployment settings chosen by the site operator.
          ToolNext does not control every infrastructure log. Consult the
          relevant provider’s privacy documentation for its handling of this
          information. The actual provider, data-processing locations, and
          retention settings should be confirmed and named by the operator for
          each production deployment.
        </p>
      </>
    ),
  },
  {
    id: "cookies-analytics",
    title: "6. Cookies, analytics, and advertising",
    content: (
      <>
        <p>
          The current application code does not implement a user account,
          first-party analytics script, or advertising pixel. It uses browser
          local storage and Cache Storage as described above; those mechanisms
          are not cookies, though they also store information on your device.
        </p>
        <p>
          Hosting or other infrastructure providers may use their own
          technologies for essential delivery, security, or measurement
          depending on the deployment configuration. Browser extensions and
          other services you use may also observe website activity. The operator
          must check the production deployment and provider settings for
          analytics, advertising, cookies, or similar tracking; update this
          policy and provide any required choices before enabling those
          services.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "7. How information may be shared",
    content: (
      <>
        <p>
          Tool inputs and recent searches saved in local storage are not
          provided to ToolNext by that storage mechanism. Routine request
          information may be processed by the infrastructure providers described
          above.
        </p>
        <p>
          The operator may disclose information if required by applicable law or
          valid legal process, or when reasonably necessary to protect the
          service, its users, or others from fraud, abuse, or security
          incidents. This policy does not claim that every hosting or network
          provider has the same practices.
        </p>
        <p>
          No sale of personal information is part of the current application
          experience. If the service begins using additional processors or
          sharing information for a new purpose, this policy should be updated
          to identify that change.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "8. Retention and deletion",
    content: (
      <>
        <p>
          Local tool values and recent searches remain in your browser until you
          reset them, clear the site’s storage, or the browser removes them.
          Cached site content is managed by the browser and the service worker;
          a deployment update may replace an older application cache.
        </p>
        <p>
          Infrastructure providers determine how long they keep operational logs
          under their own policies and the site operator’s account settings.
          ToolNext cannot delete provider-held logs by resetting a calculator or
          clearing local browser storage.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "9. Security and your choices",
    content: (
      <>
        <p>
          We aim to keep the application straightforward and minimize the data
          it needs, but no website, browser, network, or storage method can be
          guaranteed completely secure. Use an up-to-date browser and device,
          protect your browser profile, and avoid using shared devices for
          sensitive work.
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Use each tool’s Clear or Reset action to remove its saved input.
          </li>
          <li>
            Clear site data in your browser to remove local storage and cached
            resources.
          </li>
          <li>
            Use private browsing or disable browser storage if you do not want
            convenience values retained.
          </li>
          <li>
            Do not enter secrets, personal records, or information you are not
            authorized to process.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "children",
    title: "10. Children",
    content: (
      <p>
        ToolNext is a general-purpose utility website and is not designed to
        collect information from children. The operator does not intentionally
        ask children to provide personal information through the current
        application. If you believe a child has sent personal information to the
        operator, use the contact details below so the situation can be
        reviewed.
      </p>
    ),
  },
  {
    id: "changes",
    title: "11. Changes to this policy",
    content: (
      <p>
        We may revise this policy when the product, its providers, or applicable
        requirements change. The “Last updated” date at the top indicates the
        latest editorial revision. Material changes should be reflected on this
        page before or when the changed practices begin.
      </p>
    ),
  },
  {
    id: "contact",
    title: "12. Privacy questions and requests",
    content: contactEmail ? (
      <p>
        For a privacy question or request, contact the site operator at{" "}
        <a
          href={`mailto:${contactEmail}`}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          {contactEmail}
        </a>
        . Avoid including sensitive information in an email unless it is
        necessary for the request.
      </p>
    ) : (
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
        <Info
          className="mt-1 size-4 shrink-0 text-amber-700 dark:text-amber-300"
          aria-hidden="true"
        />
        <p>
          A direct privacy contact address has not been configured for this
          deployment. The site operator should publish a monitored contact
          address before launch. Do not send sensitive information through an
          unrelated channel.
        </p>
      </div>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <MarketingPageFrame
      eyebrow="Privacy & data"
      title="Privacy Policy"
      description="A practical explanation of what the current tools do in your browser, what the website may store locally, and what information can be involved in delivering the site."
      icon={LockKeyhole}
      updatedAt="November 9, 2026"
    >
      <PolicySections sections={sections} />
      <p className="mt-6 text-xs leading-relaxed text-outline">
        This page describes the application as currently implemented and is
        general information, not legal advice. The site operator should review
        it against the actual hosting, analytics, and legal requirements for
        each deployment.
      </p>
    </MarketingPageFrame>
  );
}
