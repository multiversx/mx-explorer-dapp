import { useGlobalState } from 'context';
import { NetworkIdType } from 'types';

export const useIsTestnet = () => {
  return useGlobalState().activeNetwork.id === NetworkIdType.testnet;
};
