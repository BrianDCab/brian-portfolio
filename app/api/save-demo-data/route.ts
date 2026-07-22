import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { ok: false, error: "Missing Supabase environment variables." },
      { status: 500 }
    );
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { ok: false, error: "You must be logged in." },
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
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return response;
}
