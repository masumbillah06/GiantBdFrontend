"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/breadcrumb";
import FormCard from "@/components/ui/form-card";
import FormInput from "@/components/ui/form-input";
import FormSelect from "@/components/ui/form-select";
import FormActionBar from "@/components/ui/form-action-bar";
import { useCreateColor } from "@/features/attributes/hooks/use-attributes";

export default function NewColorPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const createColorMutation = useCreateColor();

  const handleReset = () => {
    setName("");
    setCode("");
    setStatus("Active");
    setDescription("");
    setErrors({});
    setServerError(null);
  };

  const handleCancel = () => {
    router.push("/attribute/color");
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = "Color name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setServerError(null);

    createColorMutation.mutate(
      {
        name: name.trim(),
        code: code.trim() || undefined,
        description: description.trim() || undefined,
        status: status || "Active",
      },
      {
        onSuccess: () => {
          router.push("/attribute/color");
        },
        onError: (err: unknown) => {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to create color. Please try again.";
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
          { label: "Color", href: "/attribute/color" },
          { label: "New" },
        ]}
        className="rounded-2xl border border-slate-200/90 shadow-xs"
      />

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Color Information Card */}
      <FormCard title="Color Information">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              label="Color Name"
              required
              placeholder="Enter color name"
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
              label="Color Code / Hex"
              placeholder="#FFFFFF"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <FormSelect
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
            />
          </div>

          <div className="w-full">
            <FormInput
              label="Description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </FormCard>

      {/* Action Bar */}
      <FormActionBar
        onCancel={handleCancel}
        onReset={handleReset}
        onCreate={handleSubmit}
        isLoading={createColorMutation.isPending}
        loadingLabel="Creating..."
        submitLabel="Create"
        cancelLabel="Cancel"
        resetLabel="Reset"
      />
    </div>
  );
}

