import {
  FAILED_REQUESTS_MAX_RETRY_DELAY,
  FAILED_REQUESTS_RETRY_DELAY,
  MAX_FAILED_REQUESTS
} from 'appConstants';

export const getRetryDelay = (failedRequests: number) => {
  if (failedRequests < MAX_FAILED_REQUESTS) {
    return 0;
  }

  const delay = Math.min(
    FAILED_REQUESTS_RETRY_DELAY * 2 ** (failedRequests - MAX_FAILED_REQUESTS),
    FAILED_REQUESTS_MAX_RETRY_DELAY
  );

  return delay / 2 + Math.random() * (delay / 2);
};
