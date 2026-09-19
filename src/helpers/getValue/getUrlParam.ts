import { stringIsInteger } from 'lib';

interface UrlParamProps {
  checkIsInteger?: boolean;
  checkIsBoolean?: boolean;
}

export const getUrlParam =
  (searchParams: URLSearchParams) =>
  (value: string, options?: UrlParamProps) => {
    const { checkIsInteger, checkIsBoolean } = options ?? {};
    const param =
      searchParams.get(value) !== null ? String(searchParams.get(value)) : '';

    if (checkIsInteger && stringIsInteger(param)) {
      return parseInt(param);
    }

    if (param && checkIsBoolean) {
      return param === 'true';
    }

    return param;
  };
