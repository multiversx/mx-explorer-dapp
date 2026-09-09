/* eslint-disable react/no-unknown-property */
import { useEffect, useRef } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { InstancedMesh, Object3D } from 'three';

import { MarkerType } from 'types';
import { latLngToVector3 } from '../helpers/latLngToVector3';
import { HoveredMarkerType } from '../types';

const MARKER_ALTITUDE = 1.004;

const getMarkerScale = (validators: number) => {
  if (validators > 100) {
    return 0.022;
  }
  if (validators > 50) {
    return 0.017;
  }
  if (validators > 20) {
    return 0.013;
  }

  return 0.01;
};

interface MarkerDotsType {
  markers: MarkerType[];
  color: string;
  onHover: (hovered?: HoveredMarkerType) => void;
}

export const MarkerDots = ({ markers, color, onHover }: MarkerDotsType) => {
  const meshRef = useRef<InstancedMesh>(null);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    const dummy = new Object3D();
    markers.forEach((marker, index) => {
      latLngToVector3(
        marker.latitude,
        marker.longitude,
        MARKER_ALTITUDE,
        dummy.position
      );
      dummy.scale.setScalar(getMarkerScale(marker.validators));
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.count = markers.length;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [markers]);

  const handleMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const marker =
      event.instanceId !== undefined ? markers[event.instanceId] : undefined;
    if (!marker) {
      onHover(undefined);
      return;
    }

    onHover({
      marker,
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY
    });
  };

  return (
    <instancedMesh
      key={markers.length}
      ref={meshRef}
      args={[undefined, undefined, markers.length]}
      onPointerMove={handleMove}
      onPointerOut={() => onHover(undefined)}
    >
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial color={color} />
    </instancedMesh>
  );
};
