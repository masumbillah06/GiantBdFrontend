"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { useTableContext } from "./table-context";

export interface TableToolbarReloadProps {
  onClick?: () => unknown;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
}

export function TableToolbarReload({
  onClick: propOnClick,
  isLoading: propIsLoading,
  disabled: propDisabled,
  label,
}: TableToolbarReloadProps) {
  const context = useTableContext();

  const isControlledLoading = propIsLoading !== undefined;
  const activeLoading = isControlledLoading
    ? propIsLoading
    : Boolean(context?.isReloading) || Boolean(context?.isLoading);

  const activeDisabled =
    propDisabled ?? (activeLoading || (context?.isLoading ?? false));

  const activeOnClick = propOnClick ?? context?.reload;

  const activeLabel =
    label ?? (activeLoading ? "Reloading..." : "Reload Data");

  const handleClick = () => {
    if (activeOnClick) {
      void activeOnClick();
    }
  };

  return (
    <ActionButton
      label={activeLabel}
      icon={RotateCcw}
      disabled={activeDisabled}
      iconClassName={activeLoading ? "animate-spin" : ""}
      onClick={handleClick}
    />
  );
}

export default TableToolbarReload;