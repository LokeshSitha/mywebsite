import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function CyberGrid() {
  const gridRef = useRef()
  const particlesRef = useRef()

  const { gridGeometry, particleGeometry } = useMemo(() => {
    const grid = new THREE.BufferGeometry()
    const gridPositions = []
    const gridSize = 20
    const divisions = 40

    for (let i = -divisions / 2; i <= divisions / 2; i++) {
      const pos = (i / divisions) * gridSize
      gridPositions.push(-gridSize / 2, 0, pos, gridSize / 2, 0, pos)
      gridPositions.push(pos, 0, -gridSize / 2, pos, 0, gridSize / 2)
    }

    grid.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3))

    const particles = new THREE.BufferGeometry()
    const particlePositions = []
    const particleCount = 200

    for (let i = 0; i < particleCount; i++) {
      particlePositions.push(
        (Math.random() - 0.5) * gridSize,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * gridSize
      )
    }

    particles.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3))

    return { gridGeometry: grid, particleGeometry: particles }
  }, [])

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
      const positions = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group>
      <gridHelper
        ref={gridRef}
        args={[20, 40, '#00ff88', '#0d1117']}
        position={[0, -2, 0]}
      />
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial
          size={0.05}
          color="#00ff88"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(20, 20, 20, 20)]} />
        <lineBasicMaterial color="#00ff88" transparent opacity={0.1} />
      </lineSegments>
    </group>
  )
}

export default CyberGrid