import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/marketing/LegalDocument";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms of service — Bright Future Bank" },
      {
        name: "description",
        content:
          "The terms of service that govern your use of Bright Future Bank accounts, cards and cross-border transfer services.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title="Terms of service"
      updated="1 July 2026"
      intro="These terms of service (the 'Terms') form a legally binding agreement between you and Bright Future Financial Ltd (referred to as 'Bright Future', 'we', 'us' or 'our') and govern your access to and use of the Bright Future Bank accounts, cards, mobile applications, web platform and related services (the 'Services')."
      sections={[
        {
          title: "Acceptance of these Terms",
          paragraphs: [
            "By opening a Bright Future account or otherwise using the Services, you confirm that you have read, understood and agreed to be bound by these Terms, together with our Privacy Notice, Cookies Notice and any product-specific terms referenced within.",
            "If you are entering into these Terms on behalf of a legal entity, you represent that you have the authority to bind that entity, and 'you' refers to both you personally and the entity.",
          ],
        },
        {
          title: "Eligibility and account opening",
          paragraphs: [
            "You must be at least 18 years of age and legally resident in a country in which Bright Future is authorised to offer Services. We may from time to time restrict certain Services in specific jurisdictions to comply with applicable law.",
            "We will ask you for information and documentation to verify your identity, source of funds and, where applicable, ownership structure. We may refuse to open an account, or close an existing account, where we are unable to complete these checks to our reasonable satisfaction.",
          ],
        },
        {
          title: "Your account and use of Services",
          paragraphs: [
            "You are responsible for maintaining the security of your login credentials, biometric authenticators and any device you use to access the Services. You must notify us without undue delay if you suspect that your account has been compromised.",
            "You agree not to use the Services for any purpose that is unlawful, fraudulent or in breach of our Acceptable Use Policy, which forms part of these Terms.",
          ],
        },
        {
          title: "Fees, exchange rates and charges",
          paragraphs: [
            "Our published fee schedule is available at brightfuture.bank/pricing. Where a fee applies to a specific Service, it will be disclosed to you before you confirm the transaction.",
            "Foreign-exchange conversions are executed at the prevailing mid-market rate, plus any applicable transfer fee. Rates are refreshed at least every 60 seconds during trading hours.",
          ],
        },
        {
          title: "Liability and limitations",
          paragraphs: [
            "We will provide the Services with reasonable care and skill. However, to the fullest extent permitted by law, our liability is limited to direct losses that are a reasonably foreseeable consequence of our breach of these Terms.",
            "Nothing in these Terms limits our liability for fraud, gross negligence, death or personal injury caused by our negligence, or any other liability which cannot be limited by applicable law.",
          ],
        },
        {
          title: "Changes to these Terms",
          paragraphs: [
            "We may amend these Terms from time to time. We will notify you at least 60 days in advance of any material change through the Bright Future app or by email. Your continued use of the Services after the effective date of any change constitutes acceptance of the updated Terms.",
          ],
        },
        {
          title: "Governing law and disputes",
          paragraphs: [
            "These Terms are governed by the laws of England and Wales. You and Bright Future submit to the exclusive jurisdiction of the courts of England and Wales, except that consumers may bring proceedings in the courts of their country of residence where required by mandatory law.",
          ],
        },
      ]}
    />
  );
}
