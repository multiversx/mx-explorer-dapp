const putCache = async ({ key, value, ttl }: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, 0);
  });
};

const getCache = async ({ key }: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, 0);
  });
};

export { putCache, getCache };
