import { stringIsInteger } from '@multiversx/sdk-dapp/utils/validation/stringIsInteger';

export const getUrlParam =
  (searchParams: URLSearchParams) =>
  (value: string, checkIsInteger?: boolean) => {
    const param =
      searchParams.get(value) !== null ? String(searchParams.get(value)) : '';

    if (checkIsInteger) {
      return stringIsInteger(param) ? parseInt(param) : undefined;
    }

    return param;
  };
