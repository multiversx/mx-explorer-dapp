import { useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router';

import {
  CURSOR_HISTORY_STORAGE_KEY,
  MAX_CURSOR_HISTORY_LISTS,
  MAX_CURSOR_HISTORY_PAGES
} from 'appConstants';

interface CursorListType {
  updatedAt: number;
  cursors: Record<string, string>;
}
type CursorHistoryType = Record<string, CursorListType>;

const readHistory = (): CursorHistoryType => {
  try {
    const entry = sessionStorage.getItem(CURSOR_HISTORY_STORAGE_KEY);

    return entry ? JSON.parse(entry) : {};
  } catch {
    return {};
  }
};

const writeHistory = (history: CursorHistoryType) => {
  try {
    sessionStorage.setItem(CURSOR_HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch {}
};

const clearOldestLists = (history: CursorHistoryType) => {
  const keys = Object.keys(history);

  if (keys.length <= MAX_CURSOR_HISTORY_LISTS) {
    return history;
  }

  const keep = keys
    .sort((a, b) => history[b].updatedAt - history[a].updatedAt)
    .slice(0, MAX_CURSOR_HISTORY_LISTS);

  return Object.fromEntries(keep.map((key) => [key, history[key]]));
};

const clearLowestPages = (cursors: Record<string, string>) => {
  const pages = Object.keys(cursors);

  if (pages.length <= MAX_CURSOR_HISTORY_PAGES) {
    return cursors;
  }

  const keep = pages
    .sort((a, b) => Number(b) - Number(a))
    .slice(0, MAX_CURSOR_HISTORY_PAGES);

  return Object.fromEntries(keep.map((page) => [page, cursors[page]]));
};

export const useGetCursorHistory = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const listKey = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('page');
    params.delete('searchAfter');
    params.sort();

    return `${pathname}?${params.toString()}`;
  }, [pathname, searchParams]);

  const getCursor = useCallback(
    (page: number) => readHistory()[listKey()]?.cursors?.[page],
    [listKey]
  );

  const setCursor = useCallback(
    (page: number, cursor: string) => {
      const history = readHistory();
      const key = listKey();

      writeHistory(
        clearOldestLists({
          ...history,
          [key]: {
            updatedAt: Date.now(),
            cursors: clearLowestPages({
              ...history[key]?.cursors,
              [page]: cursor
            })
          }
        })
      );
    },
    [listKey]
  );

  return { getCursor, setCursor };
};
