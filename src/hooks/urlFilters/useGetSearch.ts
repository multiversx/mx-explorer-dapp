import { useSearchParams } from 'react-router';

export const useGetSearch = () => {
  const [searchParams] = useSearchParams();
  const { search } = Object.fromEntries(searchParams);

  return {
    ...(search ? { search } : {})
  };
};
