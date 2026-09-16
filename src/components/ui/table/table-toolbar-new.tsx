"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTableContext } from "./table-context";

export interface TableToolbarNewProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  href?: string;
}

export function TableToolbarNew({
  onClick: propOnClick,
  label: propLabel,
  disabled: propDisabled,
  className,
  href: propHref,
}: TableToolbarNewProps) {
  const context = useTableContext();

  const activeLabel =
    propLabel ??
    (context?.newButtonLabel
      ? context.newButtonLabel
      : context?.entityName
      ? `New ${context.entityName}`
      : "New");

  const activeOnClick = propOnClick ?? context?.onNew;
  const activeHref = propHref ?? context?.newHref;
  const activeDisabled =
    propDisabled ?? context?.isLoading ?? false;

  const baseButtonClasses = cn(
    `
      flex
      cursor-pointer
      items-center
      gap-1.5
      rounded-lg
      bg-[#476ab8]
      px-3
      py-1.5
      text-xs
      font-semibold
      text-white
      shadow-xs
      transition-colors

      hover:bg-[#3b5998]

      disabled:cursor-not-allowed
      disabled:opacity-50
    `,
    className
  );

  if (activeHref && !activeDisabled) {
    return (
      <Link href={activeHref} className={baseButtonClasses}>
        <Plus size={14} />
        <span>{activeLabel}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={activeOnClick}
      disabled={activeDisabled}
      className={baseButtonClasses}
    >
      <Plus size={14} />
      <span>{activeLabel}</span>
    </button>
  );
}

export default TableToolbarNew;