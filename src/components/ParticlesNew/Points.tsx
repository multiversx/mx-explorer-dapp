/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable react/no-unknown-property */

/* Based on Nicolo's article on FBO Particles https://barradeau.com/blog/?p=621 and htsps://github.com/marioecg/gpu-party/ */

import { useMemo, useState, useRef } from 'react';
import { useFBO } from '@react-three/drei';
import { createPortal, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import './shaders/simulationMaterial';
import './shaders/dofPointsMaterial';


export function Points({
  speed,
  fov,
  aperture,
  focus,
  curl,
  size = 512,
  ...props
}) {
  const simRef = useRef();
  const renderRef = useRef();
  const [scene] = useState(() => new THREE.Scene());
  const [camera] = useState(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1)
  );
  const [positions] = useState(
    () =>
      new Float32Array([
        -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0
      ])
  );
  const [uvs] = useState(
    () => new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0])
  );
  const target = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType
  });
  // Normalize points
  const particles = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);
  // Update FBO and pointcloud every frame
  useFrame((state) => {
    state.gl.setRenderTarget(target);
    state.gl.clear();
    state.gl.render(scene, camera);
    state.gl.setRenderTarget(null);
    renderRef.current.uniforms.positions.value = target.texture;
    renderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    renderRef.current.uniforms.uFocus.value = THREE.MathUtils.lerp(
      renderRef.current.uniforms.uFocus.value,
      focus,
      0.1
    );
    renderRef.current.uniforms.uFov.value = THREE.MathUtils.lerp(
      renderRef.current.uniforms.uFov.value,
      fov,
      0.1
    );
    renderRef.current.uniforms.uBlur.value = THREE.MathUtils.lerp(
      renderRef.current.uniforms.uBlur.value,
      (5.6 - aperture) * 9,
      0.1
    );
    simRef.current.uniforms.uTime.value = state.clock.elapsedTime * speed;
    simRef.current.uniforms.uCurlFreq.value = THREE.MathUtils.lerp(
      simRef.current.uniforms.uCurlFreq.value,
      curl,
      0.1
    );
  });
  return (
    <>
      {createPortal(
        <mesh>
          <simulationMaterial ref={simRef} />
          <bufferGeometry>
            <bufferAttribute
              attach='attributes-position'
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach='attributes-uv'
              count={uvs.length / 2}
              array={uvs}
              itemSize={2}
            />
            <bufferAttribute
              attach='attributes-color'
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points {...props}>
        <dofPointsMaterial ref={renderRef} />
        <bufferGeometry>
          <bufferAttribute
            attach='attributes-position'
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
      </points>
    </>
  );
}
