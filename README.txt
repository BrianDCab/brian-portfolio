# Supabase Auth Files for Brian Portfolio

Copy these files into your Next.js project root.

Files included:
- utils/supabase/client.ts
- utils/supabase/server.ts
- utils/supabase/proxy.ts
- proxy.ts
- app/register/page.tsx
- app/login/page.tsx
- app/dashboard/page.tsx
- app/dashboard/save-demo-data-button.tsx
- app/logout/route.ts
- app/auth/confirm/route.ts

After copying:
1. Make sure .env.local has:
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
2. Run:
   npm.cmd install @supabase/supabase-js @supabase/ssr
   npm.cmd run build
3. Test:
   /register
   /login
   /dashboard
