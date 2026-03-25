import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return [] // Not needed for callback, handled in exchangeCodeForSession
          },
          setAll() {
            // Not needed for callback, handled in exchangeCodeForSession
          },
        },
      }
    )
    
    // We must manually overwrite the generic cookies methods here to set cookies on the NextResponse
    const response = NextResponse.redirect(new URL(next, requestUrl.origin))
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return []
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    await supabaseAuth.auth.exchangeCodeForSession(code)
    return response
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(new URL('/login?error=auth', request.url))
}
