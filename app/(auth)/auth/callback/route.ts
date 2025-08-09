import {
  getServerClient,
  getServiceRoleClient,
} from "@/lib/supabase/serverClient";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/";
  }

  if (code) {
    const serverClient = await getServerClient();
    const { error } = await serverClient.auth.exchangeCodeForSession(code);
    if (!error) {
      // upsert public.profile
      const {
        data: { user },
      } = await serverClient.auth.getUser();
      const serviceRoleClient = getServiceRoleClient();
      await serviceRoleClient.from("profile").upsert({
        id: user!.id,
        updated_at: new Date(),
        name: user!.user_metadata.name,
        email: user!.user_metadata.email,
        avatar_url: user!.user_metadata.avatar_url,
      });

      // original origin before load balancer
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
