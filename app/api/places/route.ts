import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const query = searchParams.get("query") || "" // e.g., "brunch with friends"
  const region = searchParams.get("region") || "" // optional, e.g., city

  if (!process.env.GOOGLE_MAPS_API_KEY) {
    return NextResponse.json({ error: "Missing Google Maps API key" }, { status: 500 })
  }

  try {
    let locationParam = ""

    if (region) {
      // Geocode the region to get lat/lng
      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          region
        )}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      )
      const geoData = await geoRes.json()

      if (geoData.status === "OK" && geoData.results.length > 0) {
        const { lat, lng } = geoData.results[0].geometry.location
        locationParam = `&location=${lat},${lng}&radius=5000`
      }
    }

    // Search activity in Google Places Text Search API
    const placesRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}${locationParam}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    )
    const placesData = await placesRes.json()

    const results = (placesData.results || []).map((place: any) => ({
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      location: place.geometry?.location,
    }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Google Maps API error:", error)
    return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 })
  }
}
