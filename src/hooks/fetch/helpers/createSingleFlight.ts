export const createSingleFlight = <ResultType>() => {
  const inFlight = new Map<string, Promise<ResultType>>();

  return (key: string, request: () => Promise<ResultType>) => {
    const existing = inFlight.get(key);

    if (existing) {
      return existing;
    }

    const promise = request().finally(() => {
      inFlight.delete(key);
    });

    inFlight.set(key, promise);

    return promise;
  };
};
