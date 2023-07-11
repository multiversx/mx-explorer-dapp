import { useSearchParams } from 'react-router-dom';

export const useGetSort = () => {
  const [searchParams] = useSearchParams();
  const { order, sort } = Object.fromEntries(searchParams);

  return {
    ...(sort ? { sort } : {}),
    ...(order ? { order } : {})
  };
};
