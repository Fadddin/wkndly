"use client"

import { useEffect, useState } from "react"
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

type PlaceDetails = {
  id: string
  name: string
  address: string
  location?: { lat: number; lng: number }
  rating?: number | null
  openingHours?: string[] | null
  openNow?: boolean | null
  photoReference?: string | null
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
  const [details, setDetails] = useState<PlaceDetails | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

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

  // Fetch details when a place is selected
  useEffect(() => {
    let aborted = false
    async function loadDetails() {
      if (!selectedPlace) {
        setDetails(null)
        return
      }
      setDetailsLoading(true)
      try {
        const url = new URL("/api/places", window.location.origin)
        url.searchParams.set("placeId", selectedPlace.id)
        const resp = await fetch(url.toString())
        if (!resp.ok) return
        const data = await resp.json()
        if (!aborted) setDetails(data.result as PlaceDetails)
      } catch (_) {
        if (!aborted) setDetails(null)
      } finally {
        if (!aborted) setDetailsLoading(false)
      }
    }
    loadDetails()
    return () => {
      aborted = true
    }
  }, [selectedPlace])

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
        <div 
          role="button" 
          tabIndex={0}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </DialogTrigger>

      {/* Prevent bubbling clicks from leaking out */}
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Find a place for {activity?.name}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0 space-y-3">
          {/* Search controls */}
          <div className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-2">
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

          {/* Scrollable content area */}
          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto">
            {/* Results */}
            <div className="space-y-1">
              {results.map((r) => (
                <Card
                  key={r.id}
                  className={`${selectedPlace?.id === r.id ? "ring-2 ring-primary" : ""}`}
                >
                  <CardContent className="p-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs truncate">{r.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{r.address}</div>
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant={selectedPlace?.id === r.id ? "default" : "secondary"}
                          className="h-6 px-2 text-xs"
                          onClick={() => setSelectedPlace(r)}
                        >
                          {selectedPlace?.id === r.id ? "✓" : "Select"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-1 text-xs"
                          onClick={() => {
                            const mapsUrl = `https://www.google.com/maps/place/?q=place_id:${r.id}`
                            window.open(mapsUrl, "_blank")
                          }}
                        >
                          📍 Maps
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {results.length === 0 && !loading && (
                <div className="text-xs text-muted-foreground">
                  No results yet. Try searching above.
                </div>
              )}
            </div>

            {/* Selected details */}
            {selectedPlace && (
              <div className="border rounded-md p-2 space-y-1">
                <div className="flex items-start gap-2">
                  {details?.photoReference ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/api/places/photo?photoReference=${encodeURIComponent(details.photoReference)}&maxWidth=150`}
                      alt={selectedPlace.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded grid place-items-center text-xs text-muted-foreground">
                      📷
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs truncate">{selectedPlace.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{selectedPlace.address}</div>
                    <div className="mt-1 text-xs flex items-center gap-1 flex-wrap">
                      {detailsLoading ? (
                        <span>Loading…</span>
                      ) : (
                        <>
                          {typeof details?.rating === "number" && (
                            <span>{details.rating.toFixed(1)}★</span>
                          )}
                          {typeof details?.openNow === "boolean" && (
                            <Badge variant={details.openNow ? "default" : "secondary"} className="text-xs px-1 py-0 h-4">
                              {details.openNow ? "Open" : "Closed"}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {details?.openingHours && (
                  <div className="text-xs text-muted-foreground whitespace-pre-line max-h-16 overflow-y-auto">
                    {details.openingHours.join("\n")}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="flex-shrink-0 flex justify-end gap-2 pt-2 border-t">
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
