import { useGlobalState } from 'context';
import { NetworkIdType } from 'helpers/types';

export const useIsTestnet = () => {
  return useGlobalState().activeNetwork.id === NetworkIdType.testnet;
};
