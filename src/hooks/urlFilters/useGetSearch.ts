import { useSearchParams } from 'react-router-dom';

export const useGetSearch = () => {
  const [searchParams] = useSearchParams();
  const { search } = Object.fromEntries(searchParams);

  return {
    ...(search ? { search } : {})
  };
};
