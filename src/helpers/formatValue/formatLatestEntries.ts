import { HOMEPAGE_LATEST_ITEM_SIZE } from 'appConstants';

interface LatestEntry {
  isNew?: boolean;
}

interface LatestEntriesProps {
  latestEntries: LatestEntry[];
  previousEntries: LatestEntry[];
  identifier: string;
}

export const formatLatestEntries = ({
  latestEntries,
  previousEntries,
  identifier
}: LatestEntriesProps) => {
  const newEntries = latestEntries.slice(0, HOMEPAGE_LATEST_ITEM_SIZE);
  const newHashes = newEntries.map(
    (entry) => entry?.[identifier as keyof LatestEntry]
  );
  const oldEntries = [...previousEntries.slice(0, HOMEPAGE_LATEST_ITEM_SIZE)]
    .filter(
      (entry) => !newHashes.includes(entry?.[identifier as keyof LatestEntry])
    )
    .map((entry) => {
      return { ...entry, isNew: false };
    });

  const mergedEntries = [...newEntries, ...oldEntries];

  const allNew = mergedEntries.every((entry) => entry.isNew);
  if (allNew) {
    return mergedEntries.map((entry) => {
      return { ...entry, isNew: false };
    });
  }

  return mergedEntries;
};
