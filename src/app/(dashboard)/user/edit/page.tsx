"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Breadcrumb,
  FormInput,
  FormSelect,
} from "@/components/ui";
import {
  useRawRoles,
  useCurrentUser,
  useUserDetail,
  useUserMutations,
} from "@/features/iam/hooks/use-iam";
import { useAuthStore } from "@/store/auth.store";
import { getFileUrl } from "@/lib/utils";
import {
  User as UserIcon,
  ChevronDown,
  ChevronUp,
  Upload,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

function EditUserContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");

  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);

  // Fetch target user to edit
  const { data: userById, isLoading: isLoadingById } = useUserDetail(queryId || "");
  const { data: currentUser, isLoading: isLoadingMe } = useCurrentUser();
  const { data: serverRoles = [], isLoading: isLoadingRoles } = useRawRoles();
  const { updateMut, uploadAvatarMut, uploadSignatureMut } = useUserMutations();

  const user = queryId ? userById : (currentUser || authUser);
  const isLoading = queryId ? isLoadingById : isLoadingMe && !authUser;

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Initialize form state when user data is available
  useEffect(() => {
    if (user) {
      setFormState((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "+880",
        gender: (user.gender?.toUpperCase() === "FEMALE" ? "FEMALE" : "MALE") as "MALE" | "FEMALE",
        roleId: typeof user.roleId === "string" ? user.roleId : user.role?.id || "",
        status: user.status?.toUpperCase() || "ACTIVE",
      }));

      if (user.image || user.avatar) {
        setImagePreview(getFileUrl(user.image || user.avatar));
      }
      if (user.signature) {
        setSignaturePreview(getFileUrl(user.signature));
      }
    }
  }, [user]);

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
    return role?.name || (typeof user?.role === "string" ? user.role : user?.role?.name) || "Role";
  }, [serverRoles, formState.roleId, user]);

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
      setSignaturePreview(URL.createObjectURL(file));
      setErrors((prev) => {
        const next = { ...prev };
        delete next.signature;
        return next;
      });
    }
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
    if (formState.password) {
      if (formState.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (formState.confirmPassword && formState.password !== formState.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !user) return;

    setIsSubmitting(true);
    setSubmitFeedback(null);

    try {
      const targetUserId = user.id;

      // 1. Update text fields
      const updatePayload: any = {
        name: formState.name.trim(),
        email: formState.email.trim(),
        gender: formState.gender,
        roleId: formState.roleId,
        status: formState.status,
      };

      const cleanPhone = formState.phone.trim();
      if (cleanPhone && cleanPhone !== "+880") {
        updatePayload.phone = cleanPhone;
      }

      if (formState.password && formState.password.trim() !== "") {
        updatePayload.password = formState.password;
      }

      const updatedUser = await updateMut.mutateAsync({
        id: targetUserId,
        data: updatePayload,
      });

      // 2. Upload avatar if selected
      if (imageFile) {
        await uploadAvatarMut.mutateAsync({
          id: targetUserId,
          file: imageFile,
        });
      }

      // 3. Upload signature if selected
      if (signatureFile) {
        await uploadSignatureMut.mutateAsync({
          id: targetUserId,
          file: signatureFile,
        });
      }

      // 4. Update auth store if self
      if (authUser && authUser.id === targetUserId) {
        setAuthUser({
          ...authUser,
          ...updatedUser,
          name: formState.name.trim(),
          email: formState.email.trim(),
        });
      }

      setSubmitFeedback({
        type: "success",
        message: `User "${formState.name.trim()}" updated successfully! Redirecting...`,
      });

      setTimeout(() => {
        const dest = queryId ? `/user/details?id=${queryId}` : "/user/details";
        router.push(dest);
      }, 1000);
    } catch (error: any) {
      const errMsg =
        (Array.isArray(error?.response?.data?.message)
          ? error.response.data.message.join(", ")
          : error?.response?.data?.message) ||
        error?.message ||
        "Failed to update user. Please check your inputs.";

      setSubmitFeedback({
        type: "error",
        message: errMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#476ab8]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          title="User"
          items={[
            { label: "User", href: "/user" },
            { label: "Edit" },
          ]}
        />
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-xs">
          <p className="text-slate-600 text-sm">User not found.</p>
          <button
            type="button"
            onClick={() => router.push("/user")}
            className="mt-4 px-6 py-2 rounded-lg bg-[#5066be] text-white text-sm font-semibold hover:bg-[#4357a7] transition-colors cursor-pointer"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const detailsHref = queryId ? `/user/details?id=${queryId}` : "/user/details";

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb Bar ── */}
      <Breadcrumb
        title="User"
        items={[
          { label: "User", href: "/user" },
          { label: "Details", href: detailsHref },
          { label: "Edit" },
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
        {/* ── Left Column: Profile Card & File Pickers ── */}
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

            <h3 className="mt-4 text-base font-bold text-slate-800 leading-tight uppercase truncate max-w-full">
              {formState.name.trim() || user.name || "User"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium lowercase">{selectedRoleName}</p>

            <button
              type="button"
              onClick={() => profileInputRef.current?.click()}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Upload size={13} />
              <span>Change Photo</span>
            </button>
            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
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

          {/* Signature Preview & Upload Card */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800">Signature</h4>
              <button
                type="button"
                onClick={() => signatureInputRef.current?.click()}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#476ab8] hover:underline cursor-pointer"
              >
                <Upload size={12} />
                <span>Upload</span>
              </button>
              <input
                ref={signatureInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSignatureChange}
              />
            </div>
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
                  No signature uploaded
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Column: Form Cards ── */}
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
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
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

                  {/* Row 3: Status */}
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
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Password (Optional for Edit) */}
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
                <h3 className="text-sm font-bold text-slate-800">
                  Password <span className="text-xs font-normal text-slate-400">(leave blank to keep unchanged)</span>
                </h3>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label="Toggle Password Section"
              >
                {isPasswordOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {isPasswordOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* New Password */}
                <div className="relative">
                  <FormInput
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={formState.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    error={errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Confirm New Password */}
                <div className="relative">
                  <FormInput
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={formState.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    error={errors.confirmPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Action Bar ── */}
      <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push(detailsHref)}
          disabled={isSubmitting}
          className="min-w-[120px] px-8 py-2.5 rounded-lg bg-[#b81d24] hover:bg-[#9c181e] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="min-w-[140px] px-6 py-2.5 rounded-lg bg-[#5066be] hover:bg-[#4357a7] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-300 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </div>
  );
}

export default function EditUserPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-[#476ab8]" />
        </div>
      }
    >
      <EditUserContent />
    </Suspense>
  );
}

