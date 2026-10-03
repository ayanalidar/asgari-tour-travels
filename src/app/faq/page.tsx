import type { Metadata } from "next"
import { getSettings } from "@/lib/settings"
import { PublicLayout } from "@/components/site/PublicLayout"
import { PageHeader } from "@/components/site/PageHeader"
import { Breadcrumbs } from "@/components/site/Breadcrumbs"
import { CTASection } from "@/components/site/CTASection"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Phone, MessageCircle, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export const revalidate = 600

export const metadata: Metadata = {
  title: "FAQ — Kashmir & Ladakh Travel Questions",
  description:
    "Frequently asked questions about Kashmir & Ladakh travel — best time, permits, safety, money, weather, altitude, what to pack, and more. Answered by Asgari Tour & Travels.",
  alternates: { canonical: "/faq" },
}

const FAQS = [
  {
    q: "When is the best time to visit Kashmir?",
    a: "April–May for tulips & spring bloom, June–August for family holidays and Gulmarg meadows, September–October for golden autumn colours and saffron harvest, and December–February for snow and Gulmarg skiing. Each season has its own magic — tell us what you love and we'll match you to the right month.",
  },
  {
    q: "When is the best time to visit Ladakh?",
    a: "Mid-May to mid-October is the only window when the high passes (Zoji La, Rohtang, Khardung La) are open. July–August is peak season. Forthcoming snow closes roads by late October; flights to Leh operate year-round but winter Ladakh is for serious adventurers only.",
  },
  {
    q: "Is Ladakh safe for solo / female travellers?",
    a: "Yes — Ladakh is one of the safest regions in India for solo and female travellers. Crime rates are extremely low, locals are respectful, and our team includes female travel designers who understand the specific concerns. We've guided many solo female travellers from across India and abroad.",
  },
  {
    q: "Do I need permits for Ladakh?",
    a: "Yes — an Inner Line Permit (ILP) is required for Indian nationals visiting Pangong, Nubra, Tso Moriri, Hanle and certain other areas. Foreign nationals need a Protected Area Permit (PAP). All Asgari Ladakh packages include permit arrangements — we handle the paperwork, you just need to carry 6+ passport photos and ID copies.",
  },
  {
    q: "What about altitude sickness in Ladakh?",
    a: "Leh sits at 3,500m, and acclimatization is critical. Day 1: rest, no exertion, hydrate. Day 2: light local sightseeing. Day 3+: head to higher areas like Khardung La or Pangong. Take Diamox (consult your doctor), drink 3-4L water daily, avoid alcohol for the first 48 hours. We include oxygen canisters in every Ladakh package.",
  },
  {
    q: "What is the Srinagar-Leh highway like?",
    a: "The 434-km Srinagar-Leh highway is one of India's most scenic road journeys — crossing Zoji La pass (3,528m), Drass (one of the coldest inhabited places), Kargil, Fotu La and Lamayuru. The road is paved for most of the route but single-lane and dramatic in places. We cross it in 2 days with an overnight in Kargil. Open May-September only.",
  },
  {
    q: "Are houseboat stays safe and clean?",
    a: "Absolutely. We work only with heritage houseboats on Dal and Nagin Lakes that meet our hygiene and comfort standards. Each houseboat has running hot water, proper plumbing, and a dedicated cook. Houseboats are moored securely and have shikara access. We've handpicked each one over 15+ years.",
  },
  {
    q: "What's the food like?",
    a: "Kashmiri cuisine is rich and meat-heavy (Wazwan feast — Rogan Josh, Gushtaba, Rista). Vegetarian options are widely available. Ladakhi food is simpler — thukpa (noodle soup), momos, skyu (pasta). All our hotels serve Indian, continental and local options. Tell us your dietary needs and we'll arrange accordingly.",
  },
  {
    q: "What is the cancellation policy?",
    a: "Free cancellation up to 15 days before departure (full refund minus payment gateway charges). 15-7 days before: 50% refund. Less than 7 days: no refund. Force majeure (weather, road closures, government advisories): full credit for future travel. We're flexible — talk to us.",
  },
  {
    q: "How do I pay? Are there EMI options?",
    a: "We accept UPI, bank transfer, credit/debit cards and international wire. A 25% advance confirms your booking; balance due 7 days before departure. EMI options available on credit cards for packages above ₹30,000 — ask our team.",
  },
  {
    q: "Can I customise a package?",
    a: "Yes! Every package on our site is a starting point — extend days, add destinations, upgrade hotels, include special experiences (candle-lit dinner, helicopter ride, private shikara). Our team will craft a custom itinerary within 24 hours of your enquiry. No extra charge for customisation.",
  },
  {
    q: "Is Kashmir safe to travel to right now?",
    a: "Tourist areas of Kashmir (Srinagar, Gulmarg, Pahalgam, Sonmarg) are safe and have been welcoming tourists normally. We monitor the situation daily and will not operate a tour if there's any security concern. Our team is local and informed in real-time. If anything changes, we'll reach out immediately.",
  },
  {
    q: "What should I pack?",
    a: "Layered clothing is key — even in summer, Gulmarg and Pangong evenings drop to 5°C. Essentials: warm fleece/jacket, rain shell (monsoon), sturdy walking shoes, sunglasses, sunscreen (UV is intense at altitude), personal medication, and original ID (for permits). For winter: sub-zero thermals, snow boots, gloves, balaclava. We send a detailed packing list with every booking.",
  },
  {
    q: "Do you arrange flights?",
    a: "We're IATA-certified and can book domestic (Srinagar, Leh, Jammu) and international flights at competitive rates. Flights are usually billed separately from the package. Let us know your departure city and we'll find the best fares.",
  },
  {
    q: "Can elderly travellers or those with mobility issues visit?",
    a: "Yes, with the right itinerary. Srinagar, Gulmarg (gondola accessible), Pahalgam, and Leh town itself are manageable. We pace itineraries slower, choose accessible hotels, and arrange wheelchair-friendly vehicles on request. High-altitude areas (Khardung La, Pangong) may not be suitable for severe cardiac/respiratory conditions — please consult your doctor.",
  },
]

