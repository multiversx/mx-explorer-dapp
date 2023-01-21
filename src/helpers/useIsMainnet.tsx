import { useGlobalState } from 'context';
import { NetworkIdType } from 'helpers/types';

export const useIsMainnet = () => {
  return useGlobalState().activeNetwork.id === NetworkIdType.mainnet;
};
