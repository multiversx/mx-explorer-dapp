import { LONG_POOLING_REFRESH_RATE } from 'appConstants';
import { useAdapter } from 'hooks';

interface CacheEntryType {
  response: any;
  timestamp: number;
}

const CACHE_TTL = LONG_POOLING_REFRESH_RATE;

const cache = new Map<string, CacheEntryType>();
const promises = new Map<string, Promise<any>>();

export const useFetchGrowthWidgetOnce = () => {
  const { getGrowthWidget } = useAdapter();

  const fetchGrowthWidgetOnce = (path: string) => {
    const cached = cache.get(path);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return Promise.resolve(cached.response);
    }

    const pending = promises.get(path);

    if (pending) {
      return pending;
    }

    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await getGrowthWidget(path);
        cache.set(path, { response, timestamp: Date.now() });
        resolve(response);
      } catch (error) {
        reject(error);
      } finally {
        promises.delete(path);
      }
    });

    promises.set(path, requestPromise);
    return requestPromise;
  };

  return fetchGrowthWidgetOnce;
};
