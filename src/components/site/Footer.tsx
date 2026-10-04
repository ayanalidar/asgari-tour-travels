import Link from "next/link"
import {
  Mountain,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Send,
  Clock,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NewsletterForm } from "./NewsletterForm"

interface FooterProps {
  settings?: Record<string, any>
}

export function Footer({ settings = {} }: FooterProps) {
  const brand = settings.brand_name ?? "Asgari Tour & Travels"
  const tagline = settings.brand_tagline ?? "Discover Paradise - Kashmir & Ladakh Specialists"
  const phone = settings.phone_primary ?? "+91 94190 00123"
  const email = settings.email_primary ?? "info@asgaritravels.com"
  const address = settings.address ?? "Boulevard Road, Dal Lake, Srinagar, J&K 190001"
  const hours = settings.office_hours ?? "Mon-Sun: 8:00 AM - 8:00 PM IST"
  const facebook = settings.social_facebook
  const instagram = settings.social_instagram
  const youtube = settings.social_youtube
  const whatsapp = settings.social_whatsapp ?? "https://wa.me/919419000123"

  return (
    <footer className="mt-auto relative border-t border-border/60 bg-background/80">
      {/* Glow line */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <span className="relative grid size-10 place-items-center rounded-xl bg-gradient-to-br from-primary/90 to-amber-600/80 shadow-[0_0_24px_var(--saffron-glow)]">
                <Mountain className="size-5 text-primary-foreground" strokeWidth={2.5} />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg font-extrabold tracking-tight">
                  Asgari
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-primary">
                  Tour & Travels
                </span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {tagline}. Curated luxury journeys across the Himalayas, crafted with 15+
              years of local expertise.
            </p>
            <div className="flex items-center gap-2">
              {facebook && (
                <SocialLink href={facebook} label="Facebook">
                  <Facebook className="size-4" />
                </SocialLink>
              )}
              {instagram && (
                <SocialLink href={instagram} label="Instagram">
                  <Instagram className="size-4" />
                </SocialLink>
              )}
              {youtube && (
                <SocialLink href={youtube} label="YouTube">
                  <Youtube className="size-4" />
                </SocialLink>
              )}
              <SocialLink href={whatsapp} label="WhatsApp">
                <MessageCircle className="size-4" />
              </SocialLink>
            </div>
          </div>

          {/* Quick Links */}
          <FooterCol title="Explore">
            <FooterLink href="/destinations">Destinations</FooterLink>
            <FooterLink href="/packages">Tour Packages</FooterLink>
            <FooterLink href="/ladakh">Ladakh</FooterLink>
            <FooterLink href="/things-to-do">Things To Do</FooterLink>
            <FooterLink href="/blog">Travel Blog</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
          </FooterCol>

          {/* Popular */}
          <FooterCol title="Popular Tours">
            <FooterLink href="/packages/kashmir-paradise-delight-5n6d">
              Kashmir Paradise 5N/6D
            </FooterLink>
            <FooterLink href="/packages/ladakh-adventure-expedition-7n8d">
              Ladakh Expedition 7N/8D
            </FooterLink>
            <FooterLink href="/packages/kashmir-honeymoon-escape-4n5d">
              Honeymoon Escape 4N/5D
            </FooterLink>
            <FooterLink href="/packages/gulmarg-ski-snowboard-week-6n7d">
              Gulmarg Ski Week 6N/7D
            </FooterLink>
            <FooterLink href="/destinations/srinagar">Srinagar</FooterLink>
            <FooterLink href="/destinations/pangong-tso">Pangong Lake</FooterLink>
          </FooterCol>

          {/* Contact + Newsletter */}
          <FooterCol title="Get in Touch">
            <li className="flex items-start gap-3 text-sm">
              <MapPin className="size-4 mt-0.5 shrink-0 text-primary" />
              <span className="text-muted-foreground">{address}</span>
            </li>
            <li>
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
              >
                <Phone className="size-4 shrink-0 text-primary" />
                <span>{phone}</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
              >
                <Mail className="size-4 shrink-0 text-primary" />
                <span className="break-all">{email}</span>
              </a>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <Clock className="size-4 mt-0.5 shrink-0 text-primary" />
              <span className="text-muted-foreground">{hours}</span>
            </li>
          </FooterCol>
        </div>

        {/* Newsletter */}
        <div className="mt-12 grid gap-6 rounded-2xl glass p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <h3 className="font-display text-xl font-bold mb-1">
              Get travel deals & inspiration
            </h3>
            <p className="text-sm text-muted-foreground">
              Join 15,000+ travellers - exclusive Kashmir & Ladakh offers, monthly.
            </p>
          </div>
          <NewsletterForm />
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-border/50 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand}. All rights reserved. Crafted with love in
            Srinagar.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/about" className="hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
            <Link href="/faq" className="hover:text-primary">
              FAQ
            </Link>
            <span className="text-foreground/40">·</span>
            <span>IATA · TAAI · ADTOI Certified</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-foreground mb-4">
        {title}
      </h4>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        {children}
      </Link>
    </li>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-9 place-items-center rounded-lg border border-border/60 bg-background/40 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
    >
      {children}
    </a>
  )
}
