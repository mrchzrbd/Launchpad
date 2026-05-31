import Link from "next/link";

const footerLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Get Started", href: "/onboarding" },
  { label: "Tool Coach", href: "/tool-coach" },
  { label: "Workspace", href: "/workspace" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-accent"
                aria-hidden="true"
              />
              <span className="font-display text-lg text-text-primary group-hover:text-accent transition-colors duration-200">
                Launchpad
              </span>
            </Link>
            <p className="text-sm text-text-secondary font-body leading-relaxed">
              The Digital Collaboration Launchpad — GRPI-powered team setup for
              European business schools.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-body text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-text-muted font-body">
            © {new Date().getFullYear()} The Digital Collaboration Launchpad. All
            rights reserved.
          </p>
          <p className="text-xs text-text-muted font-mono">
            GRPI Framework · Goals · Roles · Processes · Norms
          </p>
        </div>
      </div>
    </footer>
  );
}
