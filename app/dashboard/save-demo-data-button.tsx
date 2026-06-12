"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { createClient } from "../../utils/supabase/client";

export default function SaveDemoDataButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function saveDemoData() {
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      setMessage("You must be logged in to save data. Please log out and log back in.");
      return;
    }

    const { error } = await supabase.from("user_app_data").upsert(
      {
        user_id: user.id,
        app_key: "dashboard",
        data_key: "first_saved_demo",
        data: {
          savedAt: new Date().toISOString(),
          message: "This row was saved from the protected dashboard.",
          futureUses: [
            "Snake high scores",
            "Blackjack bankroll",
            "Travel plans",
            "Security Lab results",
            "Data Lab reports",
          ],
        },
      },
      {
        onConflict: "user_id,app_key,data_key",
      }
    );

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Saved.");
    window.location.reload();
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
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          {message}
        </p>
      )}
    </div>
  );
}