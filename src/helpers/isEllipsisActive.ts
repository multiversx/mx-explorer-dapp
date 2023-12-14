export const isEllipsisActive = (e?: HTMLDivElement | null) => {
  if (e) {
    try {
      return e?.offsetWidth < e?.scrollWidth;
    } catch {
      return true;
    }
  }

  return true;
};
