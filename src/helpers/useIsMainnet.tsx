import { useGlobalState } from 'context';
import { NetworkIdType } from 'types';

export const useIsMainnet = () => {
  return useGlobalState().activeNetwork.id === NetworkIdType.mainnet;
};