export default async function FAQPage() {
  const settings = await getSettings()
  const phone = settings.phone_primary ?? "+91 94190 00123"
  const whatsapp = settings.social_whatsapp ?? "https://wa.me/919419000123"

  return (
    <PublicLayout settings={settings}>
      <PageHeader
        eyebrow="FAQ"
        title={
          <>
            Questions, <span className="gradient-text-saffron">answered</span>
          </>
        }
        subtitle="Everything you wanted to know about travelling to Kashmir & Ladakh — answered by our team of local experts. Still have questions? Just message us."
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "FAQ" },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* FAQ list */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl glass p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="size-5 text-primary" />
                <h2 className="font-display text-xl font-bold">
                  Most asked questions
                </h2>
              </div>
              <Accordion type="single" collapsible className="flex flex-col gap-2">
                {FAQS.map((f, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="rounded-xl border border-border/60 bg-background/30 px-4 data-[state=open]:bg-background/60"
                  >
                    <AccordionTrigger className="hover:no-underline text-left">
                      <span className="font-medium text-foreground">{f.q}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl glass-strong p-6">
              <h3 className="font-display text-lg font-bold mb-2">
                Still have questions?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our Himalayan experts are one message away. No bots, just real local
                knowledge.
              </p>
              <div className="flex flex-col gap-2">
                <Button asChild variant="outline">
                  <a href={`tel:${phone.replace(/\s+/g, "")}`}>
                    <Phone className="size-4" /> {phone}
                  </a>
                </Button>
                <Button asChild className="btn-glow">
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="size-4" /> WhatsApp us
                  </a>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl glass p-6">
              <h3 className="font-display text-base font-bold mb-2">Quick tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Acclimatize 2 days before Khardung La</li>
                <li>• Carry cash — limited ATMs in Ladakh</li>
                <li>• Inner Line Permits are mandatory for Pangong/Nubra</li>
                <li>• Best Ladakh window: May 15 - Oct 15</li>
                <li>• Book houseboats 60+ days in advance</li>
              </ul>
            </div>
          </aside>
        </div>

        <div className="mt-12">
          <CTASection phone={settings.phone_primary} />
        </div>
      </div>
    </PublicLayout>
  )
}
