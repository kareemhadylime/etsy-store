import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('products').select('id').limit(1)

    if (error) {
      return NextResponse.json(
        { status: 'error', message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: 'Unexpected error' },
      { status: 500 }
    )
  }
}
