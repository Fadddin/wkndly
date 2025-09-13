"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarPlus, Calendar, Trash2, Download, ExternalLink } from "lucide-react"
import { useWeekend } from "@/lib/weekend-context"
import type { SavedPlan, ActivityVibe } from "@/lib/weekend-context"

interface SavedPlansDialogProps {
  children: React.ReactNode
}

export function SavedPlansDialog({ children }: SavedPlansDialogProps) {
  const { state, dispatch } = useWeekend()
  const { savedPlans, scheduledActivities, selectedActivities, selectedTheme, userName, activityVibes } = state
  const [open, setOpen] = useState(false)
  const [planName, setPlanName] = useState("")

  const handleSavePlan = () => {
    if (!planName.trim()) return

    const newPlan: SavedPlan = {
      id: Date.now().toString(),
      name: planName.trim(),
      date: new Date().toISOString().split("T")[0],
      scheduledActivities,
      selectedActivities,
      theme: selectedTheme,
      longWeekendOption: state.longWeekendOption,
      activityVibes: activityVibes,
    }

    dispatch({ type: "ADD_SAVED_PLAN", payload: newPlan })
    try {
      const existing = JSON.parse(localStorage.getItem("weekendly-saved-plans") || "[]")
      const updated = [...existing, newPlan]
      localStorage.setItem("weekendly-saved-plans", JSON.stringify(updated))
    } catch {}
    setPlanName("")
  }

  const handleLoadPlan = (plan: SavedPlan) => {
    dispatch({ type: "SET_SELECTED_ACTIVITIES", payload: plan.selectedActivities })
    dispatch({ type: "SET_SCHEDULED_ACTIVITIES", payload: plan.scheduledActivities })
    dispatch({ type: "SET_SELECTED_THEME", payload: plan.theme })
    if (plan.activityVibes) {
      dispatch({ type: "SET_ACTIVITY_VIBES", payload: plan.activityVibes as Record<number, ActivityVibe> })
    }
    setOpen(false)
  }

  const handleDeletePlan = (planId: string) => {
    dispatch({ type: "REMOVE_SAVED_PLAN", payload: planId })
    try {
      const existing = JSON.parse(localStorage.getItem("weekendly-saved-plans") || "[]")
      const updated = (existing || []).filter((p: any) => p.id !== planId)
      localStorage.setItem("weekendly-saved-plans", JSON.stringify(updated))
    } catch {}
  }

  const canSavePlan = scheduledActivities.length > 0 || selectedActivities.length > 0

  // Calendar export functions

  const generateAppleCalendarUrl = (plan: SavedPlan) => {
    const events = plan.scheduledActivities.map((scheduledActivity) => {
      const { activity, day, timeSlot } = scheduledActivity
      
      // Convert day and time to a proper date (same logic as Google Calendar)
      const today = new Date()
      const dayOfWeek = today.getDay()
      let targetDay = 0
      
      switch (day) {
        case "friday":
          targetDay = 5
          break
        case "saturday":
          targetDay = 6
          break
        case "sunday":
          targetDay = 0
          break
        case "monday":
          targetDay = 1
          break
      }
      
      let daysUntilTarget = targetDay - dayOfWeek
      if (daysUntilTarget <= 0) daysUntilTarget += 7
      
      const eventDate = new Date(today)
      eventDate.setDate(today.getDate() + daysUntilTarget)
      
      const [time, period] = timeSlot.split(" ")
      const [hours, minutes] = time.split(":")
      let hour24 = parseInt(hours)
      if (period === "PM" && hour24 !== 12) hour24 += 12
      if (period === "AM" && hour24 === 12) hour24 = 0
      
      const startTime = new Date(eventDate)
      startTime.setHours(hour24, parseInt(minutes), 0, 0)
      
      const endTime = new Date(startTime)
      endTime.setHours(startTime.getHours() + 2)
      
      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
      }
      
      return {
        title: activity.name,
        start: formatDate(startTime),
        end: formatDate(endTime),
        description: `Location: ${activity.location}\nDuration: ${activity.duration}\nCategory: ${activity.category}`
      }
    })
    
    // Generate .ics file content
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Weekendly//Weekend Plans//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      ...events.flatMap(event => [
        "BEGIN:VEVENT",
        `UID:${Date.now()}-${Math.random().toString(36).substr(2, 9)}@weekendly.com`,
        `DTSTART:${event.start}`,
        `DTEND:${event.end}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        "STATUS:CONFIRMED",
        "SEQUENCE:0",
        "END:VEVENT"
      ]),
      "END:VCALENDAR"
    ].join("\r\n")
    
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    
    return url
  }

  const handleExportToGoogleCalendar = (plan: SavedPlan) => {
    // Google Calendar doesn't support multiple events in one URL
    // So we'll open each event in a separate tab
    if (plan.scheduledActivities.length > 1) {
      alert(`Opening ${plan.scheduledActivities.length} Google Calendar tabs for your activities. Please allow pop-ups if prompted.`)
    }
    
    plan.scheduledActivities.forEach((scheduledActivity, index) => {
      const { activity, day, timeSlot } = scheduledActivity
      
      // Convert day and time to a proper date
      const today = new Date()
      const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
      let targetDay = 0
      
      switch (day) {
        case "friday":
          targetDay = 5
          break
        case "saturday":
          targetDay = 6
          break
        case "sunday":
          targetDay = 0
          break
        case "monday":
          targetDay = 1
          break
      }
      
      // Calculate days until target day
      let daysUntilTarget = targetDay - dayOfWeek
      if (daysUntilTarget <= 0) daysUntilTarget += 7
      
      const eventDate = new Date(today)
      eventDate.setDate(today.getDate() + daysUntilTarget)
      
      // Parse time slot (e.g., "2:00 PM")
      const [time, period] = timeSlot.split(" ")
      const [hours, minutes] = time.split(":")
      let hour24 = parseInt(hours)
      if (period === "PM" && hour24 !== 12) hour24 += 12
      if (period === "AM" && hour24 === 12) hour24 = 0
      
      const startTime = new Date(eventDate)
      startTime.setHours(hour24, parseInt(minutes), 0, 0)
      
      // Estimate duration (default to 2 hours)
      const endTime = new Date(startTime)
      endTime.setHours(startTime.getHours() + 2)
      
      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
      }
      
      const title = encodeURIComponent(activity.name)
      const start = formatDate(startTime)
      const end = formatDate(endTime)
      const details = encodeURIComponent(
        `Location: ${activity.location}\nDuration: ${activity.duration}\nCategory: ${activity.category}`
      )
      
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`
      
      // Add a small delay between opening tabs to avoid browser blocking
      setTimeout(() => {
        window.open(url, "_blank")
      }, index * 100)
    })
  }

  const handleExportToAppleCalendar = (plan: SavedPlan) => {
    const url = generateAppleCalendarUrl(plan)
    const link = document.createElement("a")
    link.href = url
    link.download = `${plan.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_weekend_plan.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus className="w-5 h-5" />
            Saved Plans
          </DialogTitle>
          <DialogDescription>Save your current plan or load a previously saved one</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Save Current Plan */}
          {canSavePlan && (
            <div className="space-y-3">
              <h3 className="font-medium">Save Current Plan</h3>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="plan-name" className="sr-only">
                    Plan Name
                  </Label>
                  <Input
                    id="plan-name"
                    placeholder="Enter plan name..."
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSavePlan()}
                  />
                </div>
                <Button onClick={handleSavePlan} disabled={!planName.trim()}>
                  Save Plan
                </Button>
              </div>
            </div>
          )}

          {/* Saved Plans List */}
          <div className="space-y-3">
            <h3 className="font-medium">Your Saved Plans ({savedPlans.length})</h3>

            {savedPlans.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No saved plans yet</p>
                <p className="text-xs">Create a schedule and save it for later!</p>
              </div>
            ) : (
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {savedPlans.map((plan) => (
                  <Card key={plan.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{plan.name}</CardTitle>
                          <CardDescription className="text-sm">
                            Saved on {new Date(plan.date).toLocaleDateString()} •{plan.scheduledActivities.length}{" "}
                            activities scheduled
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleLoadPlan(plan)} className="h-8 px-2">
                            <Download className="w-3 h-3 mr-1" />
                            Load
                          </Button>
                          {plan.scheduledActivities.length > 0 && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleExportToGoogleCalendar(plan)}
                                className="h-8 px-2 hover:bg-blue-50 hover:text-blue-600"
                                title="Export to Google Calendar"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleExportToAppleCalendar(plan)}
                                className="h-8 px-2 hover:bg-gray-50 hover:text-gray-600"
                                title="Export to Apple Calendar"
                              >
                                <Calendar className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePlan(plan.id)}
                            className="h-8 px-2 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {plan.scheduledActivities.length > 0 && (
                      <CardContent className="pt-0">
                        <div className="text-xs text-muted-foreground">
                          <div className="flex flex-wrap gap-1">
                            {plan.scheduledActivities.slice(0, 3).map((sa, index) => (
                              <span key={index} className="bg-muted px-2 py-1 rounded">
                                {sa.activity.name}
                              </span>
                            ))}
                            {plan.scheduledActivities.length > 3 && (
                              <span className="px-2 py-1">+{plan.scheduledActivities.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
