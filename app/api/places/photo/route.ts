import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const photoReference = searchParams.get("photoReference") || ""
  const maxWidth = searchParams.get("maxWidth") || "400"

  if (!process.env.GOOGLE_MAPS_API_KEY) {
    return NextResponse.json({ error: "Missing Google Maps API key" }, { status: 500 })
  }

  if (!photoReference) {
    return NextResponse.json({ error: "Missing photoReference" }, { status: 400 })
  }

  try {
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${encodeURIComponent(
      maxWidth
    )}&photo_reference=${encodeURIComponent(photoReference)}&key=${process.env.GOOGLE_MAPS_API_KEY}`

    const upstream = await fetch(photoUrl)
    if (!upstream.ok) {
      return NextResponse.json({ error: "Failed to fetch photo" }, { status: 502 })
    }

    // Stream the image through our edge
    const contentType = upstream.headers.get("content-type") || "image/jpeg"
    const arrayBuffer = await upstream.arrayBuffer()
    return new NextResponse(arrayBuffer, {
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=86400",
      },
    })
  } catch (e) {
    console.error("Photo proxy error", e)
    return NextResponse.json({ error: "Photo proxy failed" }, { status: 500 })
  }
}


