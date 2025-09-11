"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, Share2, CalendarPlus } from "lucide-react"
import { WeekendProvider, useWeekend } from "@/lib/weekend-context"
import { themes, getUpcomingHolidays } from "@/lib/weekend-data"
import { ActivityBrowser } from "@/components/activity-browser"
import { SelectedActivitiesSidebar } from "@/components/selected-activities-sidebar"
import { WeekendSchedule } from "@/components/weekend-schedule"
import { PersonalizationDialog } from "@/components/personalization-dialog"
import { ExportShareDialog } from "@/components/export-share-dialog"
import { SavedPlansDialog } from "@/components/saved-plans-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function WeekendlyAppContent() {
  const { state, dispatch } = useWeekend()
  const { currentView, selectedTheme, userName, selectedActivities } = state

  const currentTheme = themes[selectedTheme]
  const upcomingHolidays = getUpcomingHolidays()

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50 flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentView === "schedule" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch({ type: "SET_CURRENT_VIEW", payload: "browse" })}
                  className="lg:hidden"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Weekendly
                </h1>
                <p className="text-sm text-muted-foreground">
                  {userName ? `Welcome back, ${userName}!` : "Plan your perfect weekend"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Holiday Notice */}
              {upcomingHolidays.length > 0 && (
                <div className="hidden md:block text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  🎉 {upcomingHolidays[0].name} coming up on {upcomingHolidays[0].date}
                </div>
              )}

              {/* Action Buttons */}
              <SavedPlansDialog>
                <Button variant="outline" size="sm">
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Saved Plans</span>
                </Button>
              </SavedPlansDialog>

              <ExportShareDialog>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </ExportShareDialog>

              {/* Mobile: Selected Activities Drawer */}
              {currentView === "browse" && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="sm:hidden">
                      Selected ({selectedActivities.length})
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="p-0">
                    <SelectedActivitiesSidebar />
                  </SheetContent>
                </Sheet>
              )}

              <PersonalizationDialog>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </PersonalizationDialog>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {currentView === "browse" ? (
          <>
            {/* Activity Browser - Full height with scroll */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <div className="flex-1 lg:flex-[3] overflow-hidden">
                <ActivityBrowser />
              </div>

              {/* Selected Activities Sidebar - Fixed position on larger screens */}
              <div className="hidden lg:block lg:flex-[1] bg-card/50 backdrop-blur-sm pb-4">
                <SelectedActivitiesSidebar />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-auto ">
            <WeekendSchedule />
          </div>
        )}
      </div>
    </div>
  )
}

export default function WeekendlyApp() {
  return (
    <WeekendProvider>
      <WeekendlyAppContent />
    </WeekendProvider>
  )
}
