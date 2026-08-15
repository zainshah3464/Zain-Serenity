"use client";
import { useRef, Suspense, Component } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";

/* ─────────────────────────────────────
   Bed Model (slight zoom applied)
   ───────────────────────────────────── */
function BedModel() {
  const { scene } = useGLTF("/models/bedroom.glb");
  const ref = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.03;
      ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.04;
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={0.34}            // ⬅️ slight zoom (was 0.3)
      position={[0, -0.5, 0]}
    />
  );
}

/* ─────────────────────────────────────
   Loading fallback with progress bar
   ───────────────────────────────────── */
function LoadingFallback() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-md rounded-2xl px-8 py-6 shadow-lg border border-white/60">
        <div className="w-8 h-8 border-2 border-teal-300 border-t-teal-600 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-gray-600 mb-3">
          Loading 3D Room…
        </p>
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${Math.round(progress)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{Math.round(progress)}%</p>
      </div>
    </Html>
  );
}

/* ─────────────────────────────────────
   Error Boundary – if model fails to load
   ───────────────────────────────────── */
class ModelErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full min-h-[400px] bg-gradient-to-br from-red-50/60 to-white p-8">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              3D Model Load Failed
            </h3>
            <p className="text-sm text-gray-600">
              The 3D room couldn’t be loaded. Please try refreshing the page or
              check your internet connection.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─────────────────────────────────────
   Main 3D Viewer Component
   ───────────────────────────────────── */
export default function Room3DViewer() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden border border-white/60 shadow-2xl bg-gradient-to-br from-teal-50/30 to-white group">
      <ModelErrorBoundary>
        <Canvas
          camera={{ position: [2.6, 1.3, 4.5], fov: 40 }}   // ⬅️ slight zoom in
          dpr={[1, 2]}
          shadows
          style={{ background: "transparent" }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1.2}
              castShadow
              shadow-mapSize={1024}
            />
            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={0.4}
              scale={10}
              blur={2}
              far={4}
            />
            <Environment preset="apartment" />
            <BedModel />
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              minDistance={2.5}
              maxDistance={7}
              autoRotate
              autoRotateSpeed={0.6}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2.3}
              dampingFactor={0.05}
            />
          </Suspense>
        </Canvas>
      </ModelErrorBoundary>

      {/* Bottom hint overlay (unchanged) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}