// @ts-nocheck
/* eslint-disable react/no-unknown-property */

import React, { memo, useRef, Suspense, useCallback, useMemo } from 'react';
import {
  extend,
  Canvas,
  useThree,
  useFrame,
  useLoader
} from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

import circleImg from './../../assets/img/three/circle.png';

extend({ OrbitControls });

function CameraControls() {
  const {
    camera,
    gl: { domElement }
  } = useThree();

  const controlsRef = useRef();
  useFrame(() => controlsRef.current.update());

  return (
    <orbitControls
      ref={controlsRef}
      args={[camera, domElement]}
      autoRotate
      autoRotateSpeed={-0.2}
      enabled={false}
    />
  );
}

function Points({
  pointCount,
  separator
}: {
  pointCount: number;
  separator: number;
}) {
  let t = 0;
  let f = 0.002;
  let a = 3.5;

  const imgTex = useLoader(THREE.TextureLoader, circleImg);
  const bufferRef = useRef<THREE.BufferAttribute>(null);
  const points = useRef<THREE.Points>(null);

  useFrame(() => {
    t += 10;

    const positions = bufferRef.current.array;

    let i = 0;
    for (let xi = 0; xi < pointCount; xi++) {
      for (let zi = 0; zi < pointCount; zi++) {
        let x = separator * (xi - pointCount / 2);
        let z = separator * (zi - pointCount / 2);

        positions[i + 1] = graph(x, z);
        i += 3;
      }
    }

    bufferRef.current.needsUpdate = true;
  });

  const graph = useCallback(
    (x, z) => {
      return Math.sin(f * (x ** 2 + z ** 2 + t)) * a;
    },
    [t, f, a]
  );

  const [positions] = useMemo(() => {
    let positions = [];

    for (let xi = 0; xi < pointCount; xi++) {
      for (let zi = 0; zi < pointCount; zi++) {
        let x = separator * (xi - pointCount / 2);
        let z = separator * (zi - pointCount / 2);
        let y = graph(x, z);
        positions.push(x, y, z);
      }
    }

    return [new Float32Array(positions)];
  }, [pointCount, separator, graph]);

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          ref={bufferRef}
          attach='attributes-position'
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        attach='material'
        map={imgTex}
        depthWrite={false}
        color={0x23f7dd}
        size={0.5}
        sizeAttenuation
        transparent={false}
        alphaTest={0.5}
        opacity={1.0}
      />
    </points>
  );
}

export const AnimationCanvas = () => {
  return (
    <Canvas
      camera={{
        position: [100, 30, 0],
        fov: 45
      }}
      resize={{ scroll: false }}
      style={{ background: '#000000' }}
    >
      <Suspense fallback={null}>
        <fog attach='fog' args={['#000000', 1, 250]} />
        <Points pointCount={60} separator={3} />
      </Suspense>
      {/* <CameraControls /> */}
    </Canvas>
  );
};

export const Particles = memo(() => (
  <div className='particles'>
    <Suspense fallback={null}>
      <AnimationCanvas />
    </Suspense>
  </div>
));
