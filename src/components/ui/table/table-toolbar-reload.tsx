"use client";

import React from "react";
import { RotateCcw } from "lucide-react";

import { ActionButton } from "@/components/ui/buttons/action-button";

export interface TableToolbarReloadProps {
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function TableToolbarReload({
  onClick,
  isLoading = false,
  disabled = false,
}: TableToolbarReloadProps) {
  const isDisabled = disabled || isLoading;

  return (
    <ActionButton
      label={isLoading ? "Reloading..." : "Reload Data"}
      icon={RotateCcw}
      disabled={isDisabled}
      className={isLoading ? "animate-spin" : ""}
      onClick={onClick}
    />
  );
}

export default TableToolbarReload;