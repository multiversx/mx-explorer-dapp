import { useSearchParams } from 'react-router-dom';

export const useGetYearParams = ({ prefix = '' }: { prefix?: string }) => {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);
  const dynamicBeforeParam = `${prefix}${prefix ? 'Before' : 'before'}`;
  const dynamicAfterParam = `${prefix}${prefix ? 'After' : 'after'}`;
  const {
    [dynamicBeforeParam]: before,
    [dynamicAfterParam]: after,
    ...rest
  } = params;

  if (!(before && after)) {
    return { ...rest };
  }

  try {
    const start = new Date(Number(after)).getUTCFullYear();
    const end = new Date(Number(before)).getUTCFullYear();

    if (start !== end) {
      return { before, after, ...rest };
    }

    return { before, after, ...rest };
  } catch {
    return { ...rest };
  }
};
