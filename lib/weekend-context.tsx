"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useRef } from "react"
import { activities, themes } from "./weekend-data"

export type WeekendDay = "saturday" | "sunday" | "friday" | "monday"

export interface ScheduledActivity {
  activity: (typeof activities)[0]
  day: WeekendDay
  timeSlot: string
}

export type ActivityVibe = "happy" | "relaxed" | "energetic"

export interface SavedPlan {
  id: string
  name: string
  date: string
  scheduledActivities: ScheduledActivity[]
  selectedActivities: typeof activities
  theme: keyof typeof themes
  activityVibes?: Record<number, ActivityVibe>
}

interface WeekendState {
  selectedActivities: typeof activities
  scheduledActivities: ScheduledActivity[]
  searchQuery: string
  selectedCategory: string
  currentView: "browse" | "schedule"
  selectedTheme: keyof typeof themes
  userName: string
  isLongWeekend: boolean
  autoSave: boolean
  savedPlans: SavedPlan[]
  draggedActivity: (typeof activities)[0] | null
  dragOverSlot: { day: WeekendDay; timeSlot: string } | null
  activityVibes: Record<number, ActivityVibe>
}

type WeekendAction =
  | { type: "SET_SELECTED_ACTIVITIES"; payload: typeof activities }
  | { type: "ADD_ACTIVITY"; payload: (typeof activities)[0] }
  | { type: "REMOVE_ACTIVITY"; payload: number }
  | { type: "SET_SCHEDULED_ACTIVITIES"; payload: ScheduledActivity[] }
  | { type: "SCHEDULE_ACTIVITY"; payload: { activity: (typeof activities)[0]; day: WeekendDay; timeSlot: string } }
  | { type: "REMOVE_FROM_SCHEDULE"; payload: number }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SELECTED_CATEGORY"; payload: string }
  | { type: "SET_CURRENT_VIEW"; payload: "browse" | "schedule" }
  | { type: "SET_SELECTED_THEME"; payload: keyof typeof themes }
  | { type: "SET_USER_NAME"; payload: string }
  | { type: "SET_IS_LONG_WEEKEND"; payload: boolean }
  | { type: "SET_AUTO_SAVE"; payload: boolean }
  | { type: "SET_SAVED_PLANS"; payload: SavedPlan[] }
  | { type: "ADD_SAVED_PLAN"; payload: SavedPlan }
  | { type: "REMOVE_SAVED_PLAN"; payload: string }
  | { type: "SET_DRAGGED_ACTIVITY"; payload: (typeof activities)[0] | null }
  | { type: "SET_DRAG_OVER_SLOT"; payload: { day: WeekendDay; timeSlot: string } | null }
  | { type: "CLEAR_SCHEDULE" }
  | { type: "SET_ACTIVITY_VIBE"; payload: { activityId: number; vibe: ActivityVibe | null } }
  | { type: "SET_ACTIVITY_VIBES"; payload: Record<number, ActivityVibe> }

const initialState: WeekendState = {
  selectedActivities: [],
  scheduledActivities: [],
  searchQuery: "",
  selectedCategory: "all",
  currentView: "browse",
  selectedTheme: "default",
  userName: "",
  isLongWeekend: false,
  autoSave: true,
  savedPlans: [],
  draggedActivity: null,
  dragOverSlot: null,
  activityVibes: {},
}

