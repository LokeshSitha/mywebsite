"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import createGlobe from "cobe"

interface LocationMarker {
  id: string
  location: [number, number]
  label: string
}

interface CobeGlobeProps {
  markers?: LocationMarker[]
  className?: string
  speed?: number
}

const defaultMarkers: LocationMarker[] = [
  { id: "india", location: [28.6139, 77.209], label: "India" },
  { id: "us", location: [40.7128, -74.006], label: "US" },
  { id: "germany", location: [52.52, 13.405], label: "Germany" },
  { id: "singapore", location: [1.3521, 103.8198], label: "Singapore" },
]

export function CobeGlobe({
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
}: CobeGlobeProps) {
  const [initFailed, setInitFailed] = useState(false)
  const [labelPositions, setLabelPositions] = useState<
    Array<{ id: string; label: string; x: number; y: number; visible: boolean }>
  >([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)
  const animatedPhiRef = useRef(0)
  const animatedThetaRef = useRef(0.2)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let phi = 0

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      try {
        globe = createGlobe(canvas, {
          devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
          width,
          height: width,
          phi: 0,
          theta: 0.2,
          dark: 0,
          diffuse: 1.5,
          scale: 1,
          mapSamples: 16000,
          mapBrightness: 10,
          baseColor: [0.98, 0.98, 1],
          markerColor: [0.4, 0.7, 0.95],
          glowColor: [0.94, 0.93, 0.91],
          markerElevation: 0.12,
          markers: markers.map((m) => ({
            location: m.location,
            size: 0.03,
            id: m.id,
          })),
          arcs: markers.map((m, i) => {
            const next = markers[(i + 1) % markers.length]
            return {
              from: m.location,
              to: next.location,
              color: [0.5, 0.8, 1],
            }
          }),
          arcColor: [0.5, 0.8, 1],
          arcWidth: 0.5,
          arcHeight: 0.25,
          onRender: (state: any) => {
            if (!isPausedRef.current) phi += speed
            const nextPhi = phi + phiOffsetRef.current + dragOffset.current.phi
            const nextTheta = 0.2 + thetaOffsetRef.current + dragOffset.current.theta
            animatedPhiRef.current = nextPhi
            animatedThetaRef.current = nextTheta
            state.phi = nextPhi
            state.theta = nextTheta
          },
        } as any)
        setInitFailed(false)
      } catch {
        setInitFailed(true)
        return
      }
      setTimeout(() => canvas && (canvas.style.opacity = "1"))
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      if (globe) globe.destroy()
    }
  }, [markers, speed])

  useEffect(() => {
    const project = (
      latitude: number,
      longitude: number,
      phi: number,
      theta: number
    ) => {
      const lat = (latitude * Math.PI) / 180
      const lon = (longitude * Math.PI) / 180

      const x = Math.cos(lat) * Math.cos(lon)
      const y = Math.sin(lat)
      const z = Math.cos(lat) * Math.sin(lon)

      const x1 = x * Math.cos(phi) - z * Math.sin(phi)
      const z1 = x * Math.sin(phi) + z * Math.cos(phi)

      const y2 = y * Math.cos(theta) - z1 * Math.sin(theta)
      const z2 = y * Math.sin(theta) + z1 * Math.cos(theta)

      const px = 50 + x1 * 38
      const py = 50 - y2 * 38

      return { x: px, y: py, visible: z2 > 0 }
    }

    let frame = 0
    const tick = () => {
      setLabelPositions(
        markers.map((marker) => {
          const point = project(
            marker.location[0],
            marker.location[1],
            animatedPhiRef.current,
            animatedThetaRef.current
          )
          return {
            id: marker.id,
            label: marker.label,
            x: point.x,
            y: point.y,
            visible: point.visible,
          }
        })
      )
      frame = requestAnimationFrame(tick)
    }

    tick()
    return () => cancelAnimationFrame(frame)
  }, [markers])

  return (
    <div
      className={`relative aspect-square select-none ${className}`}
      style={{
        borderRadius: "50%",
        aspectRatio: "1 / 1",
        background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2), rgba(190,220,255,0.08) 42%, rgba(10,15,25,0) 72%)",
        boxShadow: "0 0 70px rgba(190, 220, 255, 0.22)",
      }}
    >
      <style>{`
        @keyframes marker-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />
      {labelPositions.map((label) => (
        <div
          key={label.id}
          style={{
            position: "absolute",
            left: `${label.x}%`,
            top: `${label.y}%`,
            transform: "translate(-50%, -50%)",
            opacity: label.visible ? 1 : 0,
            transition: "opacity 0.25s ease",
            pointerEvents: "none",
            color: "#d8eeff",
            fontSize: "10px",
            fontWeight: 700,
            textShadow: "0 0 6px rgba(150, 220, 255, 0.9), 0 0 14px rgba(150, 220, 255, 0.5)",
            whiteSpace: "nowrap",
            letterSpacing: "0.6px",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "6px",
              height: "6px",
              borderRadius: "999px",
              background: "#5cc8ff",
              marginRight: "6px",
              boxShadow: "0 0 10px rgba(92, 200, 255, 0.95)",
              verticalAlign: "middle",
            }}
          />
          {label.label}
        </div>
      ))}
      {initFailed && (
        <div
          className="absolute inset-0 flex items-center justify-center text-sm text-cyan-400"
          style={{ textShadow: "0 0 10px rgba(0, 255, 136, 0.5)" }}
        >
          Globe unavailable on this device
        </div>
      )}
    </div>
  )
}
