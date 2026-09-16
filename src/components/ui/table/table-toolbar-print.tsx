"use client";

import React from "react";
import { Printer } from "lucide-react";
import { ActionButton } from "@/components/ui/buttons/action-button";
import { useTableContext } from "./table-context";

export interface TableToolbarPrintProps {
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
}

export function TableToolbarPrint({
  onClick: propOnClick,
  disabled: propDisabled,
  label = "Print List",
}: TableToolbarPrintProps) {
  const context = useTableContext();

  const activeDisabled =
    propDisabled ?? context?.isLoading ?? false;

  const handleClick = () => {
    if (propOnClick) {
      propOnClick();
      return;
    }
    if (context?.printTable) {
      context.printTable();
    } else {
      window.print();
    }
  };

  return (
    <ActionButton
      label={label}
      icon={Printer}
      disabled={activeDisabled}
      onClick={handleClick}
    />
  );
}

export default TableToolbarPrint;