import * as React from "react";
import { Tooltip } from "@base-ui/react/tooltip";
import { cx } from "./action-button";

interface ActionButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

export function ActionButtonGroup({
  children,
  className,
  "aria-label": ariaLabel = "Actions",
}: ActionButtonGroupProps) {
  return (
    <Tooltip.Provider delay={100} closeDelay={100}>
      <div
        role="group"
        aria-label={ariaLabel}
        className={cx("inline-flex items-center gap-1.5", className)}
      >
        {children}
      </div>
    </Tooltip.Provider>
  );
}
