import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function FloatingNodes() {
  const groupRef = useRef()
  const nodesRef = useRef([])

  const nodes = useMemo(() => {
    return [...Array(15)].map(() => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 10
      ],
      scale: 0.1 + Math.random() * 0.15,
      speed: 0.5 + Math.random() * 1,
      offset: Math.random() * Math.PI * 2
    }))
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    nodesRef.current.forEach((node, i) => {
      if (node) {
        const nodeData = nodes[i]
        node.position.y = nodeData.position[1] + Math.sin(time * nodeData.speed + nodeData.offset) * 0.5
        node.position.x = nodeData.position[0] + Math.cos(time * nodeData.speed * 0.5 + nodeData.offset) * 0.3
        node.scale.setScalar(nodeData.scale + Math.sin(time * 2 + nodeData.offset) * 0.02)
      }
    })
  })

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <mesh
          key={i}
          ref={(el) => (nodesRef.current[i] = el)}
          position={node.position}
        >
          <icosahedronGeometry args={[node.scale, 0]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? '#00ff88' : i % 3 === 1 ? '#0ea5e9' : '#8b5cf6'}
            wireframe
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
      <Connections nodes={nodes} />
    </group>
  )
}

function Connections({ nodes }) {
  const lineRef = useRef()

  const { geometry } = useMemo(() => {
    const points = []
    for (let i = 0; i < nodes.length; i += 3) {
      if (nodes[i + 1]) {
        points.push(
          new THREE.Vector3(...nodes[i].position),
          new THREE.Vector3(...nodes[i + 1].position)
        )
      }
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    return { geometry: geo }
  }, [nodes])

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.material.opacity = 0.1 + Math.sin(state.clock.elapsedTime) * 0.05
    }
  })

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#00ff88" transparent opacity={0.15} />
    </lineSegments>
  )
}

export default FloatingNodes