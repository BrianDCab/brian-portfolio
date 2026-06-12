import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "../../utils/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  await supabase.auth.signOut();

  const response = NextResponse.redirect(
    new URL("/login?message=Logged out", request.url)
  );

  response.headers.set("Cache-Control", "no-store");

  return response;
}
