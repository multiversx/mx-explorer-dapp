import { useGlobalState } from 'context';

export default function useIsMainnet() {
  return useGlobalState().activeNetwork.name.toLowerCase() === 'mainnet';
}