function weekendReducer(state: WeekendState, action: WeekendAction): WeekendState {
  switch (action.type) {
    case "SET_SELECTED_ACTIVITIES":
      return { ...state, selectedActivities: action.payload }

    case "ADD_ACTIVITY": {
      const existingIndex = state.selectedActivities.findIndex(
        (a) => a.id === action.payload.id
      )

      if (existingIndex >= 0) {
        // Merge updated fields like location or name
        const updated = [...state.selectedActivities]
        updated[existingIndex] = { ...updated[existingIndex], ...action.payload }
        return { ...state, selectedActivities: updated }
      }

      return { ...state, selectedActivities: [...state.selectedActivities, action.payload] }
    }

    case "REMOVE_ACTIVITY":
      return {
        ...state,
        selectedActivities: state.selectedActivities.filter((a) => a.id !== action.payload),
        scheduledActivities: state.scheduledActivities.filter((sa) => sa.activity.id !== action.payload),
        activityVibes: Object.fromEntries(
          Object.entries(state.activityVibes).filter(([id]) => Number(id) !== action.payload)
        ),
      }

    case "SET_SCHEDULED_ACTIVITIES":
      return { ...state, scheduledActivities: action.payload }

    case "SCHEDULE_ACTIVITY": {
      const existingIndex = state.scheduledActivities.findIndex(
        (sa) => sa.activity.id === action.payload.activity.id
      )
      const newScheduled = [...state.scheduledActivities]
      if (existingIndex >= 0) newScheduled.splice(existingIndex, 1)
      newScheduled.push(action.payload)
      return { ...state, scheduledActivities: newScheduled }
    }

    case "REMOVE_FROM_SCHEDULE":
      return {
        ...state,
        scheduledActivities: state.scheduledActivities.filter((sa) => sa.activity.id !== action.payload),
      }

    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload }
    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload }
    case "SET_CURRENT_VIEW":
      return { ...state, currentView: action.payload }
    case "SET_SELECTED_THEME":
      return { ...state, selectedTheme: action.payload }
    case "SET_USER_NAME":
      return { ...state, userName: action.payload }
    case "SET_IS_LONG_WEEKEND":
      return { ...state, isLongWeekend: action.payload }
    case "SET_AUTO_SAVE":
      return { ...state, autoSave: action.payload }
    case "SET_SAVED_PLANS":
      return { ...state, savedPlans: action.payload }
    case "ADD_SAVED_PLAN":
      return { ...state, savedPlans: [...state.savedPlans, action.payload] }
    case "REMOVE_SAVED_PLAN":
      return { ...state, savedPlans: state.savedPlans.filter((p) => p.id !== action.payload) }
    case "SET_DRAGGED_ACTIVITY":
      return { ...state, draggedActivity: action.payload }
    case "SET_DRAG_OVER_SLOT":
      return { ...state, dragOverSlot: action.payload }
    case "CLEAR_SCHEDULE":
      return { ...state, scheduledActivities: [] }
    case "SET_ACTIVITY_VIBE": {
      const { activityId, vibe } = action.payload
      const newVibes = { ...state.activityVibes }
      if (vibe) newVibes[activityId] = vibe
      else delete newVibes[activityId]
      return { ...state, activityVibes: newVibes }
    }
    case "SET_ACTIVITY_VIBES":
      return { ...state, activityVibes: action.payload }

    default:
      return state
  }
}

const WeekendContext = createContext<{
  state: WeekendState
  dispatch: React.Dispatch<WeekendAction>
} | null>(null)

// ---------- Utility helpers ----------
function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue
  try {
    const saved = localStorage.getItem(key)
    return saved ? (JSON.parse(saved) as T) : defaultValue
  } catch {
    return defaultValue
  }
}

function saveToStorage(key: string, value: any) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

function reconstructActivitiesFromIds(activityIds: number[]): typeof activities {
  return activityIds
    .map((id) => activities.find((activity) => activity.id === id))
    .filter(Boolean) as typeof activities
}

function reconstructScheduledActivities(scheduledData: any[]): ScheduledActivity[] {
  return scheduledData.map((item) => {
    const id = typeof item.activity === "number" ? item.activity : item.activity?.id
    const foundActivity = activities.find((activity) => activity.id === id)

    if (!foundActivity) {
      console.warn("Missing activity for id:", id)
      return null // skip broken activities instead of returning object
    }

    return {
      ...item,
      activity: foundActivity,
    }
  }).filter(Boolean) as ScheduledActivity[]
}


function reconstructSavedPlans(plansData: any[]): SavedPlan[] {
  if (!Array.isArray(plansData)) return []

  return plansData.map((plan) => {
    const reconstructedSelected = (plan.selectedActivities || [])
      .map((sel: any) => {
        if (typeof sel === "number") return activities.find((a) => a.id === sel)
        const base = sel?.id ? activities.find((a) => a.id === sel.id) : null
        if (!base) return sel?.id ? { id: sel.id, name: sel.name, location: sel.location, googleMapsUrl: sel.googleMapsUrl } : null
        return { ...base, ...(sel.name ? { name: sel.name } : {}), ...(sel.location ? { location: sel.location } : {}), ...(sel.googleMapsUrl ? { googleMapsUrl: sel.googleMapsUrl } : {}) }
      })
      .filter(Boolean) as typeof activities

    const reconstructedScheduled = (plan.scheduledActivities || [])
      .map((item: any) => {
        const key = item.activity
        if (typeof key === "number") {
          const base = activities.find((a) => a.id === key)
          return base ? { ...item, activity: base } : null
        }
        const base = key?.id ? activities.find((a) => a.id === key.id) : null
        if (!base) return key?.id ? { ...item, activity: { id: key.id, name: key.name, location: key.location, googleMapsUrl: key.googleMapsUrl } } : null
        return {
          ...item,
          activity: {
            ...base,
            ...(key.name ? { name: key.name } : {}),
            ...(key.location ? { location: key.location } : {}),
            ...(key.googleMapsUrl ? { googleMapsUrl: key.googleMapsUrl } : {}),
          },
        }
      })
      .filter(Boolean) as ScheduledActivity[]

    return {
      ...plan,
      selectedActivities: reconstructedSelected,
      scheduledActivities: reconstructedScheduled,
    }
  })
}


