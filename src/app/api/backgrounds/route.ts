import { NextResponse } from "next/server"
import { getBackgroundCollections } from "@/lib/backgrounds"

export async function GET() {
  try {
    const collections = getBackgroundCollections()
    return NextResponse.json(collections, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("[BACKGROUNDS_GET_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
