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
  useSubZones,
  useCreateRack,
} from "@/features/attributes/hooks/use-attributes";

export default function NewRackPage() {
  const router = useRouter();
  const [subZoneId, setSubZoneId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: subZones = [], isLoading: isSubZonesLoading } =
    useSubZones();
  const createRackMutation = useCreateRack();

  const subZoneOptions = useMemo(() => {
    return (subZones || []).map((sz) => ({
      label: `${sz.name} (${sz.code})`,
      value: String(sz.id),
    }));
  }, [subZones]);

  const handleReset = () => {
    setSubZoneId("");
    setName("");
    setCode("");
    setStatus("Active");
    setDescription("");
    setErrors({});
    setServerError(null);
  };

  const handleCancel = () => {
    router.push("/attribute/rack");
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!subZoneId) {
      newErrors.subZoneId = "Please select a sub zone";
    }
    if (!name.trim()) {
      newErrors.name = "Rack name is required";
    }
    if (!code.trim()) {
      newErrors.code = "Rack code is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setServerError(null);

    createRackMutation.mutate(
      {
        name: name.trim(),
        code: code.trim(),
        subZoneId,
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          router.push("/attribute/rack");
        },
        onError: (err: any) => {
          const resData = err?.response?.data;
          let message = "Failed to create rack. Please try again.";
          if (resData?.message) {
            message = Array.isArray(resData.message) ? resData.message.join(", ") : resData.message;
          } else if (err?.message) {
            message = err.message;
          }
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
          { label: "Rack", href: "/attribute/rack" },
          { label: "New" },
        ]}
        className="rounded-2xl border border-slate-200/90 shadow-xs"
      />

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Rack Information Card */}
      <FormCard title="Rack Information">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSearchableSelect
              label="Sub Zone"
              required
              placeholder="Search and select sub zone..."
              options={subZoneOptions}
              value={subZoneId}
              onChange={(val) => {
                setSubZoneId(val);
                if (errors.subZoneId) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.subZoneId;
                    return next;
                  });
                }
              }}
              isLoading={isSubZonesLoading}
              error={errors.subZoneId}
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
              label="Rack Name"
              required
              placeholder="Enter rack name"
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
              label="Rack Code"
              required
              placeholder="Enter rack code"
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
        isLoading={createRackMutation.isPending}
        loadingLabel="Creating..."
        submitLabel="Create"
        cancelLabel="Cancel"
        resetLabel="Reset"
      />
    </div>
  );
}

