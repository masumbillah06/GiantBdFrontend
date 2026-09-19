"use client";

import React, { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Breadcrumb,
  FormInput,
  FormSelect,
} from "@/components/ui";
import { useRawRoles, useUserMutations } from "@/features/iam/hooks/use-iam";
import {
  User as UserIcon,
  ChevronDown,
  ChevronUp,
  Upload,
  Loader2,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";

export default function NewUserPage() {
  const router = useRouter();
  const { registerMut } = useUserMutations();
  const { data: serverRoles = [], isLoading: isLoadingRoles } = useRawRoles();

  // Form State
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "+880",
    gender: "MALE" as "MALE" | "FEMALE",
    roleId: "",
    status: "ACTIVE",
    password: "",
    confirmPassword: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(true);
  const [isPasswordOpen, setIsPasswordOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"personal" | "password">("personal");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitFeedback, setSubmitFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // File input refs
  const profileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  // Section refs for smooth scrolling
  const personalInfoRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);

  // Roles Options
  const roleOptions = useMemo(() => {
    if (serverRoles && serverRoles.length > 0) {
      return serverRoles.map((r) => ({
        label: r.name,
        value: r.id,
      }));
    }
    return [];
  }, [serverRoles]);

  // Selected role name
  const selectedRoleName = useMemo(() => {
    const role = serverRoles.find((r) => r.id === formState.roleId);
    return role?.name || "Role";
  }, [serverRoles, formState.roleId]);

  const handleChange = (field: string, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Only image files are allowed" }));
        return;
      }
      setImageFile(file);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => {
        const next = { ...prev };
        delete next.image;
        return next;
      });
    }
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, signature: "Only image files are allowed" }));
        return;
      }
      setSignatureFile(file);
      if (signaturePreview) URL.revokeObjectURL(signaturePreview);
      setSignaturePreview(URL.createObjectURL(file));
      setErrors((prev) => {
        const next = { ...prev };
        delete next.signature;
        return next;
      });
    }
  };

  const handleReset = () => {
    setFormState({
      name: "",
      email: "",
      phone: "+880",
      gender: "MALE",
      roleId: "",
      status: "ACTIVE",
      password: "",
      confirmPassword: "",
    });
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (signaturePreview) URL.revokeObjectURL(signaturePreview);
    setImageFile(null);
    setImagePreview(null);
    setSignatureFile(null);
    setSignaturePreview(null);
    if (profileInputRef.current) profileInputRef.current.value = "";
    if (signatureInputRef.current) signatureInputRef.current.value = "";
    setErrors({});
    setSubmitFeedback(null);
  };

  const scrollToSection = (section: "personal" | "password") => {
    setActiveTab(section);
    if (section === "personal" && personalInfoRef.current) {
      setIsPersonalInfoOpen(true);
      personalInfoRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (section === "password" && passwordRef.current) {
      setIsPasswordOpen(true);
      passwordRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formState.name.trim()) {
      newErrors.name = "Full Name is required";
    }
    if (!formState.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formState.roleId) {
      newErrors.roleId = "Role is required";
    }
    if (!formState.password) {
      newErrors.password = "Password is required";
    } else if (formState.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formState.confirmPassword && formState.password !== formState.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const formData = new FormData();
      formData.append("name", formState.name.trim());
      formData.append("email", formState.email.trim());
      formData.append("password", formState.password);
      formData.append("gender", formState.gender);
      formData.append("roleId", formState.roleId);

      const cleanPhone = formState.phone.trim();
      if (cleanPhone && cleanPhone !== "+880") {
        formData.append("phone", cleanPhone);
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (signatureFile) {
        formData.append("signature", signatureFile);
      }

      await registerMut.mutateAsync(formData);

      setSubmitFeedback({
        type: "success",
        message: `User "${formState.name.trim()}" created successfully! Redirecting...`,
      });

      setTimeout(() => {
        router.push("/user");
      }, 1000);
    } catch (error: any) {
      const errMsg =
        (Array.isArray(error?.response?.data?.message)
          ? error.response.data.message.join(", ")
          : error?.response?.data?.message) ||
        error?.message ||
        "Failed to create user. Please check your inputs.";

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
        title="User"
        items={[
          { label: "User", href: "/user" },
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

      {/* ── Main Two-Column Layout ── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ── Left Column: Profile Card & Signature Preview ── */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">
          {/* Avatar Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-slate-100 relative">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Avatar preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <UserIcon className="h-16 w-16 text-slate-400" />
              )}
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-800 leading-tight truncate max-w-full">
              {formState.name.trim() || "User"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{selectedRoleName}</p>
          </div>

          {/* Section Jump Tabs */}
          <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-100 space-y-2">
            <button
              type="button"
              onClick={() => scrollToSection("personal")}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-xs text-left transition-colors cursor-pointer ${
                activeTab === "personal"
                  ? "bg-[#edf2fe] text-[#476ab8]"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Personal Info
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("password")}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-xs text-left transition-colors cursor-pointer ${
                activeTab === "password"
                  ? "bg-[#edf2fe] text-[#476ab8]"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Password
            </button>
          </div>

          {/* Signature Preview Card */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Signature Preview</h4>
            <div className="w-full h-32 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center p-3 relative overflow-hidden">
              {signaturePreview ? (
                <Image
                  src={signaturePreview}
                  alt="Signature preview"
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              ) : (
                <span className="text-xs text-slate-400 font-medium">
                  No signature selected
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Column: Form Cards & Action Bar ── */}
        <div className="flex-1 w-full space-y-6">
          {/* Card 1: Personal Info */}
          <div
            ref={personalInfoRef}
            className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-6"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between pb-3 border-b border-slate-100 cursor-pointer select-none"
              onClick={() => setIsPersonalInfoOpen((prev) => !prev)}
            >
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-[#476ab8] rounded-full" />
                <h3 className="text-sm font-bold text-slate-800">Personal Info</h3>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Toggle Personal Info"
              >
                {isPersonalInfoOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {isPersonalInfoOpen && (
              <div className="space-y-5">
                {/* Gender Radio Buttons */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                    <input
                      type="radio"
                      name="gender"
                      value="MALE"
                      checked={formState.gender === "MALE"}
                      onChange={() => handleChange("gender", "MALE")}
                      className="h-4 w-4 text-[#476ab8] accent-[#476ab8] focus:ring-0 cursor-pointer"
                    />
                    <span>Male</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                    <input
                      type="radio"
                      name="gender"
                      value="FEMALE"
                      checked={formState.gender === "FEMALE"}
                      onChange={() => handleChange("gender", "FEMALE")}
                      className="h-4 w-4 text-[#476ab8] accent-[#476ab8] focus:ring-0 cursor-pointer"
                    />
                    <span>Female</span>
                  </label>
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Row 1: Full Name & Number */}
                  <FormInput
                    label="Full Name"
                    required
                    placeholder="Enter Full name"
                    value={formState.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    error={errors.name}
                  />

                  <FormInput
                    label="Number"
                    placeholder="+880"
                    value={formState.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    error={errors.phone}
                  />

                  {/* Row 2: Email & Role */}
                  <FormInput
                    label="Email"
                    required
                    type="email"
                    placeholder="Enter email"
                    value={formState.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    error={errors.email}
                  />

                  <FormSelect
                    label="Role"
                    required
                    placeholder="Select user role"
                    chevronType="updown"
                    value={formState.roleId}
                    onChange={(e) => handleChange("roleId", e.target.value)}
                    options={roleOptions}
                    error={errors.roleId}
                    disabled={isLoadingRoles}
                  />

                  {/* Row 3: Status & Profile Picture */}
                  <FormSelect
                    label="Status"
                    placeholder="Select user status"
                    chevronType="updown"
                    value={formState.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    options={[
                      { label: "Active", value: "ACTIVE" },
                      { label: "Inactive", value: "INACTIVE" },
                    ]}
                  />

                  {/* Profile Picture File Upload */}
                  <div className="flex flex-col">
                    <label className="mb-1.5 text-sm font-semibold text-slate-800">
                      Profile Picture
                    </label>
                    <div
                      onClick={() => profileInputRef.current?.click()}
                      className="flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 cursor-pointer hover:border-slate-300 transition-colors"
                    >
                      <span className="inline-flex items-center px-3 py-1 rounded-md bg-slate-100 text-xs font-semibold text-slate-700 mr-3 border border-slate-200">
                        Choose File
                      </span>
                      <span className="text-xs text-slate-500 truncate flex-1">
                        {imageFile ? imageFile.name : "No file chosen"}
                      </span>
                    </div>
                    <input
                      ref={profileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Only image files are allowed.
                    </p>
                    {errors.image && (
                      <p className="text-xs text-red-500 mt-1">{errors.image}</p>
                    )}
                  </div>

                  {/* Row 4: Signature File Upload */}
                  <div className="flex flex-col">
                    <label className="mb-1.5 text-sm font-semibold text-slate-800">
                      Signature
                    </label>
                    <div
                      onClick={() => signatureInputRef.current?.click()}
                      className="flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 cursor-pointer hover:border-slate-300 transition-colors"
                    >
                      <span className="inline-flex items-center px-3 py-1 rounded-md bg-slate-100 text-xs font-semibold text-slate-700 mr-3 border border-slate-200">
                        Choose File
                      </span>
                      <span className="text-xs text-slate-500 truncate flex-1">
                        {signatureFile ? signatureFile.name : "No file chosen"}
                      </span>
                    </div>
                    <input
                      ref={signatureInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureChange}
                      className="hidden"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Only image files are allowed.
                    </p>
                    {errors.signature && (
                      <p className="text-xs text-red-500 mt-1">{errors.signature}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Password */}
          <div
            ref={passwordRef}
            className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-6"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between pb-3 border-b border-slate-100 cursor-pointer select-none"
              onClick={() => setIsPasswordOpen((prev) => !prev)}
            >
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-[#476ab8] rounded-full" />
                <h3 className="text-sm font-bold text-slate-800">Password</h3>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Toggle Password Section"
              >
                {isPasswordOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {isPasswordOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Password */}
                <div className="relative">
                  <FormInput
                    label="Password"
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formState.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    error={errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <FormInput
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Enter confirm password"
                    value={formState.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    error={errors.confirmPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Bottom Action Bar matching user screenshot ── */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/user")}
              disabled={registerMut.isPending}
              className="px-8 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#b91c1c] hover:bg-[#991b1b] transition-colors cursor-pointer disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={registerMut.isPending}
              className="px-8 py-2.5 rounded-lg text-sm font-semibold text-[#d97706] bg-white border border-[#f59e0b] hover:bg-amber-50/60 transition-colors cursor-pointer disabled:opacity-60"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={registerMut.isPending}
              className="px-8 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#4f46e5] hover:bg-[#4338ca] transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
            >
              {registerMut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {registerMut.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

