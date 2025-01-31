import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function RoomStructure() {
  // Materiali
  const materials = useMemo(() => ({
    wall: new THREE.MeshStandardMaterial({
      color: '#e6e6e6',
      roughness: 0.9,
      metalness: 0.1
    }),
    floor: new THREE.MeshStandardMaterial({
      color: '#d4cdc5',  // Colore parquet
      roughness: 0.8,
      metalness: 0.1
    })
  }), [])

  return (
    <group>
      {/* Illuminazione */}
      <ambientLight intensity={0.4} color="#b4c4e4" />
      
      {/* Luce dalla finestra */}
      <directionalLight
        position={[0, 2, -4]}
        intensity={1.2}
        color="#ffd4a5"
        castShadow
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera 
          attach="shadow-camera" 
          args={[-10, 10, 10, -10]} 
        />
      </directionalLight>

      {/* Pavimento */}
      <mesh 
        receiveShadow 
        rotation-x={-Math.PI / 2} 
        position={[0, 0, 0]}
      >
        <planeGeometry args={[8, 12]} />
        <primitive object={floorMaterial} />
      </mesh>

      {/* Pareti */}
      {/* Parete posteriore con finestra */}
      <group position={[0, 1.5, -6]}>
        {/* Parte superiore */}
        <mesh receiveShadow position={[0, 1.25, 0]}>
          <boxGeometry args={[8, 0.5, 0.2]} />
          <primitive object={wallMaterial} />
        </mesh>
        
        {/* Parti laterali */}
        <mesh receiveShadow position={[-2.5, 0, 0]}>
          <boxGeometry args={[3, 2, 0.2]} />
          <primitive object={wallMaterial} />
        </mesh>
        <mesh receiveShadow position={[2.5, 0, 0]}>
          <boxGeometry args={[3, 2, 0.2]} />
          <primitive object={wallMaterial} />
        </mesh>
        
        {/* Parte inferiore */}
        <mesh receiveShadow position={[0, -1.25, 0]}>
          <boxGeometry args={[8, 0.5, 0.2]} />
          <primitive object={wallMaterial} />
        </mesh>
      </group>

      {/* Parete sinistra */}
      <mesh 
        receiveShadow 
        position={[-4, 1.5, 0]} 
        rotation={[0, Math.PI / 2, 0]}
      >
        <boxGeometry args={[12, 3, 0.2]} />
        <primitive object={wallMaterial} />
      </mesh>

      {/* Parete destra */}
      <mesh 
        receiveShadow 
        position={[4, 1.5, 0]} 
        rotation={[0, -Math.PI / 2, 0]}
      >
        <boxGeometry args={[12, 3, 0.2]} />
        <primitive object={wallMaterial} />
      </mesh>

      {/* Effetto volumetrico dalla finestra */}
      <mesh 
        position={[0, 1.5, -5.9]} 
        rotation={[0, 0, 0]}
      >
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial 
          color="#ffd4a5" 
          transparent 
          opacity={0.1} 
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Luce di riempimento per le ombre */}
      <pointLight
        position={[-2, 2, 2]}
        intensity={0.2}
        color="#ffecd1"
      />
    </group>
  )
}