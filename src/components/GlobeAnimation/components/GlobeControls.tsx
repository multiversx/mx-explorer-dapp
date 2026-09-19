import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const IDLE_RESUME_DELAY = 1000;
const HIT_RADIUS_FACTOR = 1.08;

const isCoarsePointer = () =>
  Boolean(window.matchMedia?.('(pointer: coarse)')?.matches);

export const GlobeControls = () => {
  const { camera, gl, size } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) {
      return;
    }

    camera.zoom = Math.min(1, size.width / size.height);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controlsRef.current = controls;

    controls.enablePan = false;
    controls.enableZoom = false;
    controls.rotateSpeed = 0.5;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = -0.92;

    if (isCoarsePointer()) {
      controls.touches.ONE = null;
      gl.domElement.style.touchAction = 'pan-y';
    }

    let resumeTimeoutId: ReturnType<typeof setTimeout> | undefined;
    const onStart = () => {
      clearTimeout(resumeTimeoutId);
      controls.autoRotate = false;
    };
    const onEnd = () => {
      clearTimeout(resumeTimeoutId);
      resumeTimeoutId = setTimeout(() => {
        controls.autoRotate = true;
      }, IDLE_RESUME_DELAY);
    };

    const center = new Vector3();
    const limb = new Vector3();
    const isOverGlobe = (event: MouseEvent) => {
      const { width, height } = gl.domElement.getBoundingClientRect();
      center.set(0, 0, 0).project(camera);
      limb
        .set(1, 0, 0)
        .applyQuaternion(camera.quaternion)
        .multiplyScalar(HIT_RADIUS_FACTOR)
        .project(camera);

      const centerX = ((center.x + 1) / 2) * width;
      const centerY = ((1 - center.y) / 2) * height;
      const radius = Math.hypot(
        ((limb.x + 1) / 2) * width - centerX,
        ((1 - limb.y) / 2) * height - centerY
      );

      return (
        Math.hypot(event.offsetX - centerX, event.offsetY - centerY) <= radius
      );
    };
    const gateControls = (event: MouseEvent) => {
      const isEnabled = isOverGlobe(event);
      controls.enabled = isEnabled;
      gl.domElement.style.cursor = isEnabled ? 'grab' : '';
    };
    const gatedEvents = ['pointermove', 'pointerdown'] as const;

    controls.addEventListener('start', onStart);
    controls.addEventListener('end', onEnd);
    gatedEvents.forEach((type) => {
      gl.domElement.addEventListener(type, gateControls, true);
    });

    return () => {
      clearTimeout(resumeTimeoutId);
      controls.removeEventListener('start', onStart);
      controls.removeEventListener('end', onEnd);
      gatedEvents.forEach((type) => {
        gl.domElement.removeEventListener(type, gateControls, true);
      });
      controls.dispose();
      controlsRef.current = null;
    };
  }, [camera, gl]);

  useFrame(() => {
    controlsRef.current?.update();
  });

  return null;
};
