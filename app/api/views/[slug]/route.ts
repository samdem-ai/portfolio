import { NextResponse } from "next/server";
import { bumpViews, readViews } from "@/lib/views";
import { getPostSlugs } from "@/lib/work";

const known = (slug: string) => getPostSlugs().includes(slug);

/** GET = read the count (no increment). */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!known(slug)) return NextResponse.json({ count: null }, { status: 404 });
  return NextResponse.json({ count: await readViews(slug) });
}

/** POST = count this view, then return the new total. */
export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!known(slug)) return NextResponse.json({ count: null }, { status: 404 });
  return NextResponse.json({ count: await bumpViews(slug) });
}
