"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CalendarDays, X, Clock, MapPin, Plus, Sparkles } from "lucide-react"
import { useWeekend } from "@/lib/weekend-context"
import type { ActivityVibe } from "@/lib/weekend-context"

export function SelectedActivitiesSidebar() {
  const { state, dispatch } = useWeekend()
  const { selectedActivities, activityVibes } = state
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false)
  const [customActivity, setCustomActivity] = useState({
    name: "",
    category: "outdoor",
    duration: "1-2 hours",
    location: "Local",
    mood: "Relaxing",
  })

  const handleCreateSchedule = () => {
    dispatch({ type: "SET_CURRENT_VIEW", payload: "schedule" })
  }

  const removeActivity = (activityId: number) => {
    dispatch({ type: "REMOVE_ACTIVITY", payload: activityId })
  }

  const clearAll = () => {
    selectedActivities.forEach((activity) => {
      dispatch({ type: "REMOVE_ACTIVITY", payload: activity.id })
    })
  }

  const handleCreateCustomActivity = () => {
    if (!customActivity.name.trim()) return

    const categoryColors = {
      outdoor: "bg-emerald-100 text-emerald-700",
      indoor: "bg-blue-100 text-blue-700",
      social: "bg-purple-600 text-white",
      fitness: "bg-orange-100 text-orange-700",
      creative: "bg-pink-100 text-pink-700",
      food: "bg-yellow-100 text-yellow-700",
    }

    const newActivity = {
      id: Date.now(), // Simple ID generation
      name: customActivity.name,
      category: customActivity.category,
      duration: customActivity.duration,
      location: customActivity.location,
      mood: customActivity.mood,
      icon: Sparkles, // Default icon for custom activities
      color: categoryColors[customActivity.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-700",
    }

    dispatch({ type: "ADD_ACTIVITY", payload: newActivity })
    setCustomActivity({ name: "", category: "outdoor", duration: "1-2 hours", location: "Local", mood: "Relaxing" })
    setIsCustomDialogOpen(false)
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-background to-muted/20 border-1 rounded-2xl m-2">
      <div className="flex-shrink-0 p-4 lg:p-6 border-b bg-card/80 backdrop-blur-sm shadow-sm rounded-2xl">
        <div className="flex items-center justify-between mb-3 rounded-2xl">
          <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Calendar className="w-5 h-5" />
            </div>
            Selected Activities
          </h3>
          {selectedActivities.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">
            {selectedActivities.length === 0
              ? "Choose activities to start planning"
              : `${selectedActivities.length} activities ready to schedule`}
          </p>
          <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Plus className="w-4 h-4" />
                Custom
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Create Custom Activity
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="activity-name">Activity Name</Label>
                  <Input
                    id="activity-name"
                    placeholder="e.g., Visit local art gallery"
                    value={customActivity.name}
                    onChange={(e) => setCustomActivity((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={customActivity.category}
                      onValueChange={(value) => setCustomActivity((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="outdoor">Outdoor</SelectItem>
                        <SelectItem value="indoor">Indoor</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Select
                      value={customActivity.duration}
                      onValueChange={(value) => setCustomActivity((prev) => ({ ...prev, duration: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30 min">30 min</SelectItem>
                        <SelectItem value="1-2 hours">1-2 hours</SelectItem>
                        <SelectItem value="2-4 hours">2-4 hours</SelectItem>
                        <SelectItem value="Half day">Half day</SelectItem>
                        <SelectItem value="Full day">Full day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Select
                      value={customActivity.location}
                      onValueChange={(value) => setCustomActivity((prev) => ({ ...prev, location: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Home">Home</SelectItem>
                        <SelectItem value="Local">Local</SelectItem>
                        <SelectItem value="City">City</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="mood">Mood</Label>
                    <Select
                      value={customActivity.mood}
                      onValueChange={(value) => setCustomActivity((prev) => ({ ...prev, mood: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Relaxing">Relaxing</SelectItem>
                        <SelectItem value="Energizing">Energizing</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        <SelectItem value="Adventurous">Adventurous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setIsCustomDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCustomActivity}
                    className="flex-1"
                    disabled={!customActivity.name.trim()}
                  >
                    Create Activity
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {selectedActivities.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <Calendar className="w-10 h-10 opacity-50" />
            </div>
            <p className="text-sm font-medium mb-2">No activities selected</p>
            <p className="text-xs leading-relaxed">
              Browse activities on the left or create
              <br />
              your own custom activity to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedActivities.map((activity, index) => {
              const IconComponent = activity.icon
              const hasValidIcon = IconComponent && typeof IconComponent === "function"
              const categoryAccent: Record<string, string> = {
                outdoor: "border-l-2 border-emerald-300/50 hover:border-emerald-400/60",
                food: "border-l-2 border-orange-300/50 hover:border-orange-400/60",
                entertainment: "border-l-2 border-purple-300/50 hover:border-purple-400/60",
                relaxation: "border-l-2 border-sky-300/50 hover:border-sky-400/60",
                fitness: "border-l-2 border-rose-300/50 hover:border-rose-400/60",
                social: "border-l-2 border-pink-300/50 hover:border-pink-400/60",
              }

              if (!hasValidIcon) {
                console.log("[v0] Invalid icon for activity:", activity.name, IconComponent)
              }

              return (
                <Card
                  key={activity.id}
                  className={`group hover:shadow-md transition-all duration-300 border bg-card shadow-sm ${
                    categoryAccent[activity.category] ?? ""
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="px-4">
                    <div className="flex items-start gap-2">
                      <div className={`p-2 rounded-lg ${activity.color} flex-shrink-0 shadow-sm`}>
                        {hasValidIcon ? <IconComponent className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Title + Remove Button */}
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-medium text-xs leading-snug text-foreground">{activity.name}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeActivity(activity.id)
                            }}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{activity.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>{activity.location}</span>
                            {(activity as any)?.googleMapsUrl && (
                              <a
                                href={(activity as any).googleMapsUrl as string}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-primary hover:underline"
                              >
                                Open in Maps
                              </a>
                            )}
                          </div>
                          <div className="ml-auto">
                            <select
                              className="text-[10px] border rounded px-1 py-0.5 bg-background"
                              value={activityVibes[activity.id] || ""}
                              onChange={(e) =>
                                dispatch({
                                  type: "SET_ACTIVITY_VIBE",
                                  payload: { activityId: activity.id, vibe: (e.target.value || null) as ActivityVibe | null },
                                })
                              }
                            >
                              <option value="">Vibe</option>
                              <option value="happy">Happy</option>
                              <option value="relaxed">Relaxed</option>
                              <option value="energetic">Energetic</option>
                            </select>
                          </div>
                        </div>

                        {/* Badge */}
                        <div className="mt-2">
                          <Badge
                            variant="default"
                            className="text-[10px] font-medium bg-secondary text-secondary-foreground px-2 py-0.5"
                          >
                            {activity.mood}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {selectedActivities.length > 0 && (
        <div className="flex-shrink-0 p-4 lg:p-6 border-t bg-gradient-to-t from-card/80 to-background/50 backdrop-blur-sm rounded-2xl">
          <Button
            className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
            onClick={handleCreateSchedule}
          >
            <CalendarDays className="w-5 h-5 mr-2" />
            Create Weekend Schedule
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3 leading-relaxed">
            Drag activities to time slots or click to schedule
          </p>
        </div>
      )}
    </div>
  )
}
