import { useMemo } from 'react';

import { useFetchMarkers } from 'hooks';
import { useBlockFeed } from './useBlockFeed';
import { useGlobeMarkers } from './useGlobeMarkers';
import { buildGlobeEvent } from '../helpers/buildGlobeEvent';

export const useGlobeFeed = () => {
  useFetchMarkers();

  const markers = useGlobeMarkers();
  const activeBlock = useBlockFeed(true);
  const event = useMemo(
    () => (activeBlock ? buildGlobeEvent(activeBlock, markers) : undefined),
    [activeBlock, markers]
  );

  return { markers, activeBlock, event };
};
