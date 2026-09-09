import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';

import { getPrimaryColor } from 'helpers';
import { MarkerType } from 'types';
import { GlobeControls } from './components/GlobeControls';
import { GlobeEffects } from './components/GlobeEffects';
import { GlobeSphere } from './components/GlobeSphere';
import { LandDots } from './components/LandDots';
import { MarkerDots } from './components/MarkerDots';
import { GlobeEventType } from './helpers/buildGlobeEvent';
import { latLngToVector3 } from './helpers/latLngToVector3';
import { HoveredMarkerType } from './types';

const CAMERA_DISTANCE = 3.7;
const INITIAL_VIEW_LATITUDE = 22;
const INITIAL_VIEW_LONGITUDE = 15;

const initialCameraPosition = latLngToVector3(
  INITIAL_VIEW_LATITUDE,
  INITIAL_VIEW_LONGITUDE,
  CAMERA_DISTANCE
).toArray();

export interface GlobeCanvasType {
  markers: MarkerType[];
  event?: GlobeEventType;
  isActive: boolean;
  onHover: (hovered?: HoveredMarkerType) => void;
}

export const GlobeCanvas = ({
  markers,
  event,
  isActive,
  onHover
}: GlobeCanvasType) => {
  const primaryColor = useMemo(() => getPrimaryColor() || '#23f7dd', []);

  return (
    <Canvas
      camera={{ fov: 40, position: initialCameraPosition, near: 0.1, far: 20 }}
      resize={{ scroll: false }}
      frameloop={isActive ? 'always' : 'never'}
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
        alpha: true
      }}
    >
      <Suspense fallback={null}>
        <GlobeSphere color={primaryColor} />
        <LandDots color={primaryColor} />
        <MarkerDots markers={markers} color={primaryColor} onHover={onHover} />
        <GlobeEffects event={event} color={primaryColor} />
        <GlobeControls />
      </Suspense>
    </Canvas>
  );
};
