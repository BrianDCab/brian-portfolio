import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "You must be logged in to save data." },
      { status: 401 }
    );
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}