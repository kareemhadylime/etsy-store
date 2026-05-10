import type { NextRequest } from 'next/server'
import { handleTrackEvent } from '@/lib/tracking/handler'

export async function POST(req: NextRequest) {
  return handleTrackEvent(req, 'lead')
}
