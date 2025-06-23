import { useSearchParams } from 'react-router-dom';

export const useGetApplicationsFilters = () => {
  const [searchParams] = useSearchParams();
  const { isVerified, usersCountRange } = Object.fromEntries(searchParams);

  return {
    ...(isVerified ? { isVerified: isVerified === 'true' } : {}),
    ...(usersCountRange ? { usersCountRange } : {})
  };
};
