import { destinationImage, gradientForSlug, initialForName } from "@/lib/image-map"
import { ImageWithFallback } from "./ImageWithFallback"
import { cn } from "@/lib/utils"

interface DestinationImageProps {
  slug: string
  name: string
  alt?: string
  className?: string
  eager?: boolean
}

/**
 * Maps destination slug to generated image, else shows gradient with destination initial.
 */
export function DestinationImage({
  slug,
  name,
  alt,
  className,
  eager = false,
}: DestinationImageProps) {
  const src = destinationImage(slug)
  const gradient = gradientForSlug(slug)
  const initial = initialForName(name)
  return (
    <ImageWithFallback
      src={src}
      alt={alt ?? name}
      className={cn("h-full w-full object-cover", className)}
      gradientClass={gradient}
      fallbackLabel={name}
      fallbackIcon={
        <span className="font-display text-5xl font-bold text-foreground/90 drop-shadow-[0_0_24px_var(--saffron-glow)]">
          {initial}
        </span>
      }
      eager={eager}
    />
  )
}
