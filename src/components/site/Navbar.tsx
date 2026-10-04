"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Menu,
  Phone,
  ChevronDown,
  MapPin,
  Mountain,
  Plane,
  Compass,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { GlobalSearch } from "./GlobalSearch"

interface NavLink {
  href: string
  label: string
  icon?: React.ReactNode
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/packages", label: "Packages" },
  { href: "/guide", label: "Guide" },
  { href: "/compare", label: "Compare" },
  { href: "/plan-your-trip", label: "Plan Trip" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navbar({ settings }: { settings?: Record<string, any> }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Mobile sheet auto-closes when a new route is pushed (via SheetClose wrappers on links)

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname?.startsWith(href)
  }

  const phone = settings?.phone_primary ?? "+91 94190 00123"
  const whatsapp = settings?.social_whatsapp ?? "https://wa.me/919419000123"

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-2" : "py-3 sm:py-4",
      )}
    >
      <div className="container mx-auto max-w-7xl px-3 sm:px-6">
        <nav
          aria-label="Primary"
          className={cn(
            "flex items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-all duration-500",
            scrolled
              ? "glass-strong shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
              : "border border-transparent",
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 shrink-0"
            aria-label="Asgari Tour & Travels home"
          >
            <span className="relative grid size-10 place-items-center rounded-xl bg-gradient-to-br from-primary/90 to-amber-600/80 shadow-[0_0_24px_var(--saffron-glow)] overflow-hidden transition-transform group-hover:scale-105">
              <img
                src="/uploads/asgari-logo.png"
                alt="Asgari Tour & Travels"
                className="h-full w-full object-cover rounded-xl"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-base font-extrabold tracking-tight text-foreground sm:text-lg">
                Asgari
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-primary">
                Tour & Travels
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <NavigationMenu className="hidden xl:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent data-[state=open]:bg-transparent">
                  Destinations
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[520px] gap-2 p-4 md:grid-cols-2">
                    <DestDropItem
                      href="/destinations?region=kashmir"
                      title="Kashmir"
                      desc="Srinagar, Gulmarg, Pahalgam, Sonmarg"
                      icon={<MapPin className="size-4 text-primary" />}
                    />
                    <DestDropItem
                      href="/destinations?region=ladakh"
                      title="Ladakh"
                      desc="Leh, Pangong, Nubra, Khardung La"
                      icon={<Mountain className="size-4 text-accent" />}
                    />
                    <DestDropItem
                      href="/destinations?region=jammu"
                      title="Jammu & Around"
                      desc="Vaishno Devi, Patnitop, Sanasar"
                      icon={<Compass className="size-4 text-rose-400" />}
                    />
                    <DestDropItem
                      href="/destinations"
                      title="All Destinations"
                      desc="Browse the complete catalogue"
                      icon={<Plane className="size-4 text-primary" />}
                    />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {NAV_LINKS.filter(
                (l) => !["Home", "Destinations"].includes(l.label),
              ).map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link href={link.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent",
                        isActive(link.href) && "text-primary",
                      )}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-2">
            <GlobalSearch />
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-foreground/80 hover:text-primary"
            >
              <a href={`tel:${phone.replace(/\s+/g, "")}`} aria-label={`Call ${phone}`}>
                <Phone className="size-4" />
                <span className="hidden xl:inline">{phone}</span>
              </a>
            </Button>
            <Button asChild size="sm" className="btn-glow">
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp us"
              >
                <Mail className="size-4" />
                Enquire Now
              </a>
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] glass-strong border-l border-primary/20 p-0"
            >
              <SheetTitle className="sr-only">Main navigation</SheetTitle>
              <div className="flex flex-col gap-1 p-6 pt-8">
                <Link
                  href="/"
                  className="mb-4 flex items-center gap-2"
                  aria-label="Asgari Tour & Travels"
                >
                  <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary/90 to-amber-600/80 overflow-hidden">
                    <img
                      src="/uploads/asgari-logo.png"
                      alt="Asgari Tour & Travels"
                      className="h-full w-full object-cover rounded-xl"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </span>
                  <span className="font-display font-extrabold">Asgari</span>
                </Link>
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary",
                        isActive(link.href) && "bg-primary/10 text-primary",
                      )}
                    >
                      {link.label}
                      {isActive(link.href) && (
                        <ChevronDown className="size-4 -rotate-90" />
                      )}
                    </Link>
                  </SheetClose>
                ))}
                <div className="mt-4 grid gap-2">
                  <Button asChild className="btn-glow">
                    <a href={`tel:${phone.replace(/\s+/g, "")}`}>
                      <Phone className="size-4" /> {phone}
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                      WhatsApp Us
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  )
}

function DestDropItem({
  href,
  title,
  desc,
  icon,
}: {
  href: string
  title: string
  desc: string
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl p-3 transition-all hover:bg-primary/10"
    >
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 ring-1 ring-primary/20 transition-colors group-hover:bg-primary/20">
        {icon}
      </span>
      <div className="flex flex-col">
        <span className="font-display text-sm font-bold text-foreground group-hover:text-primary">
          {title}
        </span>
        <span className="text-xs text-muted-foreground">{desc}</span>
      </div>
    </Link>
  )
}
