"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  FormCard,
  FormInput,
  FormTextarea,
  FormActionBar,
} from "@/components/ui";
import {
  useRawPermissions,
  useRoleMutations,
  useSeedPermissions,
} from "@/features/iam/hooks/use-iam";
import {
  ShieldCheck,
  CheckSquare,
  Square,
  Search,
  Sparkles,
  Loader2,
  Check,
  X,
  Layers,
} from "lucide-react";

export default function NewRolePage() {
  const router = useRouter();
  const { createMut } = useRoleMutations();
  const seedMut = useSeedPermissions();

  const {
    data: permissions = [],
    isLoading: isLoadingPermissions,
    refetch: refetchPermissions,
  } = useRawPermissions();

  // Form State
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    isTwoFactorRequired: false,
  });

  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<string>>(
    new Set()
  );
  const [permissionSearch, setPermissionSearch] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitFeedback, setSubmitFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Group permissions by module
  const groupedPermissions = useMemo(() => {
    const map = new Map<string, typeof permissions>();
    permissions.forEach((perm) => {
      const mod = perm.module?.toUpperCase() || "GENERAL";
      if (!map.has(mod)) {
        map.set(mod, []);
      }
      map.get(mod)!.push(perm);
    });

    // Convert map to array sorted alphabetically by module name
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [permissions]);

  // Filter grouped permissions by search term
  const filteredGroupedPermissions = useMemo(() => {
    if (!permissionSearch.trim()) return groupedPermissions;

    const term = permissionSearch.toLowerCase().trim();
    return groupedPermissions
      .map(([moduleName, perms]) => {
        const matches = perms.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.module.toLowerCase().includes(term) ||
            p.description?.toLowerCase().includes(term)
        );
        return [moduleName, matches] as [string, typeof perms];
      })
      .filter(([_, matches]) => matches.length > 0);
  }, [groupedPermissions, permissionSearch]);

  // Total matching permissions
  const totalPermissionsCount = permissions.length;
  const selectedCount = selectedPermissionIds.size;

  // Toggle single permission
  const handleTogglePermission = (id: string) => {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle all permissions in a module
  const handleToggleModule = (modulePerms: typeof permissions) => {
    const moduleIds = modulePerms.map((p) => p.id);
    const allSelected = moduleIds.every((id) => selectedPermissionIds.has(id));

    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        moduleIds.forEach((id) => next.delete(id));
      } else {
        moduleIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  // Select all permissions
  const handleSelectAll = () => {
    const allIds = permissions.map((p) => p.id);
    setSelectedPermissionIds(new Set(allIds));
  };

  // Deselect all permissions
  const handleDeselectAll = () => {
    setSelectedPermissionIds(new Set());
  };

  // Seed default permissions if backend has none
  const handleSeedPermissions = async () => {
    try {
      setSubmitFeedback(null);
      await seedMut.mutateAsync();
      await refetchPermissions();
      setSubmitFeedback({
        type: "success",
        message: "Default ERP permissions synchronized successfully!",
      });
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to synchronize permissions.";
      setSubmitFeedback({
        type: "error",
        message: errMsg,
      });
    }
  };

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

  const handleReset = () => {
    setFormState({
      name: "",
      description: "",
      isTwoFactorRequired: false,
    });
    setSelectedPermissionIds(new Set());
    setPermissionSearch("");
    setErrors({});
    setSubmitFeedback(null);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formState.name.trim()) {
      newErrors.name = "Role Name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await createMut.mutateAsync({
        name: formState.name.trim(),
        description: formState.description.trim() || undefined,
        isTwoFactorRequired: formState.isTwoFactorRequired,
        permissionIds: Array.from(selectedPermissionIds),
      });

      setSubmitFeedback({
        type: "success",
        message: `Role "${formState.name.trim()}" created successfully! Redirecting...`,
      });

      setTimeout(() => {
        router.push("/role");
      }, 1000);
    } catch (error: any) {
      const errMsg =
        (Array.isArray(error?.response?.data?.message)
          ? error.response.data.message.join(", ")
          : error?.response?.data?.message) ||
        error?.message ||
        "Failed to create role. Please try again.";

      setSubmitFeedback({
        type: "error",
        message: errMsg,
      });
    }
  };

  // Helper to format permission name (e.g. "users:create" -> "Create")
  const formatPermissionAction = (name: string) => {
    const parts = name.split(":");
    if (parts.length > 1) {
      return parts[1]
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    }
    return name;
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb Bar ── */}
      <Breadcrumb
        title="Role"
        items={[
          { label: "Role", href: "/role" },
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

      {/* ── Role Information Card ── */}
      <FormCard title="Role Information">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Name */}
            <FormInput
              label="Role Name"
              required
              placeholder="e.g. INVENTORY_MANAGER, AUDITOR"
              value={formState.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
            />

            {/* Two-Factor Authentication Security Card */}
            <div className="flex flex-col justify-end">
              <label className="mb-1.5 text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#476ab8]" />
                Security Policy
              </label>
              <div
                onClick={() =>
                  handleChange("isTwoFactorRequired", !formState.isTwoFactorRequired)
                }
                className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
                  formState.isTwoFactorRequired
                    ? "border-[#476ab8] bg-blue-50/50"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-5 w-5 rounded flex items-center justify-center border transition-colors ${
                      formState.isTwoFactorRequired
                        ? "bg-[#476ab8] border-[#476ab8] text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {formState.isTwoFactorRequired && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Require Two-Factor Authentication (2FA)
                    </p>
                    <p className="text-xs text-slate-500">
                      Users with this role must enter an email OTP upon login
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <FormTextarea
            label="Description (Optional)"
            rows={2}
            placeholder="Describe the responsibilities and scope of this role..."
            value={formState.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
      </FormCard>

      {/* ── Role Permissions Card ── */}
      <FormCard title="Role Permissions">
        <div className="space-y-4">
          {/* Header Controls: Search & Select All */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pb-3 border-b border-slate-100">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={permissionSearch}
                onChange={(e) => setPermissionSearch(e.target.value)}
                placeholder="Search permissions by name, module, action..."
                className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-8 py-2 text-xs text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8]"
              />
              {permissionSearch && (
                <button
                  type="button"
                  onClick={() => setPermissionSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Quick Actions & Counter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {selectedCount} of {totalPermissionsCount} selected
              </span>

              <button
                type="button"
                onClick={handleSelectAll}
                disabled={totalPermissionsCount === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                <CheckSquare className="h-3.5 w-3.5 text-[#476ab8]" />
                Select All
              </button>

              <button
                type="button"
                onClick={handleDeselectAll}
                disabled={selectedCount === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Square className="h-3.5 w-3.5 text-slate-400" />
                Deselect All
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoadingPermissions && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-[#476ab8] mb-2" />
              <p className="text-sm font-medium">Loading system permissions...</p>
            </div>
          )}

          {/* Empty State / Seed Prompt */}
          {!isLoadingPermissions && permissions.length === 0 && (
            <div className="text-center py-10 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-[#476ab8] mb-3">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">No permissions found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                The database does not have permissions registered yet. Synchronize default ERP permissions to assign them to this role.
              </p>
              <button
                type="button"
                onClick={handleSeedPermissions}
                disabled={seedMut.isPending}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#476ab8] text-xs font-semibold text-white hover:bg-[#3b5998] transition-colors cursor-pointer disabled:opacity-60"
              >
                {seedMut.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {seedMut.isPending ? "Synchronizing..." : "Seed Default ERP Permissions"}
              </button>
            </div>
          )}

          {/* Filtered No Matches */}
          {!isLoadingPermissions &&
            permissions.length > 0 &&
            filteredGroupedPermissions.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-xs">
                No permissions matched &ldquo;{permissionSearch}&rdquo;.
              </div>
            )}

          {/* Module-by-Module Permission Blocks */}
          {!isLoadingPermissions && filteredGroupedPermissions.length > 0 && (
            <div className="space-y-4 pt-1">
              {filteredGroupedPermissions.map(([moduleName, modulePerms]) => {
                const moduleIds = modulePerms.map((p) => p.id);
                const allSelected =
                  moduleIds.length > 0 &&
                  moduleIds.every((id) => selectedPermissionIds.has(id));
                const someSelected =
                  !allSelected && moduleIds.some((id) => selectedPermissionIds.has(id));

                return (
                  <div
                    key={moduleName}
                    className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-xs transition-all hover:border-slate-300"
                  >
                    {/* Module Header Bar */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/80 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#476ab8]/10 text-[#476ab8]">
                          {moduleName}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          ({modulePerms.length} {modulePerms.length === 1 ? "permission" : "permissions"})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleModule(modulePerms)}
                        className={`text-xs font-semibold px-2 py-1 rounded transition-colors cursor-pointer ${
                          allSelected
                            ? "text-rose-600 hover:bg-rose-50"
                            : "text-[#476ab8] hover:bg-blue-50"
                        }`}
                      >
                        {allSelected
                          ? "Deselect Module"
                          : someSelected
                          ? "Select All in Module"
                          : "Select All"}
                      </button>
                    </div>

                    {/* Permissions Grid */}
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {modulePerms.map((perm) => {
                        const isChecked = selectedPermissionIds.has(perm.id);
                        return (
                          <div
                            key={perm.id}
                            onClick={() => handleTogglePermission(perm.id)}
                            className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all select-none ${
                              isChecked
                                ? "border-[#476ab8] bg-blue-50/30 text-slate-900 shadow-xs"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50"
                            }`}
                          >
                            <div
                              className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                                isChecked
                                  ? "bg-[#476ab8] border-[#476ab8] text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold leading-tight text-slate-800 truncate">
                                {formatPermissionAction(perm.name)}
                              </p>
                              <p
                                className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2"
                                title={perm.description || perm.name}
                              >
                                {perm.description || perm.name}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </FormCard>

      {/* ── Form Action Bar ── */}
      <FormActionBar
        onCancel={() => router.push("/role")}
        onReset={handleReset}
        onCreate={handleSubmit}
        isLoading={createMut.isPending}
        cancelLabel="Cancel"
        resetLabel="Reset"
        submitLabel="Create Role"
      />
    </div>
  );
}

