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
}

export function PlaceSearchDialog({
  activity,
  children,
}: {
  activity: any
  children: React.ReactNode
}) {
  const { dispatch } = useWeekend()
  const [open, setOpen] = useState(false)
  const [region, setRegion] = useState("")
  const [query, setQuery] = useState(activity?.name || "")
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
    const cloned = {
      ...activity,
      location: selectedPlace.address,
      name: `${activity.name} @ ${selectedPlace.name}`,
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
