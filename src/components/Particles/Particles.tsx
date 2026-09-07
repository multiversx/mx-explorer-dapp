import { lazy, memo, Suspense, useEffect, useRef, useState } from 'react';
import { UAParser } from 'ua-parser-js';

const AnimationCanvas = lazy(() =>
  import('./AnimationCanvas').then((module) => ({
    default: module.AnimationCanvas
  }))
);

function releaseContext(context: RenderingContext | null) {
  const loseContext = (context as WebGLRenderingContext | null)?.getExtension?.(
    'WEBGL_lose_context'
  );

  loseContext?.loseContext();
}

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    const context =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    releaseContext(context);

    return !!(window.WebGLRenderingContext && context);
  } catch (e) {
    return false;
  }
}

function isWebGL2Available() {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');

    releaseContext(context);

    return !!(window.WebGL2RenderingContext && context);
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

function prefersReducedMotion() {
  return Boolean(
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  );
}

const skipAnimation =
  isExcluded() ||
  prefersReducedMotion() ||
  !(isWebGLAvailable() && isWebGL2Available());

export const Particles = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const onunload = () => {
      document.getElementById('canvas-container')?.remove();
    };

    window.addEventListener('beforeunload', onunload);
    return () => {
      window.removeEventListener('beforeunload', onunload);
    };
  }, []);

  useEffect(() => {
    if (skipAnimation || !containerRef.current) {
      return;
    }

    let isVisible = true;

    const sync = () => setIsActive(isVisible && !document.hidden);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    observer.observe(containerRef.current);

    document.addEventListener('visibilitychange', sync);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
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
