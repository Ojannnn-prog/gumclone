import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    
    // Exchange the auth code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Redirect to the intended page (or homepage by default)
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("Supabase Auth Error:", error.message);
      // Redirect to error page or homepage with error query param
      return NextResponse.redirect(`${origin}/?error=auth_exchange_failed`);
    }
  }

  // Return the user to the homepage if there's no code
  return NextResponse.redirect(`${origin}${next}`);
}
