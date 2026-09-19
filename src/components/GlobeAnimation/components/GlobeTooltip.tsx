import { HoveredMarkerType } from '../types';

export const GlobeTooltip = ({ marker, x, y }: HoveredMarkerType) => (
  <div className='globe-tooltip' style={{ left: x, top: y }}>
    {marker.city ? `${marker.city}: ` : ''}
    {marker.validators} node{marker.validators === 1 ? '' : 's'}
  </div>
);
