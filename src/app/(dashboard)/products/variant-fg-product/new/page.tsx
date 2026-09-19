"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, Eye, Check } from "lucide-react";
import {
  Breadcrumb,
  FormCard,
  FormInput,
  FormSelect,
  FormSearchableSelect,
  FormTagsInput,
  FormTextarea,
  FormActionBar,
} from "@/components/ui";
import { useColors } from "@/features/attributes/hooks/use-attributes";
import {
  useMasterProducts,
  useVariantMutations,
} from "@/features/products/hooks/use-master-products";
import { colorData } from "@/lib/mock-data/attributes/color.mock";
import { masterProductData } from "@/lib/mock-data/products/master-products.mock";
import type { ProductGender, UnitOfMeasurement } from "@/features/products/types/product.types";

const DEFAULT_SIZES = ["39", "40", "41", "42", "43", "44", "45", "46", "47", "48"];

const GENDER_OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Lady", value: "LADY" },
  { label: "Kids", value: "KIDS" },
  { label: "Junior", value: "JUNIOR" },
  { label: "Twin Junior", value: "TWIN_JUNIOR" },
];

const UOM_OPTIONS = [
  { label: "Pair", value: "PAIR" },
  { label: "Left", value: "LEFT" },
  { label: "Right", value: "RIGHT" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

export default function NewVariantFGProductPage() {
  const router = useRouter();
  const { bulkCreateMut } = useVariantMutations();

  // Queries
  const { data: serverMasterProducts } = useMasterProducts();
  const { data: serverColors } = useColors();

  // Form State
  const [formState, setFormState] = useState({
    masterProductId: "",
    colorId: "",
    gender: "MALE",
    modelNumber: "",
    uom: "PAIR",
    itemsPerPacket: "10",
    packagingType: "Poly Bag",
    status: "ACTIVE",
    sizes: DEFAULT_SIZES,
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Master product options
  const masterProductOptions = useMemo(() => {
    if (serverMasterProducts && serverMasterProducts.length > 0) {
      return serverMasterProducts.map((p) => ({
        label: p.masterProductName || p.productName || `Product #${p.id}`,
        value: String(p.id),
        sublabel: p.sku ? `SKU: ${p.sku}` : undefined,
      }));
    }
    return [];
  }, [serverMasterProducts]);

  // Color options
  const colorOptions = useMemo(() => {
    if (serverColors && serverColors.length > 0) {
      return serverColors.map((c) => ({
        label: c.name,
        value: String(c.id),
      }));
    }
    return [];
  }, [serverColors]);

  // Selected details for SKU generation
  const selectedMaster = useMemo(() => {
    return (
      serverMasterProducts?.find((p) => String(p.id) === formState.masterProductId) ||
      masterProductData.find((p) => String(p.id) === formState.masterProductId)
    );
  }, [serverMasterProducts, formState.masterProductId]);

  const selectedColor = useMemo(() => {
    return (
      serverColors?.find((c) => String(c.id) === formState.colorId) ||
      colorData.find((c) => String(c.id) === formState.colorId)
    );
  }, [serverColors, formState.colorId]);

  // Derived Auto SKU
  const autoSku = useMemo(() => {
    const masterSkuPart = selectedMaster?.sku
      ? selectedMaster.sku.toUpperCase()
      : formState.masterProductId
      ? `FG${formState.masterProductId}`
      : "";

    const colorPart = selectedColor?.name
      ? selectedColor.name.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, "")
      : "";

    const genderPart = formState.gender ? formState.gender.substring(0, 1) : "";

    if (masterSkuPart && colorPart) {
      return `${masterSkuPart}-${colorPart}-${genderPart}`;
    }
    if (masterSkuPart) {
      return `${masterSkuPart}-${genderPart}`;
    }
    return "";
  }, [selectedMaster, selectedColor, formState.gender, formState.masterProductId]);

  const handleChange = (field: string, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
    if (submitFeedback) {
      setSubmitFeedback(null);
    }
  };

  const handleReset = () => {
    setFormState({
      masterProductId: "",
      colorId: "",
      gender: "MALE",
      modelNumber: "",
      uom: "PAIR",
      itemsPerPacket: "10",
      packagingType: "Poly Bag",
      status: "ACTIVE",
      sizes: DEFAULT_SIZES,
      description: "",
    });
    setErrors({});
    setSubmitFeedback(null);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formState.masterProductId) {
      newErrors.masterProductId = "Master Finished Good is required";
    }
    if (!formState.colorId) {
      newErrors.colorId = "Color is required";
    }
    if (!formState.gender) {
      newErrors.gender = "Gender is required";
    }
    if (!formState.uom) {
      newErrors.uom = "Unit of Measurement is required";
    }
    if (!formState.itemsPerPacket || Number(formState.itemsPerPacket) <= 0) {
      newErrors.itemsPerPacket = "Products per packet must be greater than 0";
    }
    if (!formState.sizes || formState.sizes.length === 0) {
      newErrors.sizes = "At least one size is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (!validate()) return;
    setIsPreviewOpen(true);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await bulkCreateMut.mutateAsync({
        masterProductId: formState.masterProductId,
        colorIds: [formState.colorId],
        gender: formState.gender as ProductGender,
        uom: formState.uom as UnitOfMeasurement,
        itemsPerPacket: Number(formState.itemsPerPacket) || 10,
        sizes: formState.sizes,
      });

      setSubmitFeedback({
        type: "success",
        message: `Successfully created ${formState.sizes.length} variant(s)! Redirecting...`,
      });

      setIsPreviewOpen(false);

      setTimeout(() => {
        router.push("/products/variant-fg-product");
      }, 1000);
    } catch (error: any) {
      const errMsg =
        (Array.isArray(error?.response?.data?.message)
          ? error.response.data.message.join(", ")
          : error?.response?.data?.message) ||
        error?.message ||
        "Failed to create variants. Please try again.";

      setSubmitFeedback({
        type: "error",
        message: errMsg,
      });
    }
  };

  // Preview data generation
  const previewRows = useMemo(() => {
    const masterLabel =
      selectedMaster?.masterProductName ||
      selectedMaster?.productName ||
      "Master Product";
    const colorLabel = selectedColor?.name || "Color";
    const baseSku = autoSku || "SKU-AUTO";

    return formState.sizes.map((size) => ({
      sku: `${baseSku}-${size}`,
      masterProduct: masterLabel,
      color: colorLabel,
      gender: formState.gender,
      size,
      uom: formState.uom,
      itemsPerPacket: formState.itemsPerPacket,
      packagingType: formState.packagingType,
      status: formState.status,
    }));
  }, [selectedMaster, selectedColor, autoSku, formState]);

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb Bar ── */}
      <Breadcrumb
        title="Product"
        items={[
          { label: "Product", href: "/products/variant-fg-product" },
          { label: "Finished Good", href: "/products/variant-fg-product" },
          { label: "New" },
        ]}
      />

      {/* Feedback Banner */}
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

      {/* ── Finished Good Variant Information Card ── */}
      <FormCard title="Finished Good Variant Information">
        <div className="space-y-6">
          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Row 1, Col 1: Master Finished Good * */}
            <FormSearchableSelect
              label="Master Finished Good"
              required
              placeholder="Search and select master..."
              value={formState.masterProductId}
              onChange={(val) => handleChange("masterProductId", val)}
              options={masterProductOptions}
              error={errors.masterProductId}
            />

            {/* Row 1, Col 2: Color * */}
            <FormSearchableSelect
              label="Color"
              required
              placeholder="Search and select color..."
              value={formState.colorId}
              onChange={(val) => handleChange("colorId", val)}
              options={colorOptions}
              error={errors.colorId}
            />

            {/* Row 1, Col 3: Gender * */}
            <FormSelect
              label="Gender"
              required
              value={formState.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              options={GENDER_OPTIONS}
              error={errors.gender}
            />

            {/* Row 2, Col 1: SKU (Auto) */}
            <FormInput
              label="SKU (Auto)"
              placeholder="Auto-generated"
              value={autoSku}
              disabled
              className="bg-slate-50/80 text-slate-600 cursor-not-allowed"
            />

            {/* Row 2, Col 2: Model Number */}
            <FormInput
              label="Model Number"
              placeholder="Optional article number"
              value={formState.modelNumber}
              onChange={(e) => handleChange("modelNumber", e.target.value)}
            />

            {/* Row 2, Col 3: UOM * */}
            <FormSelect
              label="UOM"
              required
              value={formState.uom}
              onChange={(e) => handleChange("uom", e.target.value)}
              options={UOM_OPTIONS}
              error={errors.uom}
            />

            {/* Row 3, Col 1: Products Per Packet * */}
            <FormInput
              label="Products Per Packet"
              type="number"
              required
              min="1"
              value={formState.itemsPerPacket}
              onChange={(e) => handleChange("itemsPerPacket", e.target.value)}
              error={errors.itemsPerPacket}
            />

            {/* Row 3, Col 2: Packaging Type */}
            <FormInput
              label="Packaging Type"
              value={formState.packagingType}
              onChange={(e) => handleChange("packagingType", e.target.value)}
              placeholder="Poly Bag"
            />

            {/* Row 3, Col 3: Status */}
            <FormSelect
              label="Status"
              value={formState.status}
              onChange={(e) => handleChange("status", e.target.value)}
              options={STATUS_OPTIONS}
            />
          </div>

          {/* Row 4: Full-width Sizes Chip Input */}
          <FormTagsInput
            label="Sizes"
            tags={formState.sizes}
            onChange={(newSizes) => handleChange("sizes", newSizes)}
            placeholder="Add custom"
            error={errors.sizes}
          />

          {/* Row 5: Full-width Description Textarea */}
          <FormTextarea
            label="Description"
            placeholder="Optional description"
            rows={4}
            value={formState.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
      </FormCard>

      {/* ── Form Action Bar ── */}
      <FormActionBar
        onCancel={() => router.push("/products/variant-fg-product")}
        onReset={handleReset}
        onPreview={handlePreview}
        onCreate={handleSubmit}
        isLoading={bulkCreateMut.isPending}
        cancelLabel="Cancel"
        resetLabel="Reset"
        previewLabel="Preview"
        submitLabel="Create"
      />

      {/* ── Preview Modal Dialog ── */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Eye size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800">
                    Variant Combinations Preview
                  </h3>
                  <p className="text-xs text-slate-500">
                    {previewRows.length} variant(s) ready to be generated for{" "}
                    <span className="font-semibold text-slate-700">
                      {selectedMaster?.masterProductName || selectedMaster?.productName || "Product"}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Table Body */}
            <div className="flex-1 overflow-auto p-6">
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Master Product</th>
                      <th className="px-4 py-3">Color</th>
                      <th className="px-4 py-3">Gender</th>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">UOM</th>
                      <th className="px-4 py-3">Per Packet</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {previewRows.map((row, idx) => (
                      <tr key={row.sku} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-2.5 font-medium text-slate-400">{idx + 1}</td>
                        <td className="px-4 py-2.5 font-mono text-[11px] font-semibold text-indigo-600">
                          {row.sku}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-slate-800">
                          {row.masterProduct}
                        </td>
                        <td className="px-4 py-2.5">{row.color}</td>
                        <td className="px-4 py-2.5 capitalize">{row.gender.toLowerCase()}</td>
                        <td className="px-4 py-2.5 font-semibold text-slate-900">
                          <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5">
                            {row.size}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">{row.uom}</td>
                        <td className="px-4 py-2.5">{row.itemsPerPacket}</td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                            <Check size={12} strokeWidth={3} />
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={bulkCreateMut.isPending}
                className="px-6 py-2 text-xs font-semibold text-white bg-[#5066be] hover:bg-[#4357a7] rounded-lg transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Create All {previewRows.length} Variants</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

