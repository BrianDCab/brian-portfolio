"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

export default function SaveDemoDataButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function saveDemoData() {
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/save-demo-data", {
      method: "POST",
      credentials: "same-origin",
    });

    const result = await response.json();

    setLoading(false);

    if (!response.ok || !result.ok) {
      setMessage(result.error ?? "Could not save data.");
      return;
    }

    setMessage("Saved.");
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={saveDemoData}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-black shadow-[0_0_22px_rgba(34,211,238,0.25)] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <Save size={16} />
        )}
        Save demo data
      </button>

      {message && (
        <p className="mt-3 text-sm leading-6 text-zinc-300">{message}</p>
      )}
    </div>
  );
}
