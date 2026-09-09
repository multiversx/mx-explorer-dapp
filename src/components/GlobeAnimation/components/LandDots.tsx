/* eslint-disable react/no-unknown-property */
import { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

import circleImg from 'assets/img/three/circle.png';
import countries from 'components/ValidatorMap/countries100m.json';
import { buildLandPoints } from '../helpers/buildLandPoints';

const SAMPLE_COUNT = 18000;
const DOT_SIZE = 0.028;

export const LandDots = ({ color }: { color: string }) => {
  const texture = useLoader(TextureLoader, circleImg);
  const positions = useMemo(() => buildLandPoints(countries, SAMPLE_COUNT), []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach='attributes-position' args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        color={color}
        size={DOT_SIZE}
        sizeAttenuation
        transparent
        opacity={0.55}
        alphaTest={0.05}
        depthWrite={false}
      />
    </points>
  );
};
