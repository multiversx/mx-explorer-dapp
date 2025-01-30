export const isTouchDevice = () => {
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
