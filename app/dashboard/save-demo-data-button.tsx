import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Save } from "lucide-react";
import { createClient } from "../../utils/supabase/server";

export default function SaveDemoDataButton() {
  async function saveDemoData() {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      redirect("/login?redirectedFrom=/dashboard");
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

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
  }

  return (
    <form action={saveDemoData}>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-black shadow-[0_0_22px_rgba(34,211,238,0.25)] transition hover:bg-cyan-300"
      >
        <Save size={16} />
        Save demo data
      </button>
    </form>
  );
}

