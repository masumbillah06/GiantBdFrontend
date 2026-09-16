"use client";

import React from "react";
import { Download } from "lucide-react";

import { ActionButton } from "@/components/ui/buttons/action-button";

export interface TableToolbarExportProps {
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
}

export function TableToolbarExport({
  onClick,
  disabled = false,
  label = "Download/Export",
}: TableToolbarExportProps) {
  return (
    <ActionButton
      label={label}
      icon={Download}
      disabled={disabled}
      onClick={onClick}
    />
  );
}

export default TableToolbarExport;