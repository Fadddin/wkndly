"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, Share2, CalendarPlus, Menu } from "lucide-react"
import { WeekendProvider, useWeekend } from "@/lib/weekend-context"
import { themes, getUpcomingHolidays } from "@/lib/weekend-data"
import { ActivityBrowser } from "@/components/activity-browser"
import { SelectedActivitiesSidebar } from "@/components/selected-activities-sidebar"
import { WeekendSchedule } from "@/components/weekend-schedule"
import { PersonalizationDialog } from "@/components/personalization-dialog"
import { EnhancedShareDialog } from "@/components/enhanced-share-dialog"
import { SavedPlansDialog } from "@/components/saved-plans-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function WeekendlyAppContent() {
  const { state, dispatch } = useWeekend()
  const { currentView, selectedTheme, userName, selectedActivities } = state

  const currentTheme = themes[selectedTheme]
  const upcomingHolidays = getUpcomingHolidays()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
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
                  className="lg:hidden px-2 py-1 h-7 text-xs border"
                >
                  <ArrowLeft className="w-3 h-3 mr-1" />
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
              <div className="hidden sm:flex items-center gap-2">
                <SavedPlansDialog>
                  <Button variant="outline" size="sm">
                    <CalendarPlus className="w-4 h-4 mr-2" />
                    <span>Saved Plans</span>
                  </Button>
                </SavedPlansDialog>

                <EnhancedShareDialog>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    <span>Share</span>
                  </Button>
                </EnhancedShareDialog>

                <PersonalizationDialog>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    <span>Settings</span>
                  </Button>
                </PersonalizationDialog>

                <ThemeToggle />
              </div>

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

              {/* Mobile: Hamburger menu for remaining actions */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="sm:hidden">
                    <Menu className="w-4 h-4 mr-2" />
                    Menu
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-4 w-64">
                  <div className="flex flex-col gap-2">
                    <SavedPlansDialog>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarPlus className="w-4 h-4 mr-2" />
                        Saved Plans
                      </Button>
                    </SavedPlansDialog>
                    <EnhancedShareDialog>
                      <Button variant="outline" className="w-full justify-start">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </EnhancedShareDialog>
                    <PersonalizationDialog>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </PersonalizationDialog>
                    <div className="pt-2">
                      <ThemeToggle />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {currentView === "browse" ? (
          <>
            {/* Activity Browser - Fixed height with scroll */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
              <div className="flex-1 lg:flex-[3] h-screen overflow-hidden">
                <ActivityBrowser />
              </div>

              {/* Selected Activities Sidebar - Fixed position on larger screens */}
              <div className="hidden lg:block lg:flex-[1] bg-card/50 backdrop-blur-sm h-screen overflow-y-auto">
                <SelectedActivitiesSidebar />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-auto mb-4">
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
