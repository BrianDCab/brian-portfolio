import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
return NextResponse.json(
{ error: "Missing Supabase environment variables." },
{ status: 500 }
);
}

const authHeader = request.headers.get("authorization") ?? "";
const accessToken = authHeader.startsWith("Bearer ")
? authHeader.slice("Bearer ".length)
: "";

if (!accessToken) {
return NextResponse.json(
{ error: "You must be logged in to save data." },
{ status: 401 }
);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
auth: {
persistSession: false,
autoRefreshToken: false,
},
global: {
headers: {
Authorization: `Bearer ${accessToken}`,
},
},
});

const {
data: { user },
error: userError,
} = await supabase.auth.getUser(accessToken);

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
