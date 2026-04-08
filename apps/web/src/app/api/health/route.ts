import { NextResponse } from 'next/server';

export const runtime = 'edge';

export function GET() {
  return NextResponse.json({
    ok: true,
    service: 'loopguard-web',
    version: '2.8.2',
    ts: Date.now(),
  });
}
