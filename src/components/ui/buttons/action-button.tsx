"use client";

import * as React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Tooltip } from "@base-ui/react/tooltip";

export function cx(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export type ActionButtonVariant = "default" | "danger" | "ghost";

interface BaseActionButtonProps {
  /** Accessible label, also used as the tooltip text. */
  label: string;
  /** Any Lucide icon component, e.g. `Eye`, `Trash2`. */
  icon: LucideIcon;
  /** Visual style. Defaults to the neutral slate treatment. */
  variant?: ActionButtonVariant;
  /** Disables the button/link and greys it out. */
  disabled?: boolean;
  /** Extra classes merged onto the root element. */
  className?: string;
  /** Which side the tooltip is anchored to. Defaults to "top". */
  tooltipSide?: "top" | "bottom" | "left" | "right";
}

interface LinkActionButtonProps extends BaseActionButtonProps {
  /** Navigates here on click/Enter. Mutually exclusive with `onClick`. */
  href: string;
  onClick?: never;
}

interface ButtonActionButtonProps extends BaseActionButtonProps {
  href?: undefined;
  /** Runs on click/Enter. Mutually exclusive with `href`. */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export type ActionButtonProps = LinkActionButtonProps | ButtonActionButtonProps;

const variantStyles: Record<ActionButtonVariant, string> = {
  default:
    "bg-slate-100 text-slate-800 hover:bg-slate-200 focus-visible:ring-slate-400",
  danger:
    "bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-400",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400",
};

export function ActionButton(props: ActionButtonProps) {
  const {
    label,
    icon: Icon,
    variant = "default",
    disabled = false,
    className,
    tooltipSide = "top",
  } = props;

  const rootClassName = cx(
    // layout
    "relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
    // surface
    "shadow-sm ring-1 ring-black/5",
    // motion
    "transition-all duration-150 ease-out hover:-translate-y-0.5",
    // interaction states
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
    "active:scale-95",
    // disabled
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
    variantStyles[variant],
    className
  );

  const icon = <Icon aria-hidden="true" focusable="false" className="h-4 w-4" strokeWidth={2} />;

  // Disabled link
  if ("href" in props && typeof props.href === "string" && disabled) {
    return (
      <span
        aria-disabled="true"
        className={cx(rootClassName, "pointer-events-none opacity-40 shadow-none")}
      >
        {icon}
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  const trigger =
    "href" in props && typeof props.href === "string" ? (
      <Tooltip.Trigger
        render={<Link href={props.href} />}
        aria-label={label}
        className={rootClassName}
        delay={100}
      >
        {icon}
      </Tooltip.Trigger>
    ) : (
      <Tooltip.Trigger
        type="button"
        onClick={props.onClick}
        disabled={disabled}
        aria-label={label}
        className={rootClassName}
        delay={100}
      >
        {icon}
      </Tooltip.Trigger>
    );

  return (
    <Tooltip.Root>
      {trigger}
      <Tooltip.Portal>
        <Tooltip.Positioner side={tooltipSide} sideOffset={6} className="z-50">
          <Tooltip.Popup className="z-50 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium leading-none text-slate-50 shadow-lg shadow-black/15 transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0">
            {label}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
