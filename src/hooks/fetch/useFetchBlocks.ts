import { useDispatch, useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { useGetPage, useGetBlockFilters } from 'hooks';
import { blocksSelector } from 'redux/selectors';
import { setBlocks } from 'redux/slices';
import { BlockType } from 'types';
import { FetchApiDataProps, useFetchApiData } from './useFetchApiData';

interface BlocksWebsocketResponseType {
  blocks: BlockType[];
  blocksCount: number;
}

export const useFetchBlocks = (props: Omit<FetchApiDataProps, 'onApiData'>) => {
  const dispatch = useDispatch();
  const blockFilters = useGetBlockFilters();
  const { page, size } = useGetPage();
  const { dataCountPromise, filters, websocketConfig } = props;

  const { blocks, blocksCount, isDataReady, isRefreshPaused } =
    useSelector(blocksSelector);

  const onWebsocketData = (event: BlocksWebsocketResponseType) => {
    if (!event) {
      return;
    }

    const { blocks, blocksCount } = event;
    dispatch(
      setBlocks({
        blocks,
        blocksCount,
        isWebsocket: true,
        isDataReady: true
      })
    );
  };

  const onApiData = (response: any[]) => {
    const [blocksData, blocksCountData] = response;

    dispatch(
      setBlocks({
        blocks: blocksData.data ?? [],
        blocksCount: blocksCountData?.data ?? ELLIPSIS,
        isWebsocket: false,
        isDataReady:
          blocksData.success &&
          Boolean(!dataCountPromise || blocksCountData?.success)
      })
    );
  };

  const { fetchData, dataChanged } = useFetchApiData({
    ...props,
    filters: {
      page,
      size,
      ...blockFilters,
      ...filters
    },
    websocketConfig: {
      withProposerIdentity: true,
      ...websocketConfig
    },
    onWebsocketData,
    onApiData,
    urlParams: blockFilters,
    isRefreshPaused
  });

  return {
    blocks,
    totalBlocks: blocksCount,
    isDataReady,
    fetchBlocks: fetchData,
    dataChanged
  };
};
