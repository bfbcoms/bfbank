import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/marketing/LegalDocument";
import { makeRouteMeta } from "@/lib/route-meta";

export const Route = createFileRoute("/legal/cardholder-agreement")({
  head: () =>
    makeRouteMeta({
      title: "Cardholder agreement — Bright Future Bank",
      description: "The cardholder agreement governing Bright Future Bank physical and virtual debit cards issued to eligible account holders.",
      path: "/legal/cardholder-agreement",
    }),
  component: CardholderPage,
});

function CardholderPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title="Cardholder agreement"
      updated="1 July 2026"
      intro="This Cardholder Agreement (the 'Agreement') governs your use of physical and virtual payment cards ('Cards') issued to you by our card programme partner in connection with your Bright Future Bank account. It should be read together with our Terms of Service and Privacy Notice."
      sections={[
        {
          title: "Issuer and card scheme",
          paragraphs: [
            "Cards are issued by our card programme partner pursuant to a licence from Visa Inc. or Mastercard International, as indicated on the Card itself. Bright Future Financial Ltd operates the associated account and customer experience.",
          ],
        },
        {
          title: "Activation and use",
          paragraphs: [
            "You must activate a physical Card before first use by following the instructions in the Bright Future app. Virtual Cards are activated automatically upon issuance.",
            "Cards may be used to make purchases at merchants that accept the applicable scheme, to withdraw cash at ATMs and to authenticate online payments via 3-D Secure.",
          ],
        },
        {
          title: "Limits and restrictions",
          paragraphs: [
            "Default daily and monthly spending, ATM-withdrawal and per-transaction limits apply to each Card. Current limits are visible inside the Bright Future app and may be adjusted subject to eligibility and risk controls.",
            "Cards must not be used for any activity prohibited by our Acceptable Use Policy, applicable law or the rules of the card scheme.",
          ],
        },
        {
          title: "Lost, stolen or compromised Cards",
          paragraphs: [
            "You must freeze your Card immediately from within the app if you believe it has been lost, stolen or compromised. You may re-order a replacement in the same screen.",
            "Subject to applicable law, you will not be liable for unauthorised transactions that occur after you have notified us, provided that you have not acted fraudulently or with gross negligence.",
          ],
        },
        {
          title: "Fees",
          paragraphs: [
            "Card-related fees, including any ATM-withdrawal or FX-conversion fees, are set out in our published fee schedule and are always disclosed to you before you confirm a transaction.",
          ],
        },
        {
          title: "Termination",
          paragraphs: [
            "You may cancel a Card at any time from within the app. We may suspend or cancel a Card where required to comply with law, protect you from fraud, or where you breach this Agreement.",
          ],
        },
      ]}
    />
  );
}
