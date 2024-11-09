import { NextResponse } from 'next/server';
import { generatePoem } from '@/lib/poemGenerator';

export async function POST(request: Request) {
  const { weather } = await request.json();
  const poem = await generatePoem(weather);
  return NextResponse.json({ poem });
}
