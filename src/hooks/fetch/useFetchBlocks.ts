import { useDispatch, useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { useGetPage, useGetBlockFilters } from 'hooks';
import { blocksSelector } from 'redux/selectors';
import { setBlocks } from 'redux/slices';
import { BlockType } from 'types';
import { FetchApiDataProps, useFetchApiData } from './useFetchApiData';

export const useFetchBlocks = (props: Omit<FetchApiDataProps, 'onApiData'>) => {
  const dispatch = useDispatch();
  const blockFilters = useGetBlockFilters();
  const { page, size } = useGetPage();
  const { dataCountPromise, filters, config } = props;

  const { blocks, blocksCount, isDataReady, isWebsocket } =
    useSelector(blocksSelector);

  const onWebsocketData = (event: BlockType[]) => {
    if (!event) {
      return;
    }

    dispatch(
      setBlocks({
        blocks: event,
        blocksCount: ELLIPSIS,
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
    config: { withProposerIdentity: true, ...config },
    onWebsocketData,
    onApiData,
    isWebsocketUpdate: isWebsocket
  });

  return {
    blocks,
    totalBlocks: blocksCount,
    isDataReady,
    fetchBlocks: fetchData,
    dataChanged
  };
};
