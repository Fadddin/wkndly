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
import { CalendarPlus, Calendar, Trash2, Download } from "lucide-react"
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
