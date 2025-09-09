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
import { Settings, Palette } from "lucide-react"
import { useWeekend } from "@/lib/weekend-context"
import { themes } from "@/lib/weekend-data"

interface PersonalizationDialogProps {
  children: React.ReactNode
}

export function PersonalizationDialog({ children }: PersonalizationDialogProps) {
  const { state, dispatch } = useWeekend()
  const { selectedTheme, userName, isLongWeekend, autoSave } = state
  const [open, setOpen] = useState(false)

  const handleThemeChange = (themeId: keyof typeof themes) => {
    dispatch({ type: "SET_SELECTED_THEME", payload: themeId })
  }

  const handleUserNameChange = (name: string) => {
    dispatch({ type: "SET_USER_NAME", payload: name })
  }

  const handleLongWeekendToggle = (enabled: boolean) => {
    dispatch({ type: "SET_IS_LONG_WEEKEND", payload: enabled })
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
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(themes).map(([themeId, theme]) => {
                const IconComponent = theme.icon
                return (
                  <Button
                    key={themeId}
                    variant={selectedTheme === themeId ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleThemeChange(themeId as keyof typeof themes)}
                    className="justify-start h-auto p-3"
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <div className="text-left">
                        <div className="text-sm font-medium">{theme.name}</div>
                        <div className="text-xs opacity-70">{theme.description}</div>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Long Weekend Mode</Label>
                <p className="text-sm text-muted-foreground">Include Friday and Monday</p>
              </div>
              <Switch checked={isLongWeekend} onCheckedChange={handleLongWeekendToggle} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-save</Label>
                <p className="text-sm text-muted-foreground">Automatically save your progress</p>
              </div>
              <Switch checked={autoSave} onCheckedChange={handleAutoSaveToggle} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
