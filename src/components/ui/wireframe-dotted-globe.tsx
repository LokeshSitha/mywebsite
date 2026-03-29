"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

interface GlobeLocation {
  name: string
  coords: [number, number]
}

interface RotatingEarthProps {
  width?: number
  height?: number
  className?: string
  locations?: GlobeLocation[]
}

const defaultLocations: GlobeLocation[] = [
  { name: "India", coords: [77.209, 28.6139] },
  { name: "US", coords: [-74.006, 40.7128] },
  { name: "Germany", coords: [13.405, 52.52] },
  { name: "Singapore", coords: [103.8198, 1.3521] },
]

export default function RotatingEarth({
  width = 800,
  height = 600,
  className = "",
  locations = defaultLocations,
}: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    const containerWidth = Math.min(width, window.innerWidth - 40)
    const containerHeight = Math.min(height, window.innerHeight - 100)
    const radius = Math.min(containerWidth, containerHeight) / 2.5

    const dpr = window.devicePixelRatio || 1
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`
    context.scale(dpr, dpr)

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(context)

    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point
      let inside = false

      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i]
        const [xj, yj] = polygon[j]

        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside
        }
      }

      return inside
    }

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry

      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates
        if (!pointInPolygon(point, coordinates[0])) {
          return false
        }
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) {
            return false
          }
        }
        return true
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true
                break
              }
            }
            if (!inHole) {
              return true
            }
          }
        }
        return false
      }

      return false
    }

    const generateDotsInPolygon = (feature: any, dotSpacing = 16) => {
      const dots: [number, number][] = []
      const bounds = d3.geoBounds(feature)
      const [[minLng, minLat], [maxLng, maxLat]] = bounds
      const stepSize = dotSpacing * 0.08

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat]
          if (pointInFeature(point, feature)) {
            dots.push(point)
          }
        }
      }

      return dots
    }

    const allDots: Array<{ lng: number; lat: number }> = []
    let landFeatures: any

    const drawLocationTag = (location: GlobeLocation, scaleFactor: number) => {
      const point = projection(location.coords as [number, number])
      if (!point) return

      context.beginPath()
      context.arc(point[0], point[1], 4 * scaleFactor, 0, 2 * Math.PI)
      context.fillStyle = "#00ff88"
      context.shadowBlur = 18
      context.shadowColor = "rgba(0, 255, 136, 0.95)"
      context.fill()
      context.shadowBlur = 0

      context.font = `${10 * scaleFactor + 8}px Orbitron, sans-serif`
      context.fillStyle = "#9ee8ff"
      context.textAlign = "center"
      context.shadowBlur = 10
      context.shadowColor = "rgba(14, 165, 233, 0.7)"
      context.fillText(location.name, point[0], point[1] + 18 * scaleFactor + 8)
      context.shadowBlur = 0
    }

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight)

      const currentScale = projection.scale()
      const scaleFactor = currentScale / radius

      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI)
      const radial = context.createRadialGradient(
        containerWidth / 2 - currentScale * 0.3,
        containerHeight / 2 - currentScale * 0.3,
        currentScale * 0.1,
        containerWidth / 2,
        containerHeight / 2,
        currentScale
      )
      radial.addColorStop(0, "#123a52")
      radial.addColorStop(0.55, "#0b2238")
      radial.addColorStop(1, "#050d17")
      context.fillStyle = radial
      context.fill()
      context.strokeStyle = "#63d9ff"
      context.lineWidth = 2 * scaleFactor
      context.shadowBlur = 30
      context.shadowColor = "rgba(14,165,233,0.65)"
      context.stroke()
      context.shadowBlur = 0

      if (landFeatures) {
        const graticule = d3.geoGraticule()
        context.beginPath()
        path(graticule())
        context.strokeStyle = "#2eb3d6"
        context.lineWidth = 0.9 * scaleFactor
        context.globalAlpha = 0.2
        context.stroke()
        context.globalAlpha = 1

        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat])
          if (
            projected &&
            projected[0] >= 0 &&
            projected[0] <= containerWidth &&
            projected[1] >= 0 &&
            projected[1] <= containerHeight
          ) {
            context.beginPath()
            context.arc(projected[0], projected[1], 1.15 * scaleFactor, 0, 2 * Math.PI)
            context.fillStyle = "#9be3ff"
            context.fill()
          }
        })

        locations.forEach((location) => drawLocationTag(location, scaleFactor))
      }
    }

    const loadWorldData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"
        )
        if (!response.ok) throw new Error("Failed to load land data")

        landFeatures = await response.json()

        landFeatures.features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 16)
          dots.forEach(([lng, lat]) => {
            allDots.push({ lng, lat })
          })
        })

        render()
        setIsLoading(false)
      } catch {
        setError("Failed to load land map data")
        setIsLoading(false)
      }
    }

    const rotation = [0, 0]
    let autoRotate = true
    const rotationSpeed = 0.35

    const rotate = () => {
      if (autoRotate) {
        rotation[0] += rotationSpeed
        projection.rotate(rotation as [number, number, number?])
        render()
      }
    }

    const rotationTimer = d3.timer(rotate)

    const handleMouseDown = (event: MouseEvent) => {
      autoRotate = false
      const startX = event.clientX
      const startY = event.clientY
      const startRotation = [...rotation]

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const sensitivity = 0.5
        const dx = moveEvent.clientX - startX
        const dy = moveEvent.clientY - startY

        rotation[0] = startRotation[0] + dx * sensitivity
        rotation[1] = startRotation[1] - dy * sensitivity
        rotation[1] = Math.max(-90, Math.min(90, rotation[1]))

        projection.rotate(rotation as [number, number, number?])
        render()
      }

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        setTimeout(() => {
          autoRotate = true
        }, 60)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const zoomFactor = event.deltaY > 0 ? 0.92 : 1.08
      const newRadius = Math.max(radius * 0.75, Math.min(radius * 1.75, projection.scale() * zoomFactor))
      projection.scale(newRadius)
      render()
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("wheel", handleWheel)

    loadWorldData()

    return () => {
      rotationTimer.stop()
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("wheel", handleWheel)
    }
  }, [width, height, locations])

  if (error) {
    return (
      <div className={`flex items-center justify-center rounded-2xl p-8 ${className}`}>
        <div className="text-center">
          <p className="font-semibold mb-2 text-red-400">Error loading Earth visualization</p>
          <p className="text-sm text-slate-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-full"
        style={{ maxWidth: "100%", height: "auto", background: "transparent" }}
      />
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs text-slate-300 px-2 py-1 rounded-md bg-slate-900/60">
        Drag to rotate • Scroll to zoom
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-300">
          Loading globe...
        </div>
      )}
    </div>
  )
}
