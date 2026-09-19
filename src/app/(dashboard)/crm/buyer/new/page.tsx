"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  FormCard,
  FormInput,
  FormTextarea,
  FormActionBar,
} from "@/components/ui";
import { useBuyerMutations } from "@/features/crm/hooks/use-buyers";
import { Building2, Globe, Mail, Phone, User, Hash, MapPin } from "lucide-react";

export default function NewBuyerPage() {
  const router = useRouter();
  const { createMut } = useBuyerMutations();

  const [formState, setFormState] = useState({
    name: "",
    code: "",
    email: "",
    phone: "",
    country: "",
    contactPerson: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitFeedback, setSubmitFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => {
      const next = { ...prev, [field]: value };

      // Auto-suggest code if code field hasn't been manually edited
      if (field === "name" && (!prev.code || prev.code === suggestCode(prev.name))) {
        next.code = suggestCode(value);
      }

      return next;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (submitFeedback) {
      setSubmitFeedback(null);
    }
  };

  // Helper to suggest uppercase code from name
  const suggestCode = (name: string) => {
    if (!name.trim()) return "";
    const clean = name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, "")
      .split(/\s+/)
      .map((w) => w.substring(0, 3))
      .join("-");
    return clean ? `${clean}-01` : "";
  };

  const handleReset = () => {
    setFormState({
      name: "",
      code: "",
      email: "",
      phone: "",
      country: "",
      contactPerson: "",
      address: "",
    });
    setErrors({});
    setSubmitFeedback(null);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formState.name.trim()) {
      newErrors.name = "Customer / Buyer Name is required";
    }

    if (!formState.code.trim()) {
      newErrors.code = "Customer Code is required";
    }

    if (formState.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await createMut.mutateAsync({
        name: formState.name.trim(),
        code: formState.code.trim().toUpperCase(),
        email: formState.email.trim() || undefined,
        phone: formState.phone.trim() || undefined,
        country: formState.country.trim() || undefined,
        contactPerson: formState.contactPerson.trim() || undefined,
        address: formState.address.trim() || undefined,
      });

      setSubmitFeedback({
        type: "success",
        message: `Customer "${formState.name.trim()}" created successfully! Redirecting...`,
      });

      setTimeout(() => {
        router.push("/crm/buyer");
      }, 1000);
    } catch (error: any) {
      const errMsg =
        (Array.isArray(error?.response?.data?.message)
          ? error.response.data.message.join(", ")
          : error?.response?.data?.message) ||
        error?.message ||
        "Failed to create customer. Please check your inputs.";

      setSubmitFeedback({
        type: "error",
        message: errMsg,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb Bar ── */}
      <Breadcrumb
        title="CRM"
        items={[
          { label: "CRM", href: "/crm/buyer" },
          { label: "Customer", href: "/crm/buyer" },
          { label: "New" },
        ]}
      />

      {/* ── Feedback Banner ── */}
      {submitFeedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium transition-all ${
            submitFeedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {submitFeedback.message}
        </div>
      )}

      {/* ── Customer / Buyer Information Card ── */}
      <FormCard title="Customer / Buyer Information">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Name */}
            <FormInput
              label="Customer / Buyer Name"
              required
              placeholder="e.g. H&M Hennes & Mauritz, Zara, Primark"
              value={formState.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
            />

            {/* Customer Code */}
            <FormInput
              label="Customer Code"
              required
              placeholder="e.g. HM-EU-01, ZARA-01"
              value={formState.code}
              onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
              error={errors.code}
              helperText="Unique code identifier for commercial documentation and LC/PO association"
            />

            {/* Email Address */}
            <FormInput
              label="Email Address"
              type="email"
              placeholder="e.g. sourcing@brand.com"
              value={formState.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
            />

            {/* Phone Number */}
            <FormInput
              label="Phone Number"
              placeholder="e.g. +1 234 567 8900"
              value={formState.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              error={errors.phone}
            />

            {/* Country */}
            <FormInput
              label="Country / Region"
              placeholder="e.g. Sweden, Germany, United States, United Kingdom"
              value={formState.country}
              onChange={(e) => handleChange("country", e.target.value)}
              error={errors.country}
            />

            {/* Contact Person */}
            <FormInput
              label="Contact Person"
              placeholder="e.g. Sarah Jenkins (Sourcing Director)"
              value={formState.contactPerson}
              onChange={(e) => handleChange("contactPerson", e.target.value)}
              error={errors.contactPerson}
            />
          </div>

          {/* Business / Delivery Address */}
          <FormTextarea
            label="Commercial / Delivery Address (Optional)"
            rows={3}
            placeholder="Street address, city, state/province, postal code..."
            value={formState.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>
      </FormCard>

      {/* ── Form Action Bar ── */}
      <FormActionBar
        onCancel={() => router.push("/crm/buyer")}
        onReset={handleReset}
        onCreate={handleSubmit}
        isLoading={createMut.isPending}
        cancelLabel="Cancel"
        resetLabel="Reset"
        submitLabel="Create Customer"
      />
    </div>
  );
}