// ---------- Provider ----------
export function WeekendProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(weekendReducer, initialState)
  const hasHydratedRef = useRef(false)

  // Load saved data on mount
  useEffect(() => {
    const savedTheme = loadFromStorage("weekendly-theme", "default")
    const savedUserName = loadFromStorage("weekendly-username", "")
    const savedSelectedActivityIds = loadFromStorage("weekendly-selected-activity-ids", [])
    const savedScheduledActivitiesData = loadFromStorage("weekendly-scheduled-activities", [])
    const savedIsLongWeekend = loadFromStorage("weekendly-long-weekend", false)
    const savedAutoSave = loadFromStorage("weekendly-auto-save", true)
    const savedPlansRaw = loadFromStorage("weekendly-saved-plans", [])
    const savedVibes = loadFromStorage("weekendly-activity-vibes", {})

    dispatch({ type: "SET_SELECTED_THEME", payload: savedTheme })
    dispatch({ type: "SET_USER_NAME", payload: savedUserName })
    dispatch({ type: "SET_SELECTED_ACTIVITIES", payload: reconstructActivitiesFromIds(savedSelectedActivityIds) })
    dispatch({
      type: "SET_SCHEDULED_ACTIVITIES",
      payload: reconstructScheduledActivities(savedScheduledActivitiesData),
    })
    dispatch({ type: "SET_IS_LONG_WEEKEND", payload: savedIsLongWeekend })
    dispatch({ type: "SET_AUTO_SAVE", payload: savedAutoSave })
    dispatch({ type: "SET_SAVED_PLANS", payload: reconstructSavedPlans(savedPlansRaw) })
    dispatch({ type: "SET_ACTIVITY_VIBES", payload: savedVibes })

    // Migration for old plans
    if (Array.isArray(savedPlansRaw) && savedPlansRaw.length > 0 && !localStorage.getItem("weekendly-migrated")) {
      const migrated = savedPlansRaw.map((plan: any) => ({
        ...plan,
        selectedActivities: plan.selectedActivities || [],
        scheduledActivities: plan.scheduledActivities || [],
      }))
      saveToStorage("weekendly-saved-plans", migrated)
      localStorage.setItem("weekendly-migrated", "true")
    }

    hasHydratedRef.current = true
  }, [])

  // Auto-save functionality
  useEffect(() => {
    if (!hasHydratedRef.current) return
    if (state.autoSave && typeof window !== "undefined") {
      const selectedActivityIds = state.selectedActivities.map((a) => a.id)

      const baseById = (id: number) => activities.find((b) => b.id === id)
      const serializeActivity = (a: any) => {
        const base = baseById(a.id)
        if (!base) return { id: a.id, name: a.name, location: a.location, googleMapsUrl: a.googleMapsUrl }
        const payload: any = { id: a.id }
        if (a.name !== base.name) payload.name = a.name
        if (a.location !== base.location) payload.location = a.location
        if (a.googleMapsUrl) payload.googleMapsUrl = a.googleMapsUrl
        return Object.keys(payload).length === 1 ? a.id : payload
      }

      if (state.savedPlans.length > 0) {
        const plansToSave = state.savedPlans.map((plan) => ({
          ...plan,
          selectedActivities: plan.selectedActivities.map((a) => serializeActivity(a)),
          scheduledActivities: plan.scheduledActivities.map((sa) => ({
            ...sa,
            activity: serializeActivity(sa.activity),
          })),
        }))
        saveToStorage("weekendly-saved-plans", plansToSave)
      }

      saveToStorage("weekendly-selected-activity-ids", selectedActivityIds)
      saveToStorage("weekendly-scheduled-activities", state.scheduledActivities)
      saveToStorage("weekendly-theme", state.selectedTheme)
      saveToStorage("weekendly-username", state.userName)
      saveToStorage("weekendly-long-weekend", state.isLongWeekend)
      saveToStorage("weekendly-auto-save", state.autoSave)
      saveToStorage("weekendly-activity-vibes", state.activityVibes)
    }
  }, [state, state.autoSave])

  // Apply theme colors
  useEffect(() => {
    const theme = themes[state.selectedTheme]
    const root = document.documentElement

    root.style.setProperty("--color-primary", theme.colors.primary)
    root.style.setProperty("--color-secondary", theme.colors.secondary)
    root.style.setProperty("--color-accent", theme.colors.accent)
  }, [state.selectedTheme])

  return <WeekendContext.Provider value={{ state, dispatch }}>{children}</WeekendContext.Provider>
}

export function useWeekend() {
  const context = useContext(WeekendContext)
  if (!context) throw new Error("useWeekend must be used within a WeekendProvider")
  return context
}
