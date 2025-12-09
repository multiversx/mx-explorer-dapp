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
import { OrbitControls } from '@react-three/drei';
import {
  extend,
  Canvas,
  useThree,
  useFrame,
  useLoader
} from '@react-three/fiber';
import * as THREE from 'three';
import { UAParser } from 'ua-parser-js';

import circleImg from 'assets/img/three/circle.png';
import { getPrimaryColor } from 'helpers';

import { Points } from './Points';

extend({ OrbitControls });

function getRandom(min: number, max: number) {
  return Number((Math.random() * (max - min) + min).toPrecision(2));
}

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

function isExcluded() {
  const browser = UAParser();
  const excludedOS = ['ubuntu', 'linux', 'debian', 'fedora'];
  const isExcludedOS = excludedOS.includes(
    browser?.os?.name ? browser.os.name?.replaceAll(' ', '-').toLowerCase() : ''
  );

  return isExcludedOS;
}

export const AnimationCanvas = () => {
  // const props = useControls({
  //   focus: { value: getRandom(4.5, 7), min: 3, max: 8, step: 0.01 },
  //   speed: { value: getRandom(5, 15), min: 0.1, max: 100, step: 0.1 },
  //   aperture: { value: getRandom(4.2, 5), min: 1, max: 5.6, step: 0.1 },
  //   fov: { value: getRandom(15, 30), min: 0, max: 200 },
  //   curl: { value: getRandom(0.1, 0.4), min: 0.01, max: 0.5, step: 0.01 }
  // });

  const initialProps = {
    focus: getRandom(4.5, 7),
    speed: getRandom(5, 15),
    aperture: getRandom(4.2, 5),
    fov: getRandom(15, 30),
    curl: getRandom(0.1, 0.4)
  };

  return (
    <Canvas
      camera={{
        position: [4, 4, 0],
        fov: 20
      }}
      resize={{ scroll: false }}
    >
      <Suspense fallback={null}>
        <fog attach='fog' args={['#000000', 1, 250]} />
        <Points {...initialProps} />
      </Suspense>
      <OrbitControls
        makeDefault
        autoRotate
        autoRotateSpeed={getRandom(0.4, 0.9)}
        enableZoom={false}
        zoomSpeed={0.1}
      />
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
