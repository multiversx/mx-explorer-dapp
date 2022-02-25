import { useGlobalState } from 'context';
import { NetworkIdType } from 'helpers/types';

export default function useIsTestnet() {
  return useGlobalState().activeNetwork.id === NetworkIdType.testnet;
}
