import { createBrowserClient } from '@supabase/ssr'

export function createClient<T>() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient<T>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}