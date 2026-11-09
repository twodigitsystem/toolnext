import { Categories } from "../components/landing-page/categories";
import { Cta } from "../components/landing-page/cta";
import { Faq } from "../components/landing-page/faq";
import { Hero } from "../components/landing-page/hero";
import { Playground } from "../components/landing-page/playground";
import { PrivacySection } from "../components/landing-page/privacy-section";
import { QuickTools } from "../components/landing-page/quick-tools";
import { SearchProvider } from "../components/landing-page/search-context";
import { ToolDirectory } from "../components/landing-page/tool-directory";
import { TrustStrip } from "../components/landing-page/trust-strip";

export default function Home() {
  return (
    <SearchProvider>
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-64px)] flex-1 scroll-smooth overflow-x-clip">
        <Hero />
        <QuickTools />
        <Categories />
        <ToolDirectory />
        <TrustStrip />
        <Playground />
        <PrivacySection />
        <Faq />
        <Cta />
      </main>
    </SearchProvider>
  );
}
