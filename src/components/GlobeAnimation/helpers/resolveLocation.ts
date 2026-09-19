import { MarkerType } from 'types';
import {
  CONTINENTS,
  GEOCODE_CITIES,
  GEOCODE_REGIONS,
  LatLngType
} from './geocodeTable';
import { normalizeLocation } from './normalizeLocation';

export interface ResolvedLocationType {
  latitude: number;
  longitude: number;
  isMatched: boolean;
}

const getCandidates = (location: string) => {
  const parts = location
    .split(/[,/|;()]| in | at /)
    .map(normalizeLocation)
    .filter(Boolean);
  const words = parts.flatMap((part) => part.split(' '));
  const whole = normalizeLocation(location);

  return Array.from(new Set([whole, ...parts, ...words]));
};

const findInTable = (
  candidates: string[],
  table: Record<string, LatLngType>
) => {
  for (const candidate of candidates) {
    const entry = table[candidate];
    if (entry) {
      return entry;
    }
  }

  return undefined;
};

const findMarker = (candidates: string[], markers: MarkerType[]) =>
  markers.find((marker) =>
    candidates.includes(normalizeLocation(marker.city ?? ''))
  );

const findContinentMarker = (candidates: string[], markers: MarkerType[]) => {
  const continent = CONTINENTS.find((name) => candidates.includes(name));
  if (!continent) {
    return undefined;
  }

  const continentMarkers = markers.filter(
    (marker) => normalizeLocation(marker.continent ?? '') === continent
  );

  return pickRandomMarker(continentMarkers);
};

export const pickRandomMarker = (
  markers: MarkerType[],
  exclude?: MarkerType
): MarkerType | undefined => {
  const pool = exclude
    ? markers.filter((marker) => marker !== exclude)
    : markers;
  if (pool.length === 0) {
    return undefined;
  }

  const totalWeight = pool.reduce(
    (sum, marker) => sum + Math.sqrt(Math.max(marker.validators, 1)),
    0
  );
  let cursor = Math.random() * totalWeight;

  for (const marker of pool) {
    cursor -= Math.sqrt(Math.max(marker.validators, 1));
    if (cursor <= 0) {
      return marker;
    }
  }

  return pool[pool.length - 1];
};

export const resolveLocation = (
  location: string | undefined,
  markers: MarkerType[]
): ResolvedLocationType | undefined => {
  if (!location?.trim()) {
    return undefined;
  }

  const candidates = getCandidates(location);

  const city = findInTable(candidates, GEOCODE_CITIES);
  if (city) {
    return { latitude: city[0], longitude: city[1], isMatched: true };
  }

  const marker = findMarker(candidates, markers);
  if (marker) {
    return {
      latitude: marker.latitude,
      longitude: marker.longitude,
      isMatched: true
    };
  }

  const region = findInTable(candidates, GEOCODE_REGIONS);
  if (region) {
    return { latitude: region[0], longitude: region[1], isMatched: true };
  }

  const continentMarker = findContinentMarker(candidates, markers);
  if (continentMarker) {
    return {
      latitude: continentMarker.latitude,
      longitude: continentMarker.longitude,
      isMatched: false
    };
  }

  return undefined;
};
