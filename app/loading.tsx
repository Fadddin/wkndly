"use client"

import { useEffect, useRef } from "react"

export default function Loading() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const lettersRef = useRef<HTMLSpanElement[] | null[]>([])

  useEffect(() => {
    let ctx: any
    ;(async () => {
      try {
        const gsap = (await import("gsap")).default
        if (!containerRef.current) return
        ctx = gsap.context(() => {
          gsap.set("[data-letter]", { opacity: 0, y: 8 })
          gsap.to("[data-letter]", {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.6,
            stagger: 0.06,
          })

          gsap.to(containerRef.current, {
            scale: 1.02,
            yoyo: true,
            repeat: -1,
            duration: 1.2,
            ease: "sine.inOut",
          })
        }, containerRef)
      } catch {
        // If gsap isn't available, silently skip animations
      }
    })()
    return () => ctx?.revert?.()
  }, [])

  const text = "Loading Weekendly"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div ref={containerRef} className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full border-2 border-primary border-r-transparent animate-spin" />
        <div className="text-lg font-semibold tracking-wide text-foreground">
          {text.split("").map((ch, i) => (
            <span
              key={i}
              data-letter
              ref={(el) => (lettersRef.current[i] = el)}
              className="inline-block"
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
