import { stringIsInteger } from '@multiversx/sdk-dapp/utils/validation/stringIsInteger';
import { useSearchParams } from 'react-router-dom';

export const useGetApplicationsFilters = () => {
  const [searchParams] = useSearchParams();
  const { isVerified } = Object.fromEntries(searchParams);

  return {
    ...(isVerified ? { isVerified: isVerified === 'true' } : {})
  };
};
