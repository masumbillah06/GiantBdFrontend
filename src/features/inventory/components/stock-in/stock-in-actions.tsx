"use client";

import React from "react";
import { FormActionBar, type FormActionBarProps } from "@/components/ui/form-action-bar";
import { useOptionalStockIn } from "./stock-in-context";

export type StockInActionsProps = FormActionBarProps;

export function StockInActions(props: StockInActionsProps) {
  const ctx = useOptionalStockIn();

  return (
    <FormActionBar
      submitLabel="Create"
      loadingLabel="Creating..."
      onReset={props.onReset ?? ctx?.resetForm}
      onPreview={props.onPreview ?? ctx?.handlePreview}
      onCreate={props.onCreate ?? props.onSubmit ?? ctx?.handleCreate}
      isLoading={props.isLoading ?? ctx?.isLoading}
      {...props}
    />
  );
}

export default StockInActions;
