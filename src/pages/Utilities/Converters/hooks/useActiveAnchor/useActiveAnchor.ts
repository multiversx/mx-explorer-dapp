import { useEffect, useState } from 'react';

import { getHeaderNavbarHeight } from '../../helpers';

export interface UseActiveAnchorType {
  anchorIds: string[];
}

export const useActiveAnchor = ({ anchorIds }: UseActiveAnchorType) => {
  const [activeId, setActiveId] = useState(anchorIds[0] ?? '');
  const anchorKey = anchorIds.join(',');

  useEffect(() => {
    const elements = anchorIds
      .map((anchorId) => document.getElementById(anchorId))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) {
      return;
    }

    const visibleIds = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleIds.add(entry.target.id);
          } else {
            visibleIds.delete(entry.target.id);
          }
        });

        const topMostId = anchorIds.find((anchorId) =>
          visibleIds.has(anchorId)
        );

        if (topMostId) {
          setActiveId(topMostId);
        }
      },
      {
        threshold: 0,
        rootMargin: `-${getHeaderNavbarHeight()}px 0px -55% 0px`
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [anchorKey]);

  return { activeId };
};
