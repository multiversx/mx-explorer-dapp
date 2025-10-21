import { useAdapter } from 'hooks';

const cache = new Map();
const promises = new Map();

export const useFetchGrowthWidgetOnce = () => {
  const { getGrowthWidget } = useAdapter();

  const fetchGrowthWidgetOnce = (path: string) => {
    if (cache.has(path)) {
      return cache.get(path);
    }

    if (promises.has(path)) {
      return promises.get(path);
    }

    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await getGrowthWidget(path);
        cache.set(path, response);
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
