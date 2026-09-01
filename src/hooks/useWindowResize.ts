import { useSyncExternalStore } from 'react';

type ListenerType = () => void;

const listeners = new Set<ListenerType>();

let resizeCount = 0;

const onResize = () => {
  resizeCount += 1;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: ListenerType) => {
  if (listeners.size === 0) {
    window.addEventListener('resize', onResize);
  }
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener('resize', onResize);
    }
  };
};

const getSnapshot = () => resizeCount;

export const useWindowResize = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
