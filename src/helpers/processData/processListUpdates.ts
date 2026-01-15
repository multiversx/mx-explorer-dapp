import { PAGE_SIZE } from 'appConstants';

interface ProcessListUpdatesProps {
  existing: any[];
  incoming: any[];
  uniqueKey: string;
  size?: number;
}

export const processListUpdates = ({
  existing = [],
  incoming = [],
  uniqueKey,
  size = PAGE_SIZE
}: ProcessListUpdatesProps) => {
  const existingSet = new Set(existing.map((entry) => entry[uniqueKey]));
  const updated = new Map<string, any>();
  const result: any[] = [];

  for (const entry of existing) {
    updated.set(entry[uniqueKey], entry);
  }
  for (const entry of incoming) {
    updated.set(entry[uniqueKey], { ...entry, isNew: true });
  }

  for (const entry of incoming) {
    if (!existingSet.has(entry[uniqueKey])) {
      result.push(updated.get(entry[uniqueKey])!);
    }
  }

  for (const entry of existing) {
    result.push(updated.get(entry[uniqueKey])!);
  }

  return result.slice(0, size);
};
