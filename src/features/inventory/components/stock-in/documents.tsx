"use client";

import React, { useRef, useState } from "react";
import { ChevronDown, ChevronUp, FileText, Plus, Trash2 } from "lucide-react";
import { useOptionalStockIn } from "./stock-in-context";

export interface DocumentItem {
  id: string;
  name: string;
  fileName: string;
  fileSize?: string;
  uploadedAt?: string;
}

interface DocumentsProps {
  onDocumentsChange?: (documents: DocumentItem[]) => void;
}

export function Documents({ onDocumentsChange }: DocumentsProps) {
  const stockInCtx = useOptionalStockIn();
  const [isOpen, setIsOpen] = useState(true);
  const [docName, setDocName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [internalDocuments, setInternalDocuments] = useState<DocumentItem[]>([]);
  const documents = stockInCtx ? stockInCtx.documents : internalDocuments;
  const setDocuments = stockInCtx ? stockInCtx.setDocuments : setInternalDocuments;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddDocument = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!docName.trim() && !selectedFile) return;

    const newDoc: DocumentItem = {
      id: Date.now().toString(),
      name: docName.trim() || selectedFile?.name || "Document",
      fileName: selectedFile ? selectedFile.name : "No file attached",
      fileSize: selectedFile
        ? `${(selectedFile.size / 1024).toFixed(1)} KB`
        : undefined,
      uploadedAt: new Date().toLocaleDateString(),
    };

    const updated = [...documents, newDoc];
    setDocuments(updated);
    onDocumentsChange?.(updated);

    // Reset input fields
    setDocName("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveDocument = (id: string) => {
    const updated = documents.filter((doc) => doc.id !== id);
    setDocuments(updated);
    onDocumentsChange?.(updated);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-1 rounded-full bg-[#476ab8]" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Documents
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md focus:outline-none cursor-pointer"
          aria-label={isOpen ? "Collapse section" : "Expand section"}
        >
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="p-6">
          <form onSubmit={handleAddDocument}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Name Field */}
              <div className="md:col-span-4">
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder=""
                  className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3.5 text-xs sm:text-sm text-slate-800 focus:border-[#476ab8] focus:ring-1 focus:ring-[#476ab8] focus:outline-none transition-all"
                />
              </div>

              {/* Upload Document Field & Add Button */}
              <div className="md:col-span-8">
                <label className="block text-xs font-medium text-slate-800 mb-1.5">
                  Upload Document
                </label>
                <div className="flex items-center gap-3">
                  {/* File Input Container */}
                  <div className="relative flex-1 flex items-center h-10 rounded-lg border border-slate-200 bg-white px-3 overflow-hidden text-xs sm:text-sm text-slate-700">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="stock-in-file-upload"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    <div className="flex items-center gap-2 pointer-events-none w-full truncate">
                      <button
                        type="button"
                        className="shrink-0 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 border border-slate-300 pointer-events-none"
                      >
                        Choose File
                      </button>
                      <span className="text-xs text-slate-500 truncate">
                        {selectedFile ? selectedFile.name : "No file chosen"}
                      </span>
                    </div>
                  </div>

                  {/* + ADD Button */}
                  <button
                    type="submit"
                    className="h-10 shrink-0 inline-flex items-center gap-1 px-4 rounded-lg bg-[#476ab8] hover:bg-[#3b5ba0] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                    <span>ADD</span>
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* List of uploaded documents */}
          {documents.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Attached Documents ({documents.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={18} className="text-[#476ab8] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {doc.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {doc.fileName} {doc.fileSize && `• ${doc.fileSize}`}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded cursor-pointer"
                      title="Remove document"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Documents;

