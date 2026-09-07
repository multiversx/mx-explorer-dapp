let cachedIsTouchDevice: boolean | undefined;

const detectTouchDevice = () => {
  try {
    if (window.PointerEvent && 'maxTouchPoints' in navigator) {
      if (navigator.maxTouchPoints > 0) {
        return true;
      }
    }

    if (
      window.matchMedia &&
      window.matchMedia('(any-pointer:coarse)').matches
    ) {
      return true;
    }

    if (window.TouchEvent || 'ontouchstart' in window) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
};

export const isTouchDevice = () => {
  if (cachedIsTouchDevice === undefined) {
    cachedIsTouchDevice = detectTouchDevice();
  }

  return cachedIsTouchDevice;
};
