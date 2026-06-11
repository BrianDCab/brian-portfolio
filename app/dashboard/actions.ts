"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../utils/supabase/server";

export async function saveDemoDataAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      error: "You must be logged in to save data.",
    };
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
    return {
      ok: false,
      error: error.message,
    };
  }

  revalidatePath("/dashboard");

  return {
    ok: true,
  };
}
