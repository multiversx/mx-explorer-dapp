import { BlockType, MarkerType } from 'types';
import { pickRandomMarker, resolveLocation } from './resolveLocation';

export interface GlobePointType {
  latitude: number;
  longitude: number;
}

export interface GlobeEventType {
  id: string;
  source: GlobePointType;
  targets: GlobePointType[];
  isMatched: boolean;
}

const TARGET_COUNT = 2;

const toPoint = ({ latitude, longitude }: GlobePointType): GlobePointType => ({
  latitude,
  longitude
});

export const buildGlobeEvent = (
  block: BlockType,
  markers: MarkerType[]
): GlobeEventType | undefined => {
  if (markers.length === 0) {
    return undefined;
  }

  const resolved = resolveLocation(block.proposerIdentity?.location, markers);
  const sourceMarker = resolved ? undefined : pickRandomMarker(markers);
  const source = resolved ?? sourceMarker;

  if (!source) {
    return undefined;
  }

  const targets: GlobePointType[] = [];
  const used = new Set<MarkerType>(sourceMarker ? [sourceMarker] : []);

  for (let i = 0; i < TARGET_COUNT; i++) {
    const candidate = pickRandomMarker(
      markers.filter((marker) => !used.has(marker))
    );
    if (!candidate) {
      break;
    }
    used.add(candidate);
    targets.push(toPoint(candidate));
  }

  return {
    id: block.hash,
    source: toPoint(source),
    targets,
    isMatched: Boolean(resolved?.isMatched)
  };
};
