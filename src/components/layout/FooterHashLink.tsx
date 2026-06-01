"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function FooterHashLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const hash = href.includes("#") ? href.split("#")[1] : null;

  const scrollToHash = () => {
    if (!hash) return;
    document.getElementById(hash)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!hash) return;
    if (pathname === "/" || href.startsWith("/#")) {
      e.preventDefault();
      scrollToHash();
      window.history.replaceState(null, "", `/#${hash}`);
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
