import { UAParser } from 'ua-parser-js';

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

let skipAnimation: boolean | undefined;

export const getSkipAnimation = () => {
  if (skipAnimation === undefined) {
    skipAnimation =
      isExcluded() ||
      prefersReducedMotion() ||
      !(isWebGLAvailable() && isWebGL2Available());
  }

  return skipAnimation;
};
