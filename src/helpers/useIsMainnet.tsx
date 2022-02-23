import { useGlobalState } from 'context';
import { NetworkIdType } from 'helpers/types';

export default function useIsMainnet() {
  return useGlobalState().activeNetwork.id === NetworkIdType.mainnet;
}
