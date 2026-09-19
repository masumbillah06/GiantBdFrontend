"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/breadcrumb";
import FormCard from "@/components/ui/form-card";
import FormInput from "@/components/ui/form-input";
import FormActionBar from "@/components/ui/form-action-bar";
import { useCreateMaterial } from "@/features/attributes/hooks/use-attributes";

export default function NewMaterialPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const createMaterialMutation = useCreateMaterial();

  const handleReset = () => {
    setName("");
    setDescription("");
    setErrors({});
    setServerError(null);
  };

  const handleCancel = () => {
    router.push("/attribute/material");
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = "Material name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setServerError(null);

    createMaterialMutation.mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        status: "Active",
      },
      {
        onSuccess: () => {
          router.push("/attribute/material");
        },
        onError: (err: unknown) => {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to create material. Please try again.";
          setServerError(message);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Breadcrumb Card */}
      <Breadcrumb
        title="Attributes"
        items={[
          { label: "Attributes", href: "/attribute/category" },
          { label: "Material", href: "/attribute/material" },
          { label: "New" },
        ]}
        className="rounded-2xl border border-slate-200/90 shadow-xs"
      />

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Material Information Card */}
      <FormCard title="Material Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Name"
            required
            placeholder="Enter material name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.name;
                  return next;
                });
              }
            }}
            error={errors.name}
          />

          <FormInput
            label="Description"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </FormCard>

      {/* Action Bar */}
      <FormActionBar
        onCancel={handleCancel}
        onReset={handleReset}
        onCreate={handleSubmit}
        isLoading={createMaterialMutation.isPending}
        loadingLabel="Creating..."
        submitLabel="Create"
        cancelLabel="Cancel"
        resetLabel="Reset"
      />
    </div>
  );
}

