import { useGlobalState } from 'context';
import { useURLSearchParams } from 'helpers';

export default function useSize() {
  const {
    refresh: { timestamp },
  } = useGlobalState();
  const { page } = useURLSearchParams();
  const size = !isNaN(page!) ? parseInt(String(page)) : 1;
  const firstPageTicker = size === 1 ? timestamp : 0;

  return {
    size,
    firstPageTicker,
  };
}
