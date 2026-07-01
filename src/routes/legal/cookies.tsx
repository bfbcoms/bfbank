import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/marketing/LegalDocument";

export const Route = createFileRoute("/legal/cookies")({
  head: () => ({
    meta: [
      { title: "Cookies notice — Bright Future Bank" },
      {
        name: "description",
        content:
          "How Bright Future Bank uses cookies and similar technologies on our website and web platform, and how you can manage your preferences.",
      },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title="Cookies notice"
      updated="1 July 2026"
      intro="This Cookies Notice describes the cookies and similar technologies that Bright Future Financial Ltd uses on brightfuture.bank and the Bright Future web platform, and how you can manage your preferences."
      sections={[
        {
          title: "What cookies are",
          paragraphs: [
            "Cookies are small text files placed on your device when you visit a website. They allow the website to remember your actions and preferences over a period of time, so you don't have to re-enter them each time you return.",
          ],
        },
        {
          title: "Categories of cookies we use",
          paragraphs: [
            "Strictly necessary cookies are required for the operation of our website, including authenticated sessions, load balancing and fraud prevention. These cookies cannot be switched off in our systems.",
            "Analytics cookies help us understand how visitors interact with the website by collecting information in aggregate. This data allows us to measure the effectiveness of our content and improve the user experience.",
            "Preference cookies remember choices you make (such as language or region) to provide a more personalised experience.",
          ],
        },
        {
          title: "Third parties",
          paragraphs: [
            "We use a limited set of trusted third-party providers, including a privacy-respecting product-analytics platform and our authentication infrastructure provider. Each is bound by data-processing agreements aligned with our Privacy Notice.",
          ],
        },
        {
          title: "Managing your preferences",
          paragraphs: [
            "You can accept or reject non-essential cookies via the cookie banner shown on your first visit, and change your choices at any time from the 'Cookie preferences' link in the website footer.",
            "You can also manage cookies directly through your browser settings. Please note that disabling strictly-necessary cookies may prevent parts of the website from functioning correctly.",
          ],
        },
      ]}
    />
  );
}
