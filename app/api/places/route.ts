import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const query = searchParams.get("query") || ""
  const region = searchParams.get("region") || ""

  // 👉 For now, just return mock data
  // Later, you can connect this to Google Places API or your own DB
  const results = [
    {
      id: "1",
      name: `Sample Cafe near ${region || "your city"}`,
      address: `${region || "Somewhere"}, MG Road`,
    },
    {
      id: "2",
      name: `Park for ${query || "weekend fun"}`,
      address: `${region || "Anywhere"}, Central Area`,
    },
    {
      id: "3",
      name: `Restaurant: ${query || "Good Food"}`,
      address: `${region || "Neighborhood"}, Food Street`,
    },
  ]

  return NextResponse.json({ results })
}
