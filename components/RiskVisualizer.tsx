
import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { DocOverlay } from './DocOverlay';

const Group = 'group' as any;
const Mesh = 'mesh' as any;
const SphereGeometry = 'sphereGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;

interface RiskVisualizerProps {
  uncertainty: number;
}

const EntropyCore: React.FC<RiskVisualizerProps> = ({ uncertainty }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const wireRef1 = useRef<THREE.Mesh>(null!);
  const wireRef2 = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();
  const count = 3000;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 0.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Smoothly follow mouse
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.5, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.5, 0.05);
    
    // Pulse animation
    const pulse = Math.sin(time * 2) * 0.05 * uncertainty;
    groupRef.current.scale.setScalar(1 + pulse);

    const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const phase = (time + i) * 0.5;
      const jitter = (Math.sin(phase) * 0.015) * (1 + uncertainty * 3);
      positionsArray[ix] += jitter;
      positionsArray[ix + 1] += jitter;
      positionsArray[ix + 2] += jitter;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    pointsRef.current.rotation.y += 0.002 * (1 + uncertainty * 5);
    wireRef1.current.rotation.y -= 0.001 * (1 + uncertainty * 2);
    wireRef2.current.rotation.z += 0.001 * (1 + uncertainty * 2);
  });

  const coreColor = uncertainty > 0.7 ? '#ef4444' : uncertainty > 0.4 ? '#fbbf24' : '#22d3ee';

  return (
    <Group ref={groupRef}>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial 
          transparent 
          color={coreColor} 
          size={0.02} 
          sizeAttenuation 
          depthWrite={false} 
          blending={THREE.AdditiveBlending} 
          opacity={0.5}
        />
      </Points>
      
      {/* Primary Thick Wireframe */}
      <Mesh ref={wireRef1}>
        <SphereGeometry args={[1.2, 24, 24]} />
        <MeshStandardMaterial 
          color={coreColor} 
          emissive={coreColor} 
          emissiveIntensity={2} 
          wireframe 
          transparent 
          opacity={0.2} 
        />
      </Mesh>

      {/* Secondary Offset Wireframe for "Thick" feel */}
      <Mesh ref={wireRef2} scale={[1.01, 1.01, 1.01]}>
        <SphereGeometry args={[1.2, 16, 16]} />
        <MeshStandardMaterial 
          color={coreColor} 
          emissive={coreColor} 
          emissiveIntensity={1} 
          wireframe 
          transparent 
          opacity={0.15} 
        />
      </Mesh>
    </Group>
  );
};

const RiskVisualizer: React.FC<RiskVisualizerProps> = ({ uncertainty }) => {
  return (
    <div className="w-full h-[500px] bg-slate-900/40 rounded-xl border border-slate-800/60 overflow-hidden relative group transition-all duration-500 hover:border-cyan-500/30">
      <DocOverlay 
        title="System Dynamics Engine" 
        description="Core latent space simulation. The point cloud density represents system coherence. Dispersal and red-shifting indicate high-entropy states requiring operator attention."
        units="Latent Entropy (0.000-1.000)"
      />
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #22d3ee 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
        <AmbientLight intensity={0.4} />
        <PointLight position={[10, 10, 10]} intensity={2} color="#22d3ee" />
        <EntropyCore uncertainty={uncertainty} />
      </Canvas>

      {/* Embedded Metrics Overlays */}
      <div className="absolute top-6 left-6 pointer-events-none space-y-1">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Live Dynamics Engine</h3>
        <p className="text-2xl font-mono text-white tracking-tighter">CORE_V4.2.1</p>
        <div className="flex items-center gap-2 pt-2">
          <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${(1 - uncertainty) * 100}%` }}></div>
          </div>
          <span className="text-[9px] font-mono text-cyan-400">STABILITY: {((1-uncertainty)*100).toFixed(1)}%</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-4 pointer-events-none">
        <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg backdrop-blur-md">
          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active Nodes</p>
          <p className="text-sm font-mono text-cyan-500">1,024 / 4,096</p>
        </div>
        <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg backdrop-blur-md">
          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Latent Entropy</p>
          <p className="text-sm font-mono text-amber-500">{(uncertainty * 0.1).toFixed(4)}</p>
        </div>
        <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg backdrop-blur-md">
          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Signal Coherence</p>
          <p className="text-sm font-mono text-emerald-500">{((1 - uncertainty) * 0.998).toFixed(3)}</p>
        </div>
      </div>
    </div>
  );
};

export default RiskVisualizer;
