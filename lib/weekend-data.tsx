import {
  Coffee,
  Mountain,
  Film,
  Book,
  Utensils,
  Music,
  Calendar,
  Heart,
  Zap,
  Home,
  Users,
  MapPin,
  Gamepad2,
  Camera,
  Palette,
  Dumbbell,
  ShoppingBag,
  Plane,
} from "lucide-react"

export const themes = {
  default: {
    id: "default",
    name: "Balanced Weekend",
    description: "Perfect mix of relaxation and activities",
    icon: Calendar,
    colors: {
      primary: "hsl(158, 64%, 52%)", // emerald-500
      secondary: "hsl(158, 64%, 42%)", // emerald-600
      accent: "hsl(158, 64%, 62%)", // emerald-400
    },
    suggestedMoods: ["relaxed", "social", "fun"],
  },
  lazy: {
    id: "lazy",
    name: "Lazy Weekend",
    description: "Slow-paced, cozy, and restful activities",
    icon: Heart,
    colors: {
      primary: "hsl(217, 91%, 60%)", // blue-500
      secondary: "hsl(217, 91%, 50%)", // blue-600
      accent: "hsl(217, 91%, 70%)", // blue-400
    },
    suggestedMoods: ["relaxed", "cozy", "peaceful"],
  },
  adventurous: {
    id: "adventurous",
    name: "Adventurous Weekend",
    description: "High-energy, outdoor, and exciting activities",
    icon: Zap,
    colors: {
      primary: "hsl(25, 95%, 53%)", // orange-500
      secondary: "hsl(25, 95%, 43%)", // orange-600
      accent: "hsl(25, 95%, 63%)", // orange-400
    },
    suggestedMoods: ["energetic", "exciting", "exploratory"],
  },
  family: {
    id: "family",
    name: "Family Weekend",
    description: "Family-friendly, social, and home-based activities",
    icon: Home,
    colors: {
      primary: "hsl(262, 83%, 58%)", // purple-500
      secondary: "hsl(262, 83%, 48%)", // purple-600
      accent: "hsl(262, 83%, 68%)", // purple-400
    },
    suggestedMoods: ["fun", "social", "cozy"],
  },
}

export const activities = [
  // Outdoor Activities - Green theme
  {
    id: 1,
    name: "Morning Hike",
    category: "outdoor",
    duration: "2-3 hours",
    location: "Local trails",
    mood: "energetic",
    icon: Mountain,
    color: "bg-green-100 text-green-700",
  },
  {
    id: 2,
    name: "Picnic in the Park",
    category: "outdoor",
    duration: "2-4 hours",
    location: "City park",
    mood: "relaxed",
    icon: Users,
    color: "bg-green-100 text-green-700",
  },
  {
    id: 3,
    name: "Beach Day",
    category: "outdoor",
    duration: "4-6 hours",
    location: "Beach",
    mood: "fun",
    icon: MapPin,
    color: "bg-green-100 text-green-700",
  },
  {
    id: 4,
    name: "Cycling Adventure",
    category: "outdoor",
    duration: "1-3 hours",
    location: "Bike trails",
    mood: "energetic",
    icon: Mountain,
    color: "bg-green-100 text-green-700",
  },
  {
    id: 5,
    name: "Outdoor Photography",
    category: "outdoor",
    duration: "2-4 hours",
    location: "Various",
    mood: "exploratory",
    icon: Camera,
    color: "bg-green-100 text-green-700",
  },

  // Food & Dining - Orange theme
  {
    id: 6,
    name: "Brunch with Friends",
    category: "food",
    duration: "2-3 hours",
    location: "Restaurant",
    mood: "social",
    icon: Utensils,
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: 7,
    name: "Cooking Class",
    category: "food",
    duration: "3-4 hours",
    location: "Cooking studio",
    mood: "fun",
    icon: Utensils,
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: 8,
    name: "Food Market Tour",
    category: "food",
    duration: "2-3 hours",
    location: "Local market",
    mood: "exploratory",
    icon: ShoppingBag,
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: 9,
    name: "Wine Tasting",
    category: "food",
    duration: "2-3 hours",
    location: "Winery",
    mood: "relaxed",
    icon: Utensils,
    color: "bg-orange-100 text-orange-700",
  },

  // Entertainment - Purple theme
  {
    id: 10,
    name: "Movie Marathon",
    category: "entertainment",
    duration: "4-6 hours",
    location: "Home/Cinema",
    mood: "cozy",
    icon: Film,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 11,
    name: "Live Music Concert",
    category: "entertainment",
    duration: "3-4 hours",
    location: "Venue",
    mood: "exciting",
    icon: Music,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 12,
    name: "Board Game Night",
    category: "entertainment",
    duration: "2-4 hours",
    location: "Home",
    mood: "fun",
    icon: Gamepad2,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 13,
    name: "Art Gallery Visit",
    category: "entertainment",
    duration: "2-3 hours",
    location: "Gallery",
    mood: "peaceful",
    icon: Palette,
    color: "bg-purple-100 text-purple-700",
  },

  // Relaxation - Blue theme
  {
    id: 14,
    name: "Spa Day",
    category: "relaxation",
    duration: "3-5 hours",
    location: "Spa/Home",
    mood: "peaceful",
    icon: Heart,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 15,
    name: "Reading Session",
    category: "relaxation",
    duration: "2-4 hours",
    location: "Home/Cafe",
    mood: "cozy",
    icon: Book,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 16,
    name: "Meditation & Yoga",
    category: "relaxation",
    duration: "1-2 hours",
    location: "Home/Studio",
    mood: "peaceful",
    icon: Heart,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 17,
    name: "Coffee Shop Visit",
    category: "relaxation",
    duration: "1-2 hours",
    location: "Cafe",
    mood: "cozy",
    icon: Coffee,
    color: "bg-blue-100 text-blue-700",
  },

  // Fitness - Red theme
  {
    id: 18,
    name: "Gym Workout",
    category: "fitness",
    duration: "1-2 hours",
    location: "Gym",
    mood: "energetic",
    icon: Dumbbell,
    color: "bg-red-100 text-red-700",
  },
  {
    id: 19,
    name: "Rock Climbing",
    category: "fitness",
    duration: "2-3 hours",
    location: "Climbing gym",
    mood: "exciting",
    icon: Mountain,
    color: "bg-red-100 text-red-700",
  },
  {
    id: 20,
    name: "Swimming",
    category: "fitness",
    duration: "1-2 hours",
    location: "Pool",
    mood: "energetic",
    icon: Dumbbell,
    color: "bg-red-100 text-red-700",
  },

  // Social - Pink theme with better contrast
  {
    id: 21,
    name: "Visit Family",
    category: "social",
    duration: "3-5 hours",
    location: "Family home",
    mood: "social",
    icon: Users,
    color: "bg-purple-600 text-white",
  },
  {
    id: 22,
    name: "Game Night with Friends",
    category: "social",
    duration: "3-4 hours",
    location: "Home",
    mood: "fun",
    icon: Gamepad2,
    color: "bg-purple-600 text-white",
  },
  {
    id: 23,
    name: "Double Date",
    category: "social",
    duration: "3-4 hours",
    location: "Various",
    mood: "fun",
    icon: Users,
    color: "bg-purple-600 text-white",
  },
  {
    id: 24,
    name: "Weekend Trip",
    category: "social",
    duration: "6+ hours",
    location: "Nearby city",
    mood: "exciting",
    icon: Plane,
    color: "bg-purple-600 text-white",
  },
]

export const categories = [
  { id: "all", name: "All" },
  { id: "outdoor", name: "Outdoor" },
  { id: "food", name: "Food" },
  { id: "entertainment", name: "Entertainment" },
  { id: "relaxation", name: "Relaxation" },
  { id: "fitness", name: "Fitness" },
  { id: "social", name: "Social" },
]

export function getTimeSlots(isLongWeekend: boolean) {
  return [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
  ]
}

export function getWeekendDays(isLongWeekend: boolean) {
  const baseDays = [
    { id: 1, name: "Saturday", key: "saturday" as const },
    { id: 2, name: "Sunday", key: "sunday" as const },
  ]

  if (isLongWeekend) {
    return [
      { id: 0, name: "Friday", key: "friday" as const },
      ...baseDays,
      { id: 3, name: "Monday", key: "monday" as const },
    ]
  }

  return baseDays
}

export function getUpcomingHolidays() {
  const holidays = [
    { name: "New Year's Day", date: "2025-01-01" },
    { name: "Valentine's Day", date: "2025-02-14" },
    { name: "Easter", date: "2025-04-20" },
    { name: "Memorial Day", date: "2025-05-26" },
    { name: "Independence Day", date: "2025-07-04" },
    { name: "Labor Day", date: "2025-09-01" },
    { name: "Thanksgiving", date: "2025-11-27" },
    { name: "Christmas", date: "2025-12-25" },
  ]

  const today = new Date()
  return holidays.filter((holiday) => new Date(holiday.date) > today).slice(0, 3)
}
