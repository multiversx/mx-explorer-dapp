import { RefObject, useEffect, useState } from 'react';

export const useIsCanvasActive = (
  containerRef: RefObject<HTMLElement | null>,
  isEnabled = true
) => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isEnabled || !containerRef.current) {
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
  }, [isEnabled]);

  return isActive;
};
