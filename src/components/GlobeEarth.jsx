import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function GlobeEarth() {
  const globeRef = useRef()
  const atmosphereRef = useRef()
  const orbitsRef = useRef()
  const connectionsRef = useRef()

  const { sphereGeometry, lineGeometry, particleGeometry } = useMemo(() => {
    const sphere = new THREE.SphereGeometry(1.2, 64, 64)

    const latLines = []
    const longLines = []

    for (let i = 0; i <= 12; i++) {
      const phi = (i / 12) * Math.PI
      const points = []
      for (let j = 0; j <= 64; j++) {
        const theta = (j / 64) * Math.PI * 2
        const x = 1.2 * Math.sin(phi) * Math.cos(theta)
        const y = 1.2 * Math.cos(phi)
        const z = 1.2 * Math.sin(phi) * Math.sin(theta)
        points.push(new THREE.Vector3(x, y, z))
      }
      latLines.push(...points)
    }

    for (let i = 0; i <= 24; i++) {
      const theta = (i / 24) * Math.PI * 2
      const points = []
      for (let j = 0; j <= 32; j++) {
        const phi = (j / 32) * Math.PI
        const x = 1.2 * Math.sin(phi) * Math.cos(theta)
        const y = 1.2 * Math.cos(phi)
        const z = 1.2 * Math.sin(phi) * Math.sin(theta)
        points.push(new THREE.Vector3(x, y, z))
      }
      longLines.push(...points)
    }

    const lineGeo = new THREE.BufferGeometry().setFromPoints([...latLines, ...longLines])

    const particleGeo = new THREE.BufferGeometry()
    const particleCount = 300
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const r = 1.21 + Math.random() * 0.3

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi)
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)

      const isActive = Math.random() > 0.7
      if (isActive) {
        colors[i * 3] = 0
        colors[i * 3 + 1] = 1
        colors[i * 3 + 2] = 0.53
      } else {
        colors[i * 3] = 0.05
        colors[i * 3 + 1] = 0.1
        colors[i * 3 + 2] = 0.15
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    return { sphereGeometry: sphere, lineGeometry: lineGeo, particleGeometry: particleGeo }
  }, [])

  const cities = useMemo(() => [
    { lat: 28.6139, lng: 77.209, name: 'India' },
    { lat: 40.7128, lng: -74.006, name: 'US' },
    { lat: 52.52, lng: 13.405, name: 'Germany' },
    { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  ], [])

  const cityPositions = useMemo(() => {
    return cities.map(city => {
      const phi = (90 - city.lat) * (Math.PI / 180)
      const theta = (city.lng + 180) * (Math.PI / 180)
      return new THREE.Vector3(
        -1.3 * Math.sin(phi) * Math.cos(theta),
        1.3 * Math.cos(phi),
        1.3 * Math.sin(phi) * Math.sin(theta)
      )
    })
  }, [cities])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (globeRef.current) {
      globeRef.current.rotation.y = t * 0.15
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = t * 0.1
      atmosphereRef.current.material.opacity = 0.15 + Math.sin(t * 0.5) * 0.05
    }

    if (connectionsRef.current) {
      const positions = connectionsRef.current.geometry.attributes.position.array
      const time = t * 0.5

      for (let i = 0; i < cityPositions.length; i++) {
        const start = cityPositions[i]
        const end = cityPositions[(i + 1) % cityPositions.length]

        for (let j = 0; j < 20; j++) {
          const idx = (i * 20 + j) * 6
          const progress = ((time + i * 0.3 + j * 0.05) % 1)
          const x = start.x + (end.x - start.x) * progress
          const y = start.y + (end.y - start.y) * progress
          const z = start.z + (end.z - start.z) * progress

          positions[idx] = x
          positions[idx + 1] = y
          positions[idx + 2] = z
          positions[idx + 3] = x + 0.02
          positions[idx + 4] = y + 0.02
          positions[idx + 5] = z + 0.02
        }
      }

      connectionsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group>
      <mesh ref={globeRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial color="#0a1628" transparent opacity={0.9} />
      </mesh>

      <lineSegments geometry={lineGeometry} ref={orbitsRef}>
        <lineBasicMaterial color="#00ff88" transparent opacity={0.15} />
      </lineSegments>

      <points geometry={particleGeometry}>
        <pointsMaterial
          size={0.015}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      <mesh ref={atmosphereRef} scale={1.4}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh scale={1.35}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      <lineSegments ref={connectionsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={cityPositions.length * 20 * 2}
            array={new Float32Array(cityPositions.length * 20 * 6)}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00ff88" transparent opacity={0.6} />
      </lineSegments>

      {cityPositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#00ff88" />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#00ff88" transparent opacity={0.3} />
          </mesh>
        </group>
      ))}

      <pointLight position={[5, 5, 5]} intensity={0.5} color="#00ff88" />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#0ea5e9" />
    </group>
  )
}

export default GlobeEarth