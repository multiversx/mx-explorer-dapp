import { memo, useRef, useState } from 'react';

import { lazyChart } from 'components/Chart/helpers/lazyChart';
import { useIsCanvasActive } from 'hooks';
import { MarkerType } from 'types';
import { GlobeErrorBoundary } from './components/GlobeErrorBoundary';
import { GlobeTooltip } from './components/GlobeTooltip';
import type { GlobeCanvasType } from './GlobeCanvas';
import { GlobeEventType } from './helpers/buildGlobeEvent';
import { HoveredMarkerType } from './types';

const GlobeCanvas = lazyChart<GlobeCanvasType>(() =>
  import('./GlobeCanvas').then((module) => ({ default: module.GlobeCanvas }))
);

export interface GlobeAnimationType {
  markers: MarkerType[];
  event?: GlobeEventType;
}

export const GlobeAnimation = memo(({ markers, event }: GlobeAnimationType) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isActive = useIsCanvasActive(containerRef);
  const [hovered, setHovered] = useState<HoveredMarkerType>();

  return (
    <div
      className='globe-animation'
      ref={containerRef}
      data-testid='globeAnimation'
    >
      <GlobeErrorBoundary>
        <GlobeCanvas
          markers={markers}
          event={event}
          isActive={isActive}
          onHover={setHovered}
        />
      </GlobeErrorBoundary>
      {hovered && <GlobeTooltip {...hovered} />}
    </div>
  );
});
