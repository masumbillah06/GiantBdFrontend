"use client";

import React from "react";
import { Download } from "lucide-react";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { useTableContext } from "./table-context";

export interface TableToolbarExportProps {
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
  filename?: string;
}

export function TableToolbarExport({
  onClick: propOnClick,
  disabled: propDisabled,
  label = "Download/Export CSV",
  filename,
}: TableToolbarExportProps) {
  const context = useTableContext();

  const activeDisabled =
    propDisabled ?? context?.isLoading ?? false;

  const handleClick = () => {
    if (propOnClick) {
      propOnClick();
      return;
    }
    if (context?.exportData) {
      context.exportData(filename);
    }
  };

  return (
    <ActionButton
      label={label}
      icon={Download}
      disabled={activeDisabled}
      onClick={handleClick}
    />
  );
}

export default TableToolbarExport;