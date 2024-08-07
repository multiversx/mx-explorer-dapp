/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable react/no-unknown-property */

import React, {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from 'react';
import {
  extend,
  Canvas,
  useThree,
  useFrame,
  useLoader
} from '@react-three/fiber';
import * as THREE from 'three';

import { OrbitControls } from 'three-stdlib';
import { UAParser } from 'ua-parser-js';

import circleImg from 'assets/img/three/circle.png';
import { getPrimaryColor } from 'helpers';

extend({ OrbitControls });

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

function isWebGL2Available() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
  } catch (e) {
    return false;
  }
}

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

function isExcluded() {
  const browser = UAParser();
  const excludedOS = ['ubuntu', 'linux'];
  const isExcludedOS = excludedOS.includes(
    browser?.os?.name ? browser.os.name?.replaceAll(' ', '-').toLowerCase() : ''
  );

  return isExcludedOS;
}

function Points({
  pointCount,
  separator
}: {
  pointCount: number;
  separator: number;
}) {
  const isExcludedOS = isExcluded();
  const primary = getPrimaryColor();
  const primaryColor = Number(primary.replace('#', '0x'));

  let t = 0;
  const f = 0.002;
  const a = 3.5;

  const imgTex = useLoader(THREE.TextureLoader, circleImg);
  const bufferRef = useRef<THREE.BufferAttribute>(null);
  const points = useRef<THREE.Points>(null);

  useFrame(() => {
    if (!isExcludedOS) {
      t += 10;

      const positions = bufferRef.current.array;

      let i = 0;
      for (let xi = 0; xi < pointCount; xi++) {
        for (let zi = 0; zi < pointCount; zi++) {
          const x = separator * (xi - pointCount / 2);
          const z = separator * (zi - pointCount / 2);

          positions[i + 1] = graph(x, z);
          i += 3;
        }
      }

      bufferRef.current.needsUpdate = true;
    }
  });

  const graph = useCallback(
    (x, z) => {
      return Math.sin(f * (x ** 2 + z ** 2 + t)) * a;
    },
    [t, f, a]
  );

  const [positions] = useMemo(() => {
    const positions = [];

    for (let xi = 0; xi < pointCount; xi++) {
      for (let zi = 0; zi < pointCount; zi++) {
        const x = separator * (xi - pointCount / 2);
        const z = separator * (zi - pointCount / 2);
        const y = graph(x, z);
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

export const AnimationCanvas = () => {
  return (
    <Canvas
      camera={{
        position: [100, 30, 0],
        fov: 45
      }}
      resize={{ scroll: false }}
    >
      <Suspense fallback={null}>
        <fog attach='fog' args={['#000000', 1, 250]} />
        <Points pointCount={60} separator={3} />
      </Suspense>
      <CameraControls />
    </Canvas>
  );
};

export const Particles = memo(() => {
  const onunload = (e) => {
    document.getElementById('canvas-container')?.remove();
  };

  const isWebGLReady = isWebGLAvailable() && isWebGL2Available();

  useEffect(() => {
    window.addEventListener('beforeunload', onunload);
    return () => {
      window.removeEventListener('beforeunload', onunload);
    };
  }, []);

  const skipAnimation = isExcluded() || !isWebGLReady;

  return (
    <div
      className={`particles ${skipAnimation ? 'static-bg' : ''}`}
      id='canvas-container'
      {...(skipAnimation
        ? { style: { backgroundImage: 'url(/assets/img/three/static-bg.png)' } }
        : {})}
    >
      {!skipAnimation && <AnimationCanvas />}
    </div>
  );
});
