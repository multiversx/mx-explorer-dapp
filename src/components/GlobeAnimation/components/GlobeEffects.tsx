/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  RingGeometry,
  ShaderMaterial,
  TubeGeometry,
  Vector3
} from 'three';

import { arcCurve } from '../helpers/arcCurve';
import { GlobeEventType, GlobePointType } from '../helpers/buildGlobeEvent';
import { latLngToVector3 } from '../helpers/latLngToVector3';

const ARC_POOL_SIZE = 12;
const RING_POOL_SIZE = 10;
const ARC_DRAW_DURATION = 1.1;
const ARC_FADE_DURATION = 1.0;
const RING_DURATION = 1.3;
const RING_SCALE = 4;
const ARC_RADIUS = 0.006;
const SURFACE_OFFSET = 1.006;

const arcVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const arcFragmentShader = `
  uniform float uHead;
  uniform float uTail;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    float t = vUv.x;
    if (t > uHead || t < uTail) {
      discard;
    }
    float fade = smoothstep(uTail, uTail + 0.4, t);
    float tip = 0.6 + 0.4 * smoothstep(uHead - 0.15, uHead, t);
    gl_FragColor = vec4(uColor * tip, fade);
  }
`;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

interface ArcType {
  mesh: Mesh<BufferGeometry, ShaderMaterial>;
  startTime: number;
  isActive: boolean;
}

interface RingType {
  mesh: Mesh<RingGeometry, MeshBasicMaterial>;
  startTime: number;
  isActive: boolean;
}

interface GlobeEffectsType {
  event?: GlobeEventType;
  color: string;
}

const toSurface = (point: GlobePointType) =>
  latLngToVector3(point.latitude, point.longitude, SURFACE_OFFSET);

const orientRing = (mesh: Mesh, position: Vector3) => {
  mesh.position.copy(position);
  mesh.lookAt(position.clone().multiplyScalar(2));
};

export const GlobeEffects = ({ event, color }: GlobeEffectsType) => {
  const colorValue = useMemo(() => new Color(color), [color]);
  const pendingRef = useRef<{ position: Vector3; fireAt: number }[]>([]);
  const clockRef = useRef(0);

  const arcs = useMemo<ArcType[]>(
    () =>
      Array.from({ length: ARC_POOL_SIZE }, () => {
        const material = new ShaderMaterial({
          vertexShader: arcVertexShader,
          fragmentShader: arcFragmentShader,
          uniforms: {
            uHead: { value: 0 },
            uTail: { value: 0 },
            uColor: { value: colorValue }
          },
          transparent: true,
          depthWrite: false,
          blending: AdditiveBlending
        });
        const mesh = new Mesh(new BufferGeometry(), material);
        mesh.visible = false;
        mesh.frustumCulled = false;

        return { mesh, startTime: 0, isActive: false };
      }),
    [colorValue]
  );

  const rings = useMemo<RingType[]>(
    () =>
      Array.from({ length: RING_POOL_SIZE }, () => {
        const material = new MeshBasicMaterial({
          color: colorValue,
          transparent: true,
          opacity: 0,
          side: DoubleSide,
          depthWrite: false,
          blending: AdditiveBlending
        });
        const mesh = new Mesh(new RingGeometry(0.018, 0.026, 40), material);
        mesh.visible = false;

        return { mesh, startTime: 0, isActive: false };
      }),
    [colorValue]
  );

  useEffect(
    () => () => {
      arcs.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
      rings.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
    },
    [arcs, rings]
  );

  useEffect(() => {
    if (!event) {
      return;
    }

    const now = clockRef.current;
    const source = toSurface(event.source);

    pendingRef.current.push(
      { position: source, fireAt: now },
      { position: source, fireAt: now + 0.25 }
    );

    event.targets.forEach((target) => {
      const arc = arcs.find((candidate) => !candidate.isActive);
      if (!arc) {
        return;
      }

      const end = toSurface(target);
      arc.mesh.geometry.dispose();
      arc.mesh.geometry = new TubeGeometry(
        arcCurve(source, end),
        64,
        ARC_RADIUS,
        4,
        false
      );
      arc.mesh.material.uniforms.uHead.value = 0;
      arc.mesh.material.uniforms.uTail.value = 0;
      arc.mesh.visible = true;
      arc.startTime = now;
      arc.isActive = true;

      pendingRef.current.push({
        position: end,
        fireAt: now + ARC_DRAW_DURATION
      });
    });
  }, [event?.id]);

  useFrame(({ clock }) => {
    const now = clock.getElapsedTime();
    clockRef.current = now;

    arcs.forEach((arc) => {
      if (!arc.isActive) {
        return;
      }

      const elapsed = now - arc.startTime;
      const { uniforms } = arc.mesh.material;

      if (elapsed < ARC_DRAW_DURATION) {
        uniforms.uHead.value = easeOutCubic(elapsed / ARC_DRAW_DURATION);
        uniforms.uTail.value = 0;
        return;
      }

      uniforms.uHead.value = 1;
      const fadeProgress = (elapsed - ARC_DRAW_DURATION) / ARC_FADE_DURATION;
      if (fadeProgress >= 1) {
        arc.isActive = false;
        arc.mesh.visible = false;
        return;
      }
      uniforms.uTail.value = easeInOutQuad(fadeProgress);
    });

    pendingRef.current = pendingRef.current.filter((pending) => {
      if (pending.fireAt > now) {
        return true;
      }

      const ring = rings.find((candidate) => !candidate.isActive);
      if (ring) {
        orientRing(ring.mesh, pending.position);
        ring.mesh.scale.setScalar(1);
        ring.mesh.material.opacity = 1;
        ring.mesh.visible = true;
        ring.startTime = now;
        ring.isActive = true;
      }

      return false;
    });

    rings.forEach((ring) => {
      if (!ring.isActive) {
        return;
      }

      const progress = (now - ring.startTime) / RING_DURATION;
      if (progress >= 1) {
        ring.isActive = false;
        ring.mesh.visible = false;
        return;
      }

      const eased = easeOutCubic(progress);
      ring.mesh.scale.setScalar(1 + eased * (RING_SCALE - 1));
      ring.mesh.material.opacity = 1 - eased;
    });
  });

  return (
    <group>
      {arcs.map((arc, index) => (
        <primitive key={`arc-${index}`} object={arc.mesh} />
      ))}
      {rings.map((ring, index) => (
        <primitive key={`ring-${index}`} object={ring.mesh} />
      ))}
    </group>
  );
};
