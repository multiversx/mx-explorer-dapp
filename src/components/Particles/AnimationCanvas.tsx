/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable react/no-unknown-property */

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

import circleImg from 'assets/img/three/circle.png';
import { getPrimaryColor } from 'helpers';

const POINT_COUNT = 60;
const SEPARATOR = 3;

const FREQUENCY = 0.002;
const AMPLITUDE = 3.5;
const TIME_STEP = 10;

const CAMERA_RADIUS = 100;
const CAMERA_HEIGHT = 30;
const AUTO_ROTATE_SPEED = (-0.2 * 2 * Math.PI) / 60 / 60;

function Points() {
  const imgTex = useLoader(THREE.TextureLoader, circleImg);
  const bufferRef = useRef<THREE.BufferAttribute>(null);

  const primaryColor = useMemo(
    () => Number(getPrimaryColor().replace('#', '0x')),
    []
  );

  const { positions, sinPhase, cosPhase } = useMemo(() => {
    const total = POINT_COUNT * POINT_COUNT;
    const positions = new Float32Array(total * 3);
    const sinPhase = new Float32Array(total);
    const cosPhase = new Float32Array(total);

    let point = 0;
    for (let xi = 0; xi < POINT_COUNT; xi++) {
      for (let zi = 0; zi < POINT_COUNT; zi++) {
        const x = SEPARATOR * (xi - POINT_COUNT / 2);
        const z = SEPARATOR * (zi - POINT_COUNT / 2);
        const phase = FREQUENCY * (x ** 2 + z ** 2);

        sinPhase[point] = Math.sin(phase);
        cosPhase[point] = Math.cos(phase);

        positions[point * 3] = x;
        positions[point * 3 + 1] = AMPLITUDE * sinPhase[point];
        positions[point * 3 + 2] = z;

        point++;
      }
    }

    return { positions, sinPhase, cosPhase };
  }, []);

  const timeRef = useRef(0);
  const cameraAngleRef = useRef(0);

  useFrame(({ camera }) => {
    timeRef.current += TIME_STEP;

    const angle = FREQUENCY * timeRef.current;
    const sinB = Math.sin(angle);
    const cosB = Math.cos(angle);

    const array = bufferRef.current.array;
    for (let i = 0; i < sinPhase.length; i++) {
      array[i * 3 + 1] = AMPLITUDE * (sinPhase[i] * cosB + cosPhase[i] * sinB);
    }
    bufferRef.current.needsUpdate = true;

    cameraAngleRef.current += AUTO_ROTATE_SPEED;
    camera.position.set(
      CAMERA_RADIUS * Math.cos(cameraAngleRef.current),
      CAMERA_HEIGHT,
      CAMERA_RADIUS * Math.sin(cameraAngleRef.current)
    );
    camera.lookAt(0, 0, 0);
  });

  return (
    <points>
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
        color={primaryColor}
        size={0.5}
        sizeAttenuation
        transparent={false}
        alphaTest={0.5}
        opacity={1.0}
      />
    </points>
  );
}

export const AnimationCanvas = ({ isActive }: { isActive: boolean }) => {
  return (
    <Canvas
      camera={{
        position: [CAMERA_RADIUS, CAMERA_HEIGHT, 0],
        fov: 45
      }}
      resize={{ scroll: false }}
      frameloop={isActive ? 'always' : 'never'}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <fog attach='fog' args={['#000000', 1, 250]} />
        <Points />
      </Suspense>
    </Canvas>
  );
};
