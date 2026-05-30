"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import SelectedWorksEditor from "@/components/admin/SelectedWorksEditor";
import {
  adminBtnDanger,
  adminBtnGhost,
  adminBtnPrimary,
  adminBtnSecondary,
  adminBtnTab,
  adminBtnTabActive,
  adminBtnTabInactive,
  adminInput,
} from "@/components/admin/admin-styles";
import type { GalleryItem, GalleryRow, GallerySection, SiteContent } from "@/lib/types";

const PASSWORD_KEY = "admin-password";

type AdminTab = "home" | "about" | "selectedWorks" | "projects";

const TABS: { id: AdminTab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "selectedWorks", label: "Selected Works" },
  { id: "projects", label: "Projects" },
];

function ImageUploadField({
  label,
  value,
  onChange,
  password,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  password: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body: formData,
      });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-neutral-600">{label}</label>
      {value && (
        <div className="relative h-40 w-full max-w-xs overflow-hidden rounded border border-neutral-200 bg-neutral-50">
          <Image src={value} alt={label} fill className="object-cover" sizes="320px" />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <label className={`cursor-pointer ${adminBtnSecondary}`}>
          {uploading ? "Uploading…" : "Upload image"}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL"
          className={`min-w-0 flex-1 ${adminInput}`}
        />
      </div>
    </div>
  );
}

function emptyItem(): GalleryItem {
  return {
    id: `item-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    image: "",
    title: "",
    description: "",
    widthWeight: 1,
  };
}

function RowGalleryEditor({
  title,
  section,
  onChange,
  password,
}: {
  title: string;
  section: GallerySection;
  onChange: (section: GallerySection) => void;
  password: string;
}) {
  function updateRow(rowIndex: number, row: GalleryRow) {
    const rows = section.rows.map((r, i) => (i === rowIndex ? row : r));
    onChange({ rows });
  }

  function updateItem(rowIndex: number, itemIndex: number, field: keyof GalleryItem, value: string) {
    const row = section.rows[rowIndex];
    const items = row.items.map((item, i) =>
      i === itemIndex ? { ...item, [field]: value } : item
    );
    updateRow(rowIndex, { ...row, items });
  }

  function setColumns(rowIndex: number, columns: number) {
    const row = section.rows[rowIndex];
    let items = [...row.items];

    while (items.length < columns) {
      items.push(emptyItem());
    }
    if (items.length > columns) {
      items = items.slice(0, columns);
    }

    updateRow(rowIndex, { ...row, columns, items });
  }

  function addRow() {
    onChange({
      rows: [
        ...section.rows,
        {
          id: `row-${Date.now()}`,
          columns: 2,
          items: [emptyItem(), emptyItem()],
        },
      ],
    });
  }

  function removeRow(rowIndex: number) {
    onChange({ rows: section.rows.filter((_, i) => i !== rowIndex) });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
        <button
          type="button"
          onClick={addRow}
          className={adminBtnPrimary}
        >
          + Add row
        </button>
      </div>

      {section.rows.length === 0 && (
        <p className="text-sm font-medium text-neutral-600">No rows yet. Add a row to get started.</p>
      )}

      {section.rows.map((row, rowIndex) => (
        <div
          key={row.id}
          className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-neutral-900">Row {rowIndex + 1}</span>
              <label className="flex items-center gap-2 text-sm text-neutral-600">
                Images in row:
                <select
                  value={row.columns}
                  onChange={(e) => setColumns(rowIndex, Number(e.target.value))}
                  className="rounded border border-neutral-300 px-2 py-1.5 text-sm font-medium"
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="button"
              onClick={() => removeRow(rowIndex)}
              className={adminBtnDanger}
            >
              Remove row
            </button>
          </div>

          <div className="space-y-6">
            {row.items.map((item, itemIndex) => (
              <div
                key={item.id}
                className="space-y-4 rounded border border-neutral-200 bg-white p-4"
              >
                <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Image {itemIndex + 1}
                </span>
                <ImageUploadField
                  label="Image"
                  value={item.image}
                  onChange={(url) => updateItem(rowIndex, itemIndex, "image", url)}
                  password={password}
                />
                <div>
                  <label className="mb-1 block text-sm font-semibold text-neutral-700">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(rowIndex, itemIndex, "title", e.target.value)}
                    className={adminInput}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-neutral-700">
                    Description
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(rowIndex, itemIndex, "description", e.target.value)
                    }
                    className={adminInput}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("home");

  const loadContent = useCallback(async () => {
    const res = await fetch("/api/content");
    const data = await res.json();
    setContent(data);
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem(PASSWORD_KEY);
    if (saved) {
      setPassword(saved);
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) loadContent();
  }, [loggedIn, loadContent]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      sessionStorage.setItem(PASSWORD_KEY, password);
      setLoggedIn(true);
      setMessage("");
    } else {
      setMessage("Incorrect password");
    }
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify(content),
    });

    setSaving(false);
    setMessage(res.ok ? "Saved successfully!" : "Failed to save");
  }

  function handleLogout() {
    sessionStorage.removeItem(PASSWORD_KEY);
    setLoggedIn(false);
    setPassword("");
    setContent(null);
  }

  if (!loggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-6 rounded-lg bg-white p-8 shadow-sm"
        >
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Admin</h1>
            <p className="mt-1 text-sm text-neutral-500">Anam Siddiqui Portfolio</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={adminInput}
              autoFocus
            />
          </div>
          {message && <p className="text-sm text-red-600">{message}</p>}
          <button
            type="submit"
            className={`w-full ${adminBtnPrimary}`}
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-500">Loading…</p>
      </div>
    );
  }

  const isWideEditor = activeTab === "selectedWorks";

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div>
            <h1 className="text-lg font-bold text-neutral-900">Admin</h1>
          </div>
          <nav className="flex items-center gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`${adminBtnTab} ${
                  activeTab === tab.id ? adminBtnTabActive : adminBtnTabInactive
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              className={`${adminBtnGhost} no-underline`}
            >
              View site ↗
            </a>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={adminBtnPrimary}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button type="button" onClick={handleLogout} className={adminBtnGhost}>
              Logout
            </button>
          </div>
        </div>
        {message && (
          <div
            className={`px-6 py-2 text-center text-sm ${
              message.includes("success")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </header>

      <div
        className={`mx-auto px-6 py-8 ${isWideEditor ? "max-w-6xl" : "max-w-4xl"}`}
      >
        <div className={`${isWideEditor ? "" : "rounded-lg bg-white p-8 shadow-sm"}`}>
          {activeTab === "home" && (
            <div className="space-y-6 rounded-lg bg-white p-8 shadow-sm">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-600">
                  Artist name
                </label>
                <input
                  type="text"
                  value={content.artistName}
                  onChange={(e) => setContent({ ...content, artistName: e.target.value })}
                  className={adminInput}
                />
              </div>
              <ImageUploadField
                label="Hero image"
                value={content.home.heroImage}
                onChange={(url) => setContent({ ...content, home: { heroImage: url } })}
                password={password}
              />
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-6 rounded-lg bg-white p-8 shadow-sm">
              <ImageUploadField
                label="Portrait image"
                value={content.about.image}
                onChange={(url) =>
                  setContent({ ...content, about: { ...content.about, image: url } })
                }
                password={password}
              />
              <div>
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  About text
                </label>
                <textarea
                  value={content.about.text}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      about: { ...content.about, text: e.target.value },
                    })
                  }
                  rows={10}
                  className={adminInput}
                  placeholder="Separate paragraphs with a blank line"
                />
              </div>
            </div>
          )}

          {activeTab === "selectedWorks" && (
            <SelectedWorksEditor
              section={content.selectedWorks}
              onChange={(selectedWorks) => setContent({ ...content, selectedWorks })}
              password={password}
            />
          )}

          {activeTab === "projects" && (
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <RowGalleryEditor
                title="Projects"
                section={content.projects}
                onChange={(projects) => setContent({ ...content, projects })}
                password={password}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
