"use client";

import { useState, useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { saveDemoDataAction } from "./actions";

export default function SaveDemoDataButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function saveDemoData() {
    setMessage("");

    startTransition(async () => {
      const result = await saveDemoDataAction();

      if (!result.ok) {
        setMessage(result.error ?? "Could not save data.");
        return;
      }

      setMessage("Saved. Refreshing dashboard...");

      window.setTimeout(() => {
        window.location.reload();
      }, 600);
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={saveDemoData}
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-black shadow-[0_0_22px_rgba(34,211,238,0.25)] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <Save size={16} />
        )}
        Save demo data
      </button>

      {message && (
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          {message}
        </p>
      )}
    </div>
  );
}
