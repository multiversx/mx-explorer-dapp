import { useGlobalState } from 'context';

export default function useIsTestnet() {
  return useGlobalState().activeNetwork.name.toLowerCase() === 'testnet';
}
