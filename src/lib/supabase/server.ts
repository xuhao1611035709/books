import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getCurrentConfig } from '@/lib/env-config'

export async function createClient() {
  const cookieStore = await cookies()
  const config = getCurrentConfig()

  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  return createServerClient(
    config.supabaseUrl!,
    config.supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}