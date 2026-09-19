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
  useZones,
  useCreateSubZone,
} from "@/features/attributes/hooks/use-attributes";

export default function NewSubZonePage() {
  const router = useRouter();
  const [zoneId, setZoneId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: zones = [], isLoading: isZonesLoading } = useZones();
  const createSubZoneMutation = useCreateSubZone();

  const zoneOptions = useMemo(() => {
    return (zones || []).map((z) => ({
      label: `${z.name} (${z.code})`,
      value: String(z.id),
    }));
  }, [zones]);

  const handleReset = () => {
    setZoneId("");
    setName("");
    setCode("");
    setStatus("Active");
    setDescription("");
    setErrors({});
    setServerError(null);
  };

  const handleCancel = () => {
    router.push("/attribute/sub-zone");
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!zoneId) {
      newErrors.zoneId = "Please select a zone";
    }
    if (!name.trim()) {
      newErrors.name = "Sub zone name is required";
    }
    if (!code.trim()) {
      newErrors.code = "Sub zone code is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setServerError(null);

    createSubZoneMutation.mutate(
      {
        name: name.trim(),
        code: code.trim(),
        zoneId,
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          router.push("/attribute/sub-zone");
        },
        onError: (err: any) => {
          const resData = err?.response?.data;
          let message = "Failed to create sub zone. Please try again.";
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
          { label: "Sub Zone", href: "/attribute/sub-zone" },
          { label: "New" },
        ]}
        className="rounded-2xl border border-slate-200/90 shadow-xs"
      />

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Sub Zone Information Card */}
      <FormCard title="Sub Zone Information">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSearchableSelect
              label="Zone"
              required
              placeholder="Search and select zone..."
              options={zoneOptions}
              value={zoneId}
              onChange={(val) => {
                setZoneId(val);
                if (errors.zoneId) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.zoneId;
                    return next;
                  });
                }
              }}
              isLoading={isZonesLoading}
              error={errors.zoneId}
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
              label="Sub Zone Name"
              required
              placeholder="Enter sub zone name"
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
              label="Sub Zone Code"
              required
              placeholder="Enter sub zone code"
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
        isLoading={createSubZoneMutation.isPending}
        loadingLabel="Creating..."
        submitLabel="Create"
        cancelLabel="Cancel"
        resetLabel="Reset"
      />
    </div>
  );
}

