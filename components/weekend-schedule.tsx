"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, GripVertical, ArrowLeft } from "lucide-react"
import { useWeekend } from "@/lib/weekend-context"
import type { ActivityVibe } from "@/lib/weekend-context"
import { getTimeSlots, getWeekendDays } from "@/lib/weekend-data"
import type { WeekendDay } from "@/lib/weekend-context"
import { SavedPlansDialog } from "@/components/saved-plans-dialog"

export function WeekendSchedule() {
  const { state, dispatch } = useWeekend()
  const { scheduledActivities, selectedActivities, draggedActivity, dragOverSlot, isLongWeekend, activityVibes } = state
  const categoryAccent: Record<string, string> = {
    outdoor: "border-l-2 border-emerald-300/50 hover:border-emerald-400/60",
    food: "border-l-2 border-orange-300/50 hover:border-orange-400/60",
    entertainment: "border-l-2 border-purple-300/50 hover:border-purple-400/60",
    relaxation: "border-l-2 border-sky-300/50 hover:border-sky-400/60",
    fitness: "border-l-2 border-rose-300/50 hover:border-rose-400/60",
    social: "border-l-2 border-pink-300/50 hover:border-pink-400/60",
  }

  const timeSlots = getTimeSlots(isLongWeekend)
  const weekendDays = getWeekendDays(isLongWeekend)

  const getScheduledActivity = (day: WeekendDay, timeSlot: string) => {
    return scheduledActivities.find((sa) => sa.day === day && sa.timeSlot === timeSlot)
  }

  const handleDragStart = (e: React.DragEvent, activity: (typeof selectedActivities)[0]) => {
    dispatch({ type: "SET_DRAGGED_ACTIVITY", payload: activity })
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    dispatch({ type: "SET_DRAGGED_ACTIVITY", payload: null })
    dispatch({ type: "SET_DRAG_OVER_SLOT", payload: null })
  }

  const handleDragOver = (e: React.DragEvent, day: WeekendDay, timeSlot: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    dispatch({ type: "SET_DRAG_OVER_SLOT", payload: { day, timeSlot } })
  }

  const handleDragLeave = () => {
    dispatch({ type: "SET_DRAG_OVER_SLOT", payload: null })
  }

  const handleDrop = (e: React.DragEvent, day: WeekendDay, timeSlot: string) => {
    e.preventDefault()
    if (draggedActivity) {
      // Check if there's already an activity in this slot
      const existingActivity = getScheduledActivity(day, timeSlot)

      if (existingActivity && existingActivity.activity.id !== draggedActivity.id) {
        // Swap activities
        const draggedScheduled = scheduledActivities.find((sa) => sa.activity.id === draggedActivity.id)
        if (draggedScheduled) {
          // Update existing activity to dragged activity's old position
          dispatch({
            type: "SCHEDULE_ACTIVITY",
            payload: {
              activity: existingActivity.activity,
              day: draggedScheduled.day,
              timeSlot: draggedScheduled.timeSlot,
            },
          })
        }
      }

      // Schedule the dragged activity
      dispatch({
        type: "SCHEDULE_ACTIVITY",
        payload: { activity: draggedActivity, day, timeSlot },
      })
    }
    dispatch({ type: "SET_DRAG_OVER_SLOT", payload: null })
  }

  const removeFromSchedule = (activityId: number) => {
    dispatch({ type: "REMOVE_FROM_SCHEDULE", payload: activityId })
  }

  const clearSchedule = () => {
    dispatch({ type: "CLEAR_SCHEDULE" })
  }

  const goBackToBrowse = () => {
    dispatch({ type: "SET_CURRENT_VIEW", payload: "browse" })
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Available Activities Sidebar */}
      {selectedActivities.length > 0 && (
        <div className="w-80 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Available Activities</h3>
            <p className="text-sm text-muted-foreground">Drag to schedule or click to quick-add</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {selectedActivities.map((activity) => {
              const IconComponent = activity.icon
              const isScheduled = scheduledActivities.find((sa) => sa.activity.id === activity.id)
              const isDragging = draggedActivity?.id === activity.id

              return (
                <div
                  key={activity.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-move transition-all hover:shadow-sm hover:scale-[1.02] ${
                    isScheduled ? "bg-primary/5 border-primary" : "hover:border-primary/50"
                  } ${isDragging ? "opacity-50 scale-95" : ""}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, activity)}
                  onDragEnd={handleDragEnd}
                >
                  <GripVertical className="w-3 h-3 text-muted-foreground" />
                  <div className={`p-1.5 rounded ${activity.color}`}>
                    <IconComponent className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">{activity.duration}</p>
                  </div>
                  {isScheduled && (
                    <Badge variant="secondary" className="text-xs">
                      {weekendDays.find((d) => d.key === isScheduled.day)?.name.slice(0, 3)} {isScheduled.timeSlot}
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Schedule Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Schedule Header */}
        <div className="p-6 border-b border-border bg-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={goBackToBrowse}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Weekend Schedule</h2>
                <p className="text-muted-foreground">Drag activities to time slots to schedule them</p>
              </div>
            </div>
            <div className="flex gap-2">
              <SavedPlansDialog>
                <Button variant="outline" size="sm">
                  Save Plan
                </Button>
              </SavedPlansDialog>
              <Button variant="outline" onClick={clearSchedule}>
                Clear Schedule
              </Button>
            </div>
          </div>
        </div>

        {/* Weekend Grid - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div
            className={`grid gap-6 ${isLongWeekend ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-4" : "grid-cols-1 lg:grid-cols-2"}`}
          >
            {weekendDays.map((day) => (
              <Card key={day.id} className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {day.name}
                  </CardTitle>
                  <CardDescription>
                    {scheduledActivities.filter((sa) => sa.day === day.key).length} activities scheduled
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {timeSlots.map((timeSlot) => {
                    const scheduledActivity = getScheduledActivity(day.key, timeSlot)
                    const isDragOver = dragOverSlot?.day === day.key && dragOverSlot?.timeSlot === timeSlot

                    return (
                      <div
                        key={timeSlot}
                        className={`flex items-center gap-3 p-3 border rounded-lg min-h-[60px] transition-all ${
                          isDragOver ? "border-primary bg-primary/10 border-dashed" : "border-border"
                        }`}
                        onDragOver={(e) => handleDragOver(e, day.key, timeSlot)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, day.key, timeSlot)}
                      >
                        <div className="w-16 text-xs font-medium text-muted-foreground">{timeSlot}</div>
                        <div className="flex-1">
                          {scheduledActivity ? (
                            <div
                              className={`flex items-center gap-3 cursor-move p-1 rounded border bg-card ${
                                categoryAccent[scheduledActivity.activity.category] ?? ""
                              }`}
                              draggable
                              onDragStart={(e) => handleDragStart(e, scheduledActivity.activity)}
                              onDragEnd={handleDragEnd}
                            >
                              <GripVertical className="w-3 h-3 text-muted-foreground" />
                              <div className={`p-1.5 rounded ${scheduledActivity.activity.color}`}>
                                <scheduledActivity.activity.icon className="w-3 h-3" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{scheduledActivity.activity.name}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{scheduledActivity.activity.duration}</span>
                                  {(scheduledActivity.activity as any)?.googleMapsUrl ? (
                                    <>
                                      <span>•</span>
                                      <a
                                        href={(scheduledActivity.activity as any).googleMapsUrl as string}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                      >
                                        {scheduledActivity.activity.location}
                                      </a>
                                    </>
                                  ) : (
                                    <span>{scheduledActivity.activity.location}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <select
                                  className="text-xs border rounded px-1 py-0.5 bg-background"
                                  value={activityVibes[scheduledActivity.activity.id] || ""}
                                  onChange={(e) =>
                                    dispatch({
                                      type: "SET_ACTIVITY_VIBE",
                                      payload: {
                                        activityId: scheduledActivity.activity.id,
                                        vibe: (e.target.value || null) as ActivityVibe | null,
                                      },
                                    })
                                  }
                                >
                                  <option value="">Vibe</option>
                                  <option value="happy">Happy</option>
                                  <option value="relaxed">Relaxed</option>
                                  <option value="energetic">Energetic</option>
                                </select>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromSchedule(scheduledActivity.activity.id)}
                                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                              >
                                ×
                              </Button>
                            </div>
                          ) : (
                            <div className={`text-sm text-muted-foreground italic ${isDragOver ? "text-primary" : ""}`}>
                              {isDragOver ? "Drop activity here" : "Available time slot"}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
