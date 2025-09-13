"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings, Palette, Calendar } from "lucide-react"
import { useWeekend } from "@/lib/weekend-context"
import { themes } from "@/lib/weekend-data"

interface PersonalizationDialogProps {
  children: React.ReactNode
}

export function PersonalizationDialog({ children }: PersonalizationDialogProps) {
  const { state, dispatch } = useWeekend()
  const { selectedTheme, userName, longWeekendOption, autoSave } = state
  const [open, setOpen] = useState(false)

  const handleThemeChange = (themeId: keyof typeof themes) => {
    dispatch({ type: "SET_SELECTED_THEME", payload: themeId })
  }

  const handleUserNameChange = (name: string) => {
    dispatch({ type: "SET_USER_NAME", payload: name })
  }

  const handleLongWeekendOptionChange = (option: "none" | "friday" | "monday" | "both") => {
    dispatch({ type: "SET_LONG_WEEKEND_OPTION", payload: option })
  }

  const handleAutoSaveToggle = (enabled: boolean) => {
    dispatch({ type: "SET_AUTO_SAVE", payload: enabled })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Personalization
          </DialogTitle>
          <DialogDescription>Customize your weekend planning experience</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* User Name */}
          <div className="space-y-2">
            <Label htmlFor="username">Your Name</Label>
            <Input
              id="username"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => handleUserNameChange(e.target.value)}
            />
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Weekend Theme
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(themes).map(([themeId, theme]) => {
                const IconComponent = theme.icon
                return (
                  <Button
                    key={themeId}
                    variant={selectedTheme === themeId ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleThemeChange(themeId as keyof typeof themes)}
                    className="justify-start h-auto w-full p-3"
                  >
                    <div className="flex gap-2 w-full">
                      <IconComponent className="w-4 h-4 my-1 flex-shrink-0" />
                      <div className="text-left flex-1 min-w-0 overflow-hidden">
                        <div className="text-sm font-medium truncate">{theme.name}</div>
                        <div className="text-xs opacity-70 break-words whitespace-normal leading-tight line-clamp-2">{theme.description}</div>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Long Weekend Options */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Long Weekend Options
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "none", label: "Weekend Only", description: "Saturday & Sunday" },
                { value: "friday", label: "Friday Start", description: "Friday to Sunday" },
                { value: "monday", label: "Monday End", description: "Saturday to Monday" },
                { value: "both", label: "Long Weekend", description: "Friday to Monday" },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={longWeekendOption === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLongWeekendOptionChange(option.value as "none" | "friday" | "monday" | "both")}
                  className="justify-start h-auto w-full p-3"
                >
                  <div className="text-left flex-1 min-w-0 overflow-hidden">
                    <div className="text-sm font-medium truncate">{option.label}</div>
                    <div className="text-xs opacity-70 break-words whitespace-normal leading-tight line-clamp-2">{option.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}