import { NextResponse } from 'next/server'
import { currentEnv, currentConfig } from '@/lib/env-config'

export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      environment: currentEnv,
      branch: process.env.VERCEL_GIT_COMMIT_REF || 'local',
      timestamp: new Date().toISOString(),
      config: {
        supabaseUrl: currentConfig.supabaseUrl?.substring(0, 30) + '...',
        hasValidConfig: !!(currentConfig.supabaseUrl && currentConfig.supabaseKey),
        vercelEnv: process.env.VERCEL_ENV,
        nodeEnv: process.env.NODE_ENV,
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        environment: currentEnv,
      },
      { status: 500 }
    )
  }
} 