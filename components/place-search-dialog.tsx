"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useWeekend } from "@/lib/weekend-context"

type PlaceResult = {
  id: string
  name: string
  address: string
  location?: { lat: number; lng: number }
}

export function PlaceSearchDialog({
  activity,
  children,
  onPlaceSelected,
}: {
  activity: any
  children: React.ReactNode
  onPlaceSelected?: (place: PlaceResult, mapsUrl: string) => void
}) {
  const { dispatch } = useWeekend()
  const [open, setOpen] = useState(false)
  const [region, setRegion] = useState("")
  const [query, setQuery] = useState(() => {
    const activityName = activity?.name?.toLowerCase() || ""
    
    // Map specific activity names to relevant search queries
    const activityQueryMap: Record<string, string> = {
      // Outdoor activities
      "morning hike": "hiking trail OR nature trail OR mountain trail",
      "picnic in the park": "park OR picnic area OR public garden",
      "beach day": "beach OR seaside OR waterfront",
      "cycling adventure": "bike trail OR cycling route OR bike path",
      "outdoor photography": "scenic viewpoint OR park OR nature reserve",
      
      // Food & dining
      "brunch with friends": "brunch restaurant OR cafe OR breakfast place",
      "cooking class": "cooking school OR culinary class OR cooking studio",
      "food market tour": "food market OR farmers market OR local market",
      "wine tasting": "winery OR wine bar OR wine tasting room",
      
      // Entertainment
      "movie marathon": "cinema OR movie theater OR film screening",
      "live music concert": "music venue OR concert hall OR live music bar",
      "board game night": "board game cafe OR game lounge OR gaming center",
      "art gallery visit": "art gallery OR museum OR exhibition space",
      
      // Relaxation
      "spa day": "spa OR wellness center OR massage therapy",
      "reading session": "library OR quiet cafe OR bookstore",
      "meditation & yoga": "yoga studio OR meditation center OR wellness retreat",
      "coffee shop visit": "coffee shop OR cafe OR coffee house",
      
      // Fitness
      "gym workout": "gym OR fitness center OR workout studio",
      "rock climbing": "climbing gym OR rock climbing center OR bouldering gym",
      "swimming": "swimming pool OR aquatic center OR water sports",
      
      // Social
      "visit family": "family restaurant OR home OR community center",
      "game night with friends": "game cafe OR board game lounge OR gaming center",
      "double date": "romantic restaurant OR date spot OR couple activities",
      "weekend trip": "hotel OR accommodation OR tourist attraction"
    }
    
    // Check for exact match first
    if (activityQueryMap[activityName]) {
      return activityQueryMap[activityName]
    }
    
    // Fallback to category-based queries for activities not in the map
    const cat = activity?.category
    switch (cat) {
      case "food":
        return "restaurant OR cafe"
      case "outdoor":
        return "park OR trail"
      case "entertainment":
        return "cinema OR music venue"
      case "relaxation":
        return "spa OR cafe"
      case "fitness":
        return "gym OR climbing"
      case "social":
        return "bar OR cafe"
      default:
        return "place"
    }
  })
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<PlaceResult[]>([])
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null)

  async function searchPlaces() {
    if (!query.trim()) return
    setLoading(true)
    setSelectedPlace(null)
    try {
      const url = new URL("/api/places", window.location.origin)
      url.searchParams.set("query", query)
      if (region) url.searchParams.set("region", region)

      const resp = await fetch(url.toString())
      if (!resp.ok) {
        console.error("Places API error", resp.status)
        return
      }
      const data = await resp.json()
      setResults(data.results || [])
    } catch (err) {
      console.error("Failed to fetch places", err)
    } finally {
      setLoading(false)
    }
  }

  function addSelectedToActivities() {
    if (!selectedPlace) return
    const mapsUrl = `https://www.google.com/maps/place/?q=place_id:${selectedPlace.id}`
    if (onPlaceSelected) {
      onPlaceSelected(selectedPlace, mapsUrl)
      setOpen(false)
      return
    }
    const cloned = {
      ...activity,
      location: selectedPlace.address,
      name: `${activity.name} @ ${selectedPlace.name}`,
      googleMapsUrl: mapsUrl,
    }
    dispatch({ type: "ADD_ACTIVITY", payload: cloned })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* ✅ No need for stopPropagation hacks */}
        <div role="button" tabIndex={0}>
          {children}
        </div>
      </DialogTrigger>

      {/* ✅ Prevent bubbling clicks from leaking out */}
      <DialogContent className="sm:max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Find a place for {activity?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Search controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Input
              placeholder="City (e.g., Bangalore)"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
            <div className="sm:col-span-2 flex gap-2">
              <Input
                placeholder="Search query (e.g., Cafe)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button onClick={searchPlaces} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="grid gap-2 max-h-64 overflow-auto">
            {results.map((r) => (
              <Card
                key={r.id}
                className={`${selectedPlace?.id === r.id ? "ring-2 ring-primary" : ""}`}
              >
                <CardContent className="p-3 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-medium text-sm">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.address}</div>
                  </div>
                  <Button
                    size="sm"
                    variant={selectedPlace?.id === r.id ? "default" : "secondary"}
                    onClick={() => setSelectedPlace(r)}
                  >
                    {selectedPlace?.id === r.id ? "Selected" : "Select"}
                  </Button>
                </CardContent>
              </Card>
            ))}
            {results.length === 0 && !loading && (
              <div className="text-xs text-muted-foreground">
                No results yet. Try searching above.
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addSelectedToActivities} disabled={!selectedPlace}>
              Add to Selected
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
