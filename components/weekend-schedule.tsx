"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, GripVertical, ArrowLeft, Smartphone } from "lucide-react"
import { useWeekend } from "@/lib/weekend-context"
import type { ActivityVibe } from "@/lib/weekend-context"
import { getTimeSlots, getWeekendDays } from "@/lib/weekend-data"
import type { WeekendDay } from "@/lib/weekend-context"
import { SavedPlansDialog } from "@/components/saved-plans-dialog"

export function WeekendSchedule() {
  const { state, dispatch } = useWeekend()
  const { scheduledActivities, selectedActivities, draggedActivity, dragOverSlot, isLongWeekend, activityVibes } = state
  
  // Mobile-specific state
  const [selectedActivityForPlacement, setSelectedActivityForPlacement] = useState<typeof selectedActivities[0] | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile vs desktop
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const categoryAccent: Record<string, string> = {
    outdoor: "border-l-2 border-outdoor/50 hover:border-outdoor/60",
    food: "border-l-2 border-food/50 hover:border-food/60",
    entertainment: "border-l-2 border-entertainment/50 hover:border-entertainment/60",
    relaxation: "border-l-2 border-relaxation/50 hover:border-relaxation/60",
    fitness: "border-l-2 border-fitness/50 hover:border-fitness/60",
    social: "border-l-2 border-social/50 hover:border-social/60",
  }

  const timeSlots = getTimeSlots(isLongWeekend)
  const weekendDays = getWeekendDays(isLongWeekend)

  const getScheduledActivity = (day: WeekendDay, timeSlot: string) => {
    return scheduledActivities.find((sa) => sa.day === day && sa.timeSlot === timeSlot)
  }

  // Mobile: Handle activity selection
  const handleActivityClick = (activity: typeof selectedActivities[0]) => {
    if (isMobile) {
      setSelectedActivityForPlacement(activity)
    }
  }

  // Mobile: Handle slot click
  const handleSlotClick = (day: WeekendDay, timeSlot: string) => {
    if (isMobile && selectedActivityForPlacement) {
      // Check if there's already an activity in this slot
      const existingActivity = getScheduledActivity(day, timeSlot)

      if (existingActivity && existingActivity.activity.id !== selectedActivityForPlacement.id) {
        // Swap activities
        const selectedScheduled = scheduledActivities.find((sa) => sa.activity.id === selectedActivityForPlacement.id)
        if (selectedScheduled) {
          // Update existing activity to selected activity's old position
          dispatch({
            type: "SCHEDULE_ACTIVITY",
            payload: {
              activity: existingActivity.activity,
              day: selectedScheduled.day,
              timeSlot: selectedScheduled.timeSlot,
            },
          })
        }
      }

      // Schedule the selected activity
      dispatch({
        type: "SCHEDULE_ACTIVITY",
        payload: { activity: selectedActivityForPlacement, day, timeSlot },
      })
      
      // Clear selection
      setSelectedActivityForPlacement(null)
    }
  }

  // Desktop: Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, activity: (typeof selectedActivities)[0]) => {
    if (!isMobile) {
      dispatch({ type: "SET_DRAGGED_ACTIVITY", payload: activity })
      e.dataTransfer.effectAllowed = "move"
    }
  }

  const handleDragEnd = () => {
    if (!isMobile) {
      dispatch({ type: "SET_DRAGGED_ACTIVITY", payload: null })
      dispatch({ type: "SET_DRAG_OVER_SLOT", payload: null })
    }
  }

  const handleDragOver = (e: React.DragEvent, day: WeekendDay, timeSlot: string) => {
    if (!isMobile) {
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
      dispatch({ type: "SET_DRAG_OVER_SLOT", payload: { day, timeSlot } })
    }
  }

  const handleDragLeave = () => {
    if (!isMobile) {
      dispatch({ type: "SET_DRAG_OVER_SLOT", payload: null })
    }
  }

  const handleDrop = (e: React.DragEvent, day: WeekendDay, timeSlot: string) => {
    if (!isMobile) {
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
  }

  const removeFromSchedule = (activityId: number) => {
    dispatch({ type: "REMOVE_FROM_SCHEDULE", payload: activityId })
    // Clear mobile selection if removing the selected activity
    if (selectedActivityForPlacement?.id === activityId) {
      setSelectedActivityForPlacement(null)
    }
  }

  const clearSchedule = () => {
    dispatch({ type: "CLEAR_SCHEDULE" })
    setSelectedActivityForPlacement(null)
  }

  const goBackToBrowse = () => {
    dispatch({ type: "SET_CURRENT_VIEW", payload: "browse" })
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      {/* Available Activities - Mobile Horizontal Bar */}
      {selectedActivities.length > 0 && (
        <div className="md:hidden border-b border-border bg-card">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground text-sm">Available Activities</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedActivityForPlacement ? 'Now tap a time slot to place it' : 'Tap an activity to select, then tap a time slot'}
            </p>
            {selectedActivityForPlacement && (
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  Selected: {selectedActivityForPlacement.name}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedActivityForPlacement(null)}
                  className="ml-2 h-5 px-2 text-xs border border-red-500 border-dashed"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-3 p-4 pb-6" style={{ width: "max-content" }}>
              {selectedActivities.map((activity) => {
                const IconComponent = activity.icon
                const isScheduled = scheduledActivities.find((sa) => sa.activity.id === activity.id)
                const isSelected = selectedActivityForPlacement?.id === activity.id

                return (
                  <div
                    key={activity.id}
                    className={`flex flex-col items-center gap-2 p-3 border rounded-xl cursor-pointer transition-all hover:shadow-sm hover:scale-[1.02] w-[120px] ${
                      isSelected 
                        ? "bg-primary/20 border-primary ring-2 ring-primary/30" 
                        : isScheduled 
                        ? "bg-primary/5 border-primary" 
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => handleActivityClick(activity)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${activity.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-center w-full overflow-hidden">
                      <p className="text-xs font-medium truncate">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">{activity.duration}</p>
                      {/* <p className="text-xs text-muted-foreground break-all leading-tight overflow-hidden">{activity.location}</p> */}
                      {isScheduled && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {weekendDays.find((d) => d.key === isScheduled.day)?.name.slice(0, 3)} {isScheduled.timeSlot.slice(0, 5)}
                        </Badge>
                      )}
                      
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Available Activities Sidebar - Desktop */}
      {selectedActivities.length > 0 && (
        <div className="hidden md:flex w-80 border-r border-border bg-card flex-col">
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
                  <GripVertical className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <div className={`p-1.5 rounded ${activity.color} flex-shrink-0`}>
                    <IconComponent className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-sm font-medium truncate">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">{activity.duration}</p>
                    <p className="text-xs text-muted-foreground break-all leading-tight overflow-hidden">{activity.location}</p>
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
        <div className="p-4 md:p-6 border-b border-border bg-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* <Button
                variant="outline"
                size="sm"
                onClick={goBackToBrowse}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button> */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">Weekend Schedule</h2>
                <p className="text-sm text-muted-foreground">
                  {isMobile ? 'Tap activities then tap time slots to schedule' : 'Drag activities to time slots to schedule them'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <SavedPlansDialog>
                <Button variant="outline" size="sm">
                  Save Plan
                </Button>
              </SavedPlansDialog>
              <Button variant="outline" onClick={clearSchedule} size="sm">
                Clear Schedule
              </Button>
            </div>
          </div>
        </div>

        {/* Weekend Grid - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div
            className={`grid gap-4 md:gap-6 ${
              isLongWeekend 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4" 
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
            }`}
          >
            {weekendDays.map((day) => (
              <Card key={day.id} className="h-fit w-full min-w-0">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="w-4 h-4" />
                    {day.name}
                  </CardTitle>
                  <CardDescription>
                    {scheduledActivities.filter((sa) => sa.day === day.key).length} activities scheduled
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 min-w-0">
                  {timeSlots.map((timeSlot) => {
                    const scheduledActivity = getScheduledActivity(day.key, timeSlot)
                    const isDragOver = !isMobile && dragOverSlot?.day === day.key && dragOverSlot?.timeSlot === timeSlot
                    const isClickTarget = isMobile && selectedActivityForPlacement && !scheduledActivity

                    return (
                      <div
                        key={timeSlot}
                        className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 border rounded-lg min-h-[50px] md:min-h-[60px] transition-all ${
                          isDragOver 
                            ? "border-primary bg-primary/10 border-dashed" 
                            : isClickTarget 
                            ? "border-primary/50 bg-primary/5 cursor-pointer hover:border-primary hover:bg-primary/10" 
                            : "border-border"
                        }`}
                        onDragOver={(e) => handleDragOver(e, day.key, timeSlot)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, day.key, timeSlot)}
                        onClick={() => handleSlotClick(day.key, timeSlot)}
                      >
                        <div className="w-12 md:w-16 text-xs font-medium text-muted-foreground flex-shrink-0">{timeSlot}</div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          {scheduledActivity ? (
                            <div
                              className={`flex items-center gap-2 md:gap-3 p-1 rounded border bg-card ${
                                isMobile ? "cursor-pointer" : "cursor-move"
                              } ${categoryAccent[scheduledActivity.activity.category] ?? ""}`}
                              draggable={!isMobile}
                              onDragStart={(e) => handleDragStart(e, scheduledActivity.activity)}
                              onDragEnd={handleDragEnd}
                            >
                              {!isMobile && <GripVertical className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                              <div className={`p-1.5 rounded ${scheduledActivity.activity.color} flex-shrink-0`}>
                                <scheduledActivity.activity.icon className="w-3 h-3" />
                              </div>
                              <div className="flex-1 min-w-0 overflow-hidden">
                                <p className="text-xs md:text-sm font-medium truncate">{scheduledActivity.activity.name}</p>
                                <div className="text-xs text-muted-foreground">
                                  <span>{scheduledActivity.activity.duration}</span>
                                  <div className="break-all leading-tight overflow-hidden">• {scheduledActivity.activity.location}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                                <select
                                  className="text-xs border rounded px-1 py-0.5 bg-background hidden md:block"
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
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeFromSchedule(scheduledActivity.activity.id)
                                  }}
                                  className="h-5 w-5 md:h-6 md:w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                                >
                                  ×
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className={`text-xs md:text-sm text-muted-foreground italic ${
                              isDragOver 
                                ? "text-primary" 
                                : isClickTarget 
                                ? "text-primary font-medium" 
                                : ""
                            }`}>
                              {isDragOver 
                                ? "Drop activity here" 
                                : isClickTarget 
                                ? "Tap to place here" 
                                : "Available time slot"}
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