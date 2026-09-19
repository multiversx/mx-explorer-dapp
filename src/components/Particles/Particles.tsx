import { lazy, memo, Suspense, useEffect, useRef } from 'react';

import { getSkipAnimation } from 'helpers';
import { useIsCanvasActive } from 'hooks';

const AnimationCanvas = lazy(() =>
  import('./AnimationCanvas').then((module) => ({
    default: module.AnimationCanvas
  }))
);

export const Particles = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const skipAnimation = getSkipAnimation();
  const isActive = useIsCanvasActive(containerRef, !skipAnimation);

  useEffect(() => {
    const onunload = () => {
      document.getElementById('canvas-container')?.remove();
    };

    window.addEventListener('beforeunload', onunload);
    return () => {
      window.removeEventListener('beforeunload', onunload);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`particles ${skipAnimation ? 'static-bg' : ''}`}
      id='canvas-container'
      {...(skipAnimation
        ? { style: { backgroundImage: 'url(/assets/img/three/static-bg.png)' } }
        : {})}
    >
      {!skipAnimation && (
        <Suspense fallback={null}>
          <AnimationCanvas isActive={isActive} />
        </Suspense>
      )}
    </div>
  );
});
