import { createBrowserClient } from '@supabase/ssr'
import { getCurrentConfig } from '@/lib/env-config'

export function createClient() {
  const config = getCurrentConfig()
  
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    config.supabaseUrl!,
    config.supabaseKey!
  )
}