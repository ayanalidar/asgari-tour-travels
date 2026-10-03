import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

interface MarkdownProps {
  content: string
  className?: string
}

/**
 * Server-renderable markdown renderer with custom styling.
 * Uses Tailwind typography utilities manually since we don't have @tailwindcss/typography.
 */
export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div
      className={cn(
        "prose-custom max-w-none",
        className,
      )}
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="font-display text-3xl font-bold mt-8 mb-4 text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-display text-2xl font-bold mt-6 mb-3 text-foreground border-l-4 border-primary pl-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-display text-xl font-semibold mt-5 mb-2 text-foreground">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-display text-lg font-semibold mt-4 mb-2 text-foreground">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-base leading-relaxed text-muted-foreground mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-none space-y-2 mb-4 text-muted-foreground">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 mb-4 pl-6 text-muted-foreground marker:text-primary marker:font-bold">
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => {
            // Detect if parent is ordered list
            const isOrdered = (props as any).node?.position?.start
            return (
              <li
                className={
                  isOrdered
                    ? "pl-1"
                    : "relative pl-5 before:content-[''] before:absolute before:left-0 before:top-2.5 before:size-1.5 before:rounded-full before:bg-primary"
                }
              >
                {children}
              </li>
            )
          },
          a: ({ children, href }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/40 bg-primary/5 px-4 py-2 italic text-muted-foreground my-4 rounded-r-lg">
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr className="my-6 border-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          ),
          code: ({ children, className: cls }) => {
            const isBlock = cls?.includes("language-")
            return isBlock ? (
              <pre className="bg-background/60 border border-border rounded-lg p-4 overflow-x-auto my-4">
                <code className="text-sm font-mono text-foreground">{children}</code>
              </pre>
            ) : (
              <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            )
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-background/60 px-3 py-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-2 text-muted-foreground">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
