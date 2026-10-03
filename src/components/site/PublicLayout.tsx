import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { WhatsAppButton } from "./WhatsAppButton"
import { ScrollProgress } from "./ScrollProgress"

interface PublicLayoutProps {
  settings?: Record<string, any>
  children: React.ReactNode
}

/**
 * Wraps every public page: sticky navbar on top, main content with flex-1,
 * footer pushed to bottom via mt-auto (works because body has min-h-screen flex flex-col).
 */
export function PublicLayout({ settings = {}, children }: PublicLayoutProps) {
  return (
    <>
      <ScrollProgress />
      <Navbar settings={settings} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton href={settings.social_whatsapp ?? "https://wa.me/919419000123"} />
    </>
  )
}
