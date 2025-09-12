"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Share2, Download, Image, Palette, Calendar, Loader2 } from "lucide-react"
import { useWeekend } from "@/lib/weekend-context"
import type { SavedPlan } from "@/lib/weekend-context"
import { getWeekendDays } from "@/lib/weekend-data"
import html2canvas from "html2canvas"

interface EnhancedShareDialogProps {
  children: React.ReactNode
}

type PosterFormat = "elegant" | "standard" | "fun" | "classy"

const posterFormats: { value: PosterFormat; label: string; description: string }[] = [
  { value: "elegant", label: "Elegant", description: "Clean, minimalist design with sophisticated typography" },
  { value: "standard", label: "Standard", description: "Professional layout with clear structure" },
  { value: "fun", label: "Fun", description: "Colorful and playful with emojis and vibrant colors" },
  { value: "classy", label: "Classy", description: "Refined design with premium feel and elegant spacing" },
]

export function EnhancedShareDialog({ children }: EnhancedShareDialogProps) {
  const { state } = useWeekend()
  const { savedPlans, userName, isLongWeekend } = state
  const [open, setOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<SavedPlan | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<PosterFormat>("elegant")
  const [isGenerating, setIsGenerating] = useState(false)
  const posterRef = useRef<HTMLDivElement>(null)

  const weekendDays = getWeekendDays(isLongWeekend)

  const generatePoster = async () => {
    if (!selectedPlan || !posterRef.current) return

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
      })

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `${selectedPlan.name}-weekend-poster-${selectedFormat}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      }, "image/png")
    } catch (error) {
      console.error("Error generating poster:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const sharePoster = async () => {
    if (!selectedPlan || !posterRef.current) return

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
      })

      canvas.toBlob(async (blob) => {
        if (blob && navigator.share) {
          try {
            const file = new File([blob], `${selectedPlan.name}-weekend-poster.png`, { type: "image/png" })
            await navigator.share({
              title: `${selectedPlan.name} - Weekend Plan`,
              text: `Check out my weekend plan!`,
              files: [file],
            })
          } catch (error) {
            console.error("Error sharing:", error)
            // Fallback to download
            generatePoster()
          }
        } else {
          // Fallback to download
          generatePoster()
        }
      }, "image/png")
    } catch (error) {
      console.error("Error generating poster:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getPosterStyles = (format: PosterFormat) => {
    switch (format) {
      case "elegant":
        return {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#ffffff",
          fontFamily: "serif",
          border: "none",
        }
      case "standard":
        return {
          background: "#ffffff",
          color: "#1f2937",
          fontFamily: "sans-serif",
          border: "2px solid #e5e7eb",
        }
      case "fun":
        return {
          background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)",
          backgroundSize: "400% 400%",
          color: "#ffffff",
          fontFamily: "cursive",
          border: "none",
        }
      case "classy":
        return {
          background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
          color: "#ecf0f1",
          fontFamily: "serif",
          border: "3px solid #bdc3c7",
        }
      default:
        return {
          background: "#ffffff",
          color: "#1f2937",
          fontFamily: "sans-serif",
          border: "2px solid #e5e7eb",
        }
    }
  }

  const renderPoster = () => {
    if (!selectedPlan) return null

    const styles = getPosterStyles(selectedFormat)
    const activities = selectedPlan.scheduledActivities

    return (
      <div
        ref={posterRef}
        className="w-full max-w-md mx-auto p-8 rounded-lg shadow-lg"
        style={{
          background: styles.background,
          color: styles.color,
          fontFamily: styles.fontFamily,
          border: styles.border,
          minHeight: "600px",
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {selectedFormat === "fun" && "🎉 "}
            {selectedPlan.name}
            {selectedFormat === "fun" && " 🎉"}
          </h1>
          <p className="text-lg opacity-90">
            {selectedFormat === "fun" && "✨ "}
            Weekend Plan
            {selectedFormat === "fun" && " ✨"}
          </p>
          {userName && (
            <p className="text-sm opacity-75 mt-2">
              Created by {userName}
            </p>
          )}
        </div>

        {/* Schedule */}
        <div className="space-y-6">
          {weekendDays.map((day) => {
            const dayActivities = activities
              .filter((sa) => sa.day === day.key)
              .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))

            if (dayActivities.length === 0) return null

            return (
              <div key={day.key} className="space-y-3">
                <h2 className="text-xl font-semibold border-b pb-2">
                  {selectedFormat === "fun" && "📅 "}
                  {day.name}
                  {selectedFormat === "fun" && " 📅"}
                </h2>
                <div className="space-y-2">
                  {dayActivities.map((sa, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{
                        backgroundColor: selectedFormat === "standard" ? "#f9fafb" : "rgba(255,255,255,0.1)",
                      }}
                    >
                      <div className="text-sm font-medium w-20 flex-shrink-0">
                        {sa.timeSlot}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">
                          {selectedFormat === "fun" && "🎯 "}
                          {sa.activity.name}
                          {selectedFormat === "fun" && " 🎯"}
                        </div>
                        <div className="text-sm opacity-75">
                          {sa.activity.duration} • {sa.activity.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm opacity-75">
          <p>
            {selectedFormat === "fun" && "🌟 "}
            Generated by Weekendly
            {selectedFormat === "fun" && " 🌟"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Weekend Plan
          </DialogTitle>
          <DialogDescription>
            Select a saved plan, choose a poster format, and create a beautiful poster to share
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Select Plan */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Step 1: Choose a Plan
            </h3>
            {savedPlans.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No saved plans yet</p>
                <p className="text-xs">Create and save a plan first to share it!</p>
              </div>
            ) : (
              <div className="grid gap-3 max-h-48 overflow-y-auto">
                {savedPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedPlan?.id === plan.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{plan.name}</CardTitle>
                          <CardDescription className="text-sm">
                            Saved on {new Date(plan.date).toLocaleDateString()} • {plan.scheduledActivities.length} activities
                          </CardDescription>
                        </div>
                        {selectedPlan?.id === plan.id && (
                          <Badge variant="default">Selected</Badge>
                        )}
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

          {/* Step 2: Choose Format */}
          {selectedPlan && (
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Step 2: Choose Poster Format
              </h3>
              <RadioGroup value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as PosterFormat)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {posterFormats.map((format) => (
                    <div key={format.value} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={format.value} id={format.value} />
                        <Label htmlFor={format.value} className="font-medium cursor-pointer">
                          {format.label}
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">{format.description}</p>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Preview and Actions */}
          {selectedPlan && (
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <Image className="w-4 h-4" />
                Step 3: Preview & Share
              </h3>
              
              {/* Poster Preview */}
              <div className="border rounded-lg p-4 bg-muted/20">
                {renderPoster()}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={sharePoster}
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                  Share Poster
                </Button>
                <Button
                  onClick={generatePoster}
                  variant="outline"
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Download PNG
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
