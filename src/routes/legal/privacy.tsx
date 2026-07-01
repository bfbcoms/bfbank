import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/marketing/LegalDocument";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy notice — Bright Future Bank" },
      {
        name: "description",
        content:
          "How Bright Future Bank collects, uses and safeguards your personal information across our accounts, cards and transfer services.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title="Privacy notice"
      updated="1 July 2026"
      intro="This Privacy Notice explains how Bright Future Financial Ltd ('we', 'us') collects, uses, discloses and safeguards personal information in connection with the Bright Future Bank accounts, cards, mobile applications and related Services. We act as the data controller for the personal information described in this notice."
      sections={[
        {
          title: "Information we collect",
          paragraphs: [
            "We collect information that you provide directly to us when you apply for an account (such as your name, contact details, date of birth, government-issued identifiers and, where applicable, corporate ownership information), together with information generated through your use of the Services (such as transaction records, device identifiers and location metadata).",
            "We may also receive information from third parties, including credit-reference agencies, sanctions and politically-exposed-persons databases, and identity-verification providers, where necessary to meet our legal and regulatory obligations.",
          ],
        },
        {
          title: "How we use your information",
          paragraphs: [
            "We use your personal information to open and administer your account, execute payments and transfers you request, prevent and detect financial crime, and comply with applicable laws (including anti-money-laundering and counter-terrorism-financing rules).",
            "Where you have given us your consent, we may also use your information to send you product updates and marketing communications. You may withdraw this consent at any time from within the Bright Future app.",
          ],
        },
        {
          title: "Legal bases for processing",
          paragraphs: [
            "We rely on one or more of the following legal bases when processing your personal information: performance of a contract with you, compliance with a legal obligation, our legitimate interests (including preventing fraud and improving our Services), and your consent (where required).",
          ],
        },
        {
          title: "Sharing your information",
          paragraphs: [
            "We share personal information with our banking partners, card-scheme operators, correspondent institutions, cloud infrastructure providers and professional advisers, in each case only to the extent necessary for the delivery of the Services and subject to appropriate confidentiality obligations.",
            "We do not sell your personal information to third parties.",
          ],
        },
        {
          title: "International transfers",
          paragraphs: [
            "Some of our service providers are located outside your country of residence. Where personal information is transferred internationally, we rely on appropriate safeguards, including the UK International Data Transfer Agreement and, where relevant, the European Commission Standard Contractual Clauses.",
          ],
        },
        {
          title: "Data retention",
          paragraphs: [
            "We retain personal information for as long as your account is open and for a further six years thereafter, unless a longer period is required to meet a legal, regulatory or accounting obligation.",
          ],
        },
        {
          title: "Your rights",
          paragraphs: [
            "You have the right to access the personal information we hold about you, to request correction of inaccurate information, to request erasure in certain circumstances, and to object to or restrict certain processing activities. You may exercise these rights by contacting privacy@brightfuture.bank.",
            "You also have the right to lodge a complaint with your local data protection authority.",
          ],
        },
      ]}
    />
  );
}
