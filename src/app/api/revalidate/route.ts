import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/apiAuth";
import { NextResponse } from "next/server";

export async function POST() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true });
}
