"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/breadcrumb";
import FormCard from "@/components/ui/form-card";
import FormInput from "@/components/ui/form-input";
import FormSelect from "@/components/ui/form-select";
import FormSearchableSelect from "@/components/ui/form-searchable-select";
import FormActionBar from "@/components/ui/form-action-bar";
import {
  useWarehouses,
  useCreateZone,
} from "@/features/attributes/hooks/use-attributes";
import { warehouseData } from "@/lib/mock-data/attributes/warehouse.mock";

export default function NewZonePage() {
  const router = useRouter();
  const [warehouseId, setWarehouseId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: warehouses = warehouseData, isLoading: isWarehousesLoading } =
    useWarehouses();
  const createZoneMutation = useCreateZone();

  const warehouseOptions = useMemo(() => {
    return (warehouses || []).map((w) => ({
      label: `${w.name} (${w.code})`,
      value: String(w.id),
    }));
  }, [warehouses]);

  const handleReset = () => {
    setWarehouseId("");
    setName("");
    setCode("");
    setStatus("Active");
    setDescription("");
    setErrors({});
    setServerError(null);
  };

  const handleCancel = () => {
    router.push("/attribute/zone");
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!warehouseId) {
      newErrors.warehouseId = "Please select a warehouse";
    }
    if (!name.trim()) {
      newErrors.name = "Zone name is required";
    }
    if (!code.trim()) {
      newErrors.code = "Zone code is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setServerError(null);

    createZoneMutation.mutate(
      {
        name: name.trim(),
        code: code.trim(),
        warehouseId,
        description: description.trim() || undefined,
        status: status || "Active",
      },
      {
        onSuccess: () => {
          router.push("/attribute/zone");
        },
        onError: (err: unknown) => {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to create zone. Please try again.";
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
          { label: "Zone", href: "/attribute/zone" },
          { label: "New" },
        ]}
        className="rounded-2xl border border-slate-200/90 shadow-xs"
      />

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Zone Information Card */}
      <FormCard title="Zone Information">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSearchableSelect
              label="Warehouse"
              required
              placeholder="Search and select warehouse..."
              options={warehouseOptions}
              value={warehouseId}
              onChange={(val) => {
                setWarehouseId(val);
                if (errors.warehouseId) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.warehouseId;
                    return next;
                  });
                }
              }}
              isLoading={isWarehousesLoading}
              error={errors.warehouseId}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Zone Name"
              required
              placeholder="Enter zone name"
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
              label="Zone Code"
              required
              placeholder="Enter zone code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (errors.code) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.code;
                    return next;
                  });
                }
              }}
              error={errors.code}
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
        isLoading={createZoneMutation.isPending}
        loadingLabel="Creating..."
        submitLabel="Create"
        cancelLabel="Cancel"
        resetLabel="Reset"
      />
    </div>
  );
}

