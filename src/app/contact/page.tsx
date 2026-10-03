import type { Metadata } from "next"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
} from "lucide-react"
import { getSettings } from "@/lib/settings"
import { PublicLayout } from "@/components/site/PublicLayout"
import { PageHeader } from "@/components/site/PageHeader"
import { Breadcrumbs } from "@/components/site/Breadcrumbs"
import { EnquiryForm } from "@/components/site/EnquiryForm"
import { Button } from "@/components/ui/button"

export const revalidate = 600

export const metadata: Metadata = {
  title: "Contact Us — Asgari Tour & Travels",
  description:
    "Get in touch with Asgari Tour & Travels — call, email or WhatsApp us. Srinagar-based team, 24/7 support, customised itineraries within 24 hours.",
  alternates: { canonical: "/contact" },
}

export default async function ContactPage() {
  const settings = await getSettings()

  const phone = settings.phone_primary ?? "+91 94190 00123"
  const whatsapp = settings.social_whatsapp ?? "https://wa.me/919419000123"
  const email = settings.email_primary ?? "info@asgaritravels.com"
  const bookingsEmail = settings.email_bookings ?? email
  const address = settings.address ?? "Boulevard Road, Dal Lake, Srinagar, J&K"
  const hours = settings.office_hours ?? "Mon-Sun: 8 AM - 8 PM IST"

  const contactMethods = [
    {
      icon: <Phone className="size-5" />,
      label: "Call us",
      value: phone,
      href: `tel:${phone.replace(/\s+/g, "")}`,
      desc: "Speak directly to a travel expert",
      color: "text-primary",
    },
    {
      icon: <MessageCircle className="size-5" />,
      label: "WhatsApp",
      value: "Chat with us",
      href: whatsapp,
      desc: "Fastest response · 8am-10pm IST",
      color: "text-accent",
    },
    {
      icon: <Mail className="size-5" />,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      desc: "For detailed enquiries & itineraries",
      color: "text-rose-400",
    },
    {
      icon: <MapPin className="size-5" />,
      label: "Visit us",
      value: "Srinagar, Kashmir",
      href: "https://maps.google.com/?q=Boulevard+Road+Srinagar",
      desc: address,
      color: "text-primary",
    },
  ]

  return (
    <PublicLayout settings={settings}>
      <PageHeader
        eyebrow="Get in Touch"
        title={
          <>
            Let's plan your <span className="gradient-text-saffron">Himalayan escape</span>
          </>
        }
        subtitle="Reach out by phone, WhatsApp, email — or fill out the form below. Our Srinagar-based team replies within 24 hours, often much faster."
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Contact" },
          ]}
        />

        {/* Contact methods */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {contactMethods.map((m, i) => (
            <a
              key={i}
              href={m.href}
              target={m.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="lift group rounded-2xl glass p-5 flex flex-col gap-2"
            >
              <span
                className={`grid size-12 place-items-center rounded-xl bg-background/40 ring-1 ring-border ${m.color}`}
              >
                {m.icon}
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </p>
                <p className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {m.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-2xl glass-strong p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold mb-1">Send us an enquiry</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Tell us about your dream trip — we'll reply with a customised itinerary within
              24 hours.
            </p>
            <EnquiryForm />
          </div>

          {/* Map + hours */}
          <div className="flex flex-col gap-6">
            {/* Map placeholder */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl glass">
              <iframe
                title="Asgari Tour & Travels location on Google Maps"
                src="https://www.google.com/maps?q=Boulevard+Road+Srinagar+Kashmir&output=embed"
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Office hours */}
            <div className="rounded-2xl glass p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="size-5 text-primary" />
                <h3 className="font-display text-lg font-bold">Office hours</h3>
              </div>
              <p className="text-sm text-muted-foreground">{hours}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                WhatsApp support is available 8 AM - 10 PM IST daily.
              </p>
            </div>

            {/* WhatsApp CTA */}
            <div className="rounded-2xl glass-strong p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="size-5 text-accent" />
                <h3 className="font-display text-lg font-bold">Prefer to chat?</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                WhatsApp our team for instant replies. We're real humans, not bots.
              </p>
              <Button asChild className="btn-glow">
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  <Send className="size-4" /> Start WhatsApp chat
                </a>
              </Button>
            </div>

            {/* Address */}
            <div className="rounded-2xl glass p-6">
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-display text-base font-bold mb-1">Our office</h3>
                  <p className="text-sm text-muted-foreground">{address}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Bookings: <a href={`mailto:${bookingsEmail}`} className="text-primary hover:underline">{bookingsEmail}</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
