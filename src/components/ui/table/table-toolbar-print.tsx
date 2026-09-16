"use client";

import React from "react";
import { Printer } from "lucide-react";

import { ActionButton } from "@/components/ui/buttons/action-button";

export interface TableToolbarPrintProps {
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
}

export function TableToolbarPrint({
  onClick,
  disabled = false,
  label = "Print List",
}: TableToolbarPrintProps) {
  return (
    <ActionButton
      label={label}
      icon={Printer}
      disabled={disabled}
      onClick={onClick}
    />
  );
}

export default TableToolbarPrint;