"use client";

import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";

export interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  as?: "span" | "p" | "h1" | "h2";
}

export function TruncatedText({
  text,
  maxLength = 48,
  className,
  as: Tag = "span",
}: TruncatedTextProps) {
  const needsTruncate = text.length > maxLength;
  const display = needsTruncate ? `${text.slice(0, maxLength - 1)}…` : text;

  const content = (
    <Tag className={cn("truncate", className)} title={needsTruncate ? text : undefined}>
      {display}
    </Tag>
  );

  if (!needsTruncate) return content;

  return (
    <Tooltip content={text} position="bottom">
      {content}
    </Tooltip>
  );
}
