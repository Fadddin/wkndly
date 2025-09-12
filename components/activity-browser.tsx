"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus } from "lucide-react"
import { PlaceSearchDialog } from "@/components/place-search-dialog"
import { useWeekend } from "@/lib/weekend-context"
import { activities, categories, themes } from "@/lib/weekend-data"
import { toast } from "@/hooks/use-toast"

export function ActivityBrowser() {
  const { state, dispatch } = useWeekend()
  const { selectedActivities, searchQuery, selectedCategory, selectedTheme } = state

  const currentTheme = themes[selectedTheme]

  const getBackgroundImageForActivity = (activityName: string) => {
    const name = activityName.toLowerCase()
    if (name.includes("hike")) return "/Doodles/hikeDoodle.jpg"
    if (name.includes("picnic")) return "/Doodles/picnicDoodle.jpg"
    if (name.includes("beach")) return "/Doodles/beachDoodle.jpg"
    if (name.includes("cycl")) return "/Doodles/cycleDoodle.jpg"
    if (name.includes("photograph")) return "/Doodles/photographyDoodle.jpg"
    if (name.includes("brunch")) return "/Doodles/foodMarketDoodle.jpg"
    if (name.includes("cooking")) return "/Doodles/cookingDoodle.jpg"
    if (name.includes("market")) return "/Doodles/foodMarketDoodle.jpg"
    if (name.includes("wine")) return "/Doodles/wineTastingDoodle.jpg"
    if (name.includes("movie")) return "/Doodles/movieDoodle.webp"
    if (name.includes("concert")) return "/Doodles/concertDoodle.jpg"
    if (name.includes("board game")) return "/Doodles/boardGameDoodle.jpg"
    if (name.includes("game night")) return "/Doodles/gameNightDoodle.png"
    if (name.includes("art gallery")) return "/Doodles/artGalleryDoodle.jpg"
    if (name.includes("spa")) return "/Doodles/spaDoodle.png"
    if (name.includes("reading")) return "/Doodles/readingDoodle.jpg"
    if (name.includes("yoga") || name.includes("meditation")) return "/Doodles/meditationAndYogaDoodle.jpg"
    if (name.includes("coffee")) return "/Doodles/coffeeShopDoodle.jpg"
    if (name.includes("gym")) return "/Doodles/gymDoodle.jpg"
    if (name.includes("climbing")) return "/Doodles/rockClimbingDoodle.jpg"
    if (name.includes("swim")) return "/Doodles/swimmingDoodle.jpg"
    if (name.includes("family")) return "/Doodles/familyDoodle.jpg"
    if (name.includes("double date")) return "/Doodles/doubleDateDoodle.jpg"
    if (name.includes("weekend trip") || name.includes("trip")) return "/Doodles/weekendTripDoodle.jpg"
    return undefined
  }

  const categoryAccent: Record<string, string> = {
    outdoor: "border-l-2 border-emerald-300/50 hover:border-emerald-400/60",
    food: "border-l-2 border-orange-300/50 hover:border-orange-400/60",
    entertainment: "border-l-2 border-purple-300/50 hover:border-purple-400/60",
    relaxation: "border-l-2 border-sky-300/50 hover:border-sky-400/60",
    fitness: "border-l-2 border-rose-300/50 hover:border-rose-400/60",
    social: "border-l-2 border-pink-300/50 hover:border-pink-400/60",
  }

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || activity.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const getRecommendedActivities = useMemo(() => {
    return activities.filter((activity) => currentTheme.suggestedMoods.includes(activity.mood))
  }, [currentTheme.suggestedMoods])

  const addRecommendedActivities = () => {
    let addedCount = 0
    getRecommendedActivities.forEach((activity) => {
      if (!selectedActivities.find((a) => a.id === activity.id)) {
        dispatch({ type: "ADD_ACTIVITY", payload: activity })
        addedCount += 1
      }
    })
    return addedCount
  }

  const handleAddPicksClick = () => {
    const added = addRecommendedActivities()
    toast({
      title: added > 0 ? `Added ${added} ${added === 1 ? "pick" : "picks"}` : "You're all set",
      description:
        added > 0
          ? `Recommended activities for ${currentTheme.name} were added to your plan.`
          : `All ${currentTheme.name} picks are already in your plan.`,
    })
  }

  const toggleActivity = (activity: (typeof activities)[0]) => {
    const isSelected = selectedActivities.find((a) => a.id === activity.id)
    if (isSelected) {
      dispatch({ type: "REMOVE_ACTIVITY", payload: activity.id })
    } else {
      dispatch({ type: "ADD_ACTIVITY", payload: activity })
    }
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      {/* Header section */}
      <div className="flex-shrink-0 p-4 lg:p-6 space-y-4 border-b bg-background/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Browse Activities</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddPicksClick}
              className="transition-transform active:scale-95"
            >
              <currentTheme.icon className="w-4 h-4 mr-2" />
              Add {currentTheme.name.split(" ")[0]} Picks
            </Button>
            
          </div>
        </div>

        {getRecommendedActivities.length > 0 && (
          <>
            {/* Compact banner for small/laptop screens */}
            <div className="xl:hidden flex items-center justify-between rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2 text-sm">
                <currentTheme.icon className="w-4 h-4" />
                <span>{getRecommendedActivities.length} recommended for {currentTheme.name}</span>
              </div>
              {/* <Button variant="outline" size="sm" onClick={addRecommendedActivities}>
                Add Picks
              </Button> */}
            </div>

            {/* Full card only on very large screens */}
            <Card className="border-primary bg-card hidden xl:block">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-foreground">
                  <currentTheme.icon className="w-4 h-4" />
                  Recommended for {currentTheme.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Activities that match your {currentTheme.description.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                  {getRecommendedActivities.slice(0, 8).map((activity) => {
                    const IconComponent = activity.icon
                    const isSelected = selectedActivities.find((a) => a.id === activity.id)
                    return (
                      <Badge
                        key={activity.id}
                        variant={isSelected ? "default" : "secondary"}
                        className="cursor-pointer hover:bg-primary/80 gap-1 whitespace-nowrap"
                        onClick={() => toggleActivity(activity)}
                      >
                        <IconComponent className="w-3 h-3" />
                        {activity.name}
                      </Badge>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Category Tabs */}
        <Tabs
          value={selectedCategory}
          onValueChange={(value) => dispatch({ type: "SET_SELECTED_CATEGORY", payload: value })}
        >
          <TabsList className="flex w-full max-w-full overflow-x-auto no-scrollbar gap-1 lg:grid lg:grid-cols-7 lg:gap-0">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs whitespace-nowrap flex-shrink-0">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Activity grid */}
      <div className="flex-1 p-3 sm:p-4 lg:p-6 min-h-0">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {filteredActivities.map((activity) => {
            const IconComponent = activity.icon
            const isSelected = selectedActivities.find((a) => a.id === activity.id)
            const isRecommended = currentTheme.suggestedMoods.includes(activity.mood)

            return (
              <Card
                key={activity.id}
                className={`relative cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] border bg-card overflow-hidden ${
                  isSelected ? "ring-2 ring-primary" : ""
                } ${categoryAccent[activity.category] ?? ""} ${isRecommended ? "ring-1 ring-primary/30" : ""}`}
                onClick={() => toggleActivity(activity)}
              >
                {getBackgroundImageForActivity(activity.name) && (
                  <div className="absolute inset-0 pointer-events-none select-none">
                    <div
                      className="h-full w-full bg-center bg-cover opacity-10"
                      style={{ backgroundImage: `url(${getBackgroundImageForActivity(activity.name)})` }}
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${activity.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {activity.name}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                        </CardDescription>
                      </div>
                    </div>
                    {isSelected && (
                      <Badge variant="default">
                        Selected
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      {activity.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <PlaceSearchDialog activity={activity}>
                        view
                        <button
                          className="underline underline-offset-2 hover:text-primary mx-1"
                          onMouseDown={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          {activity.location}
                        </button>
                        in your location
                      </PlaceSearchDialog>
                      {(activity as any)?.googleMapsUrl && (
                        <a
                          href={(activity as any).googleMapsUrl as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-primary"
                          onMouseDown={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          Open in Maps
                        </a>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activity.mood}
                  </Badge>
                  {isRecommended && (
                    <Badge
                      variant="outline"
                      className="text-xs text-primary border-primary absolute bottom-3 right-3"
                    >
                      Recommended
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
