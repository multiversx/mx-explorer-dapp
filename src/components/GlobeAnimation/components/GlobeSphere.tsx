/* eslint-disable react/no-unknown-property */
import { useMemo } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { AdditiveBlending, BackSide, Color } from 'three';

const ATMOSPHERE_RADIUS = 1.16;

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vPosition = mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 viewDirection = normalize(-vPosition);
    float facing = clamp(-dot(vNormal, viewDirection), 0.0, 1.0);
    float glow = pow(facing, 1.6) * uIntensity;
    gl_FragColor = vec4(uColor * glow, glow);
  }
`;

const stopPropagation = (event: ThreeEvent<PointerEvent>) => {
  event.stopPropagation();
};

export const GlobeSphere = ({ color }: { color: string }) => {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color(color) },
      uIntensity: { value: 1.4 }
    }),
    [color]
  );

  return (
    <>
      <mesh onPointerMove={stopPropagation}>
        <sphereGeometry args={[0.995, 48, 48]} />
        <meshBasicMaterial color='#000000' />
      </mesh>
      <mesh>
        <sphereGeometry args={[ATMOSPHERE_RADIUS, 48, 48]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          side={BackSide}
          blending={AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </mesh>
    </>
  );
};
