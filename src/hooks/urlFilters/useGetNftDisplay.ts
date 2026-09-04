import { useSearchParams } from 'react-router';

import { NftDisplayEnum } from 'types';

export const useGetNftDisplay = () => {
  const [searchParams] = useSearchParams();
  const { display } = Object.fromEntries(searchParams);

  const nftDisplay = Object.values(NftDisplayEnum).includes(
    display as NftDisplayEnum
  )
    ? (display as NftDisplayEnum)
    : NftDisplayEnum.list;

  return { nftDisplay };
};
