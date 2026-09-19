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
  useCategories,
  useCreateSubCategory,
} from "@/features/attributes/hooks/use-attributes";
import { categoryData } from "@/lib/mock-data/attributes/category.mock";

export default function NewSubCategoryPage() {
  const router = useRouter();
  const [mainCategoryId, setMainCategoryId] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: categories = categoryData, isLoading: isCategoriesLoading } =
    useCategories();
  const createSubCategoryMutation = useCreateSubCategory();

  const categoryOptions = useMemo(() => {
    return (categories || []).map((cat) => ({
      label: cat.name,
      value: String(cat.id),
    }));
  }, [categories]);

  const handleReset = () => {
    setMainCategoryId("");
    setName("");
    setStatus("Active");
    setDescription("");
    setErrors({});
    setServerError(null);
  };

  const handleCancel = () => {
    router.push("/attribute/sub-category");
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = "Sub category name is required";
    }
    if (!mainCategoryId) {
      newErrors.mainCategoryId = "Please select a main category";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setServerError(null);

    createSubCategoryMutation.mutate(
      {
        name: name.trim(),
        categoryId: mainCategoryId,
      },
      {
        onSuccess: () => {
          router.push("/attribute/sub-category");
        },
        onError: (err: any) => {
          const resData = err?.response?.data;
          let message = "Failed to create sub category. Please try again.";
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
          { label: "Sub Category", href: "/attribute/sub-category" },
          { label: "New" },
        ]}
        className="rounded-2xl border border-slate-200/90 shadow-xs"
      />

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Sub Category Information Card */}
      <FormCard title="Sub Category Information">
        <div className="flex flex-col gap-6">
          {/* Row 1: Main Category and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSearchableSelect
              label="Main Category"
              placeholder="Search and select category..."
              options={categoryOptions}
              value={mainCategoryId}
              onChange={(val) => {
                setMainCategoryId(val);
                if (errors.mainCategoryId) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.mainCategoryId;
                    return next;
                  });
                }
              }}
              isLoading={isCategoriesLoading}
              error={errors.mainCategoryId}
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

          {/* Row 2: Sub Category Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Sub Category Name"
              placeholder="Enter sub category name"
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
          </div>

          {/* Row 3: Description */}
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
        isLoading={createSubCategoryMutation.isPending}
        loadingLabel="Creating..."
        submitLabel="Create"
        cancelLabel="Cancel"
        resetLabel="Reset"
      />
    </div>
  );
}

