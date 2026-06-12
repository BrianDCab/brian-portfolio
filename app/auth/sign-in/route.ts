import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return NextResponse.redirect(
      new URL("/login?error=Missing email or password", request.url)
    );
  }

  let response = NextResponse.redirect(new URL("/dashboard", request.url));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(
      new URL("/login?error=Missing Supabase environment variables", request.url)
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

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.redirect(
      new URL("/login?error=" + encodeURIComponent(error.message), request.url)
    );
  }

  response.headers.set("Cache-Control", "no-store");

  return response;
}
