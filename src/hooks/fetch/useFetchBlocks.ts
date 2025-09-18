import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ELLIPSIS, PAGE_SIZE } from 'appConstants';
import {
  useGetPage,
  useGetBlockFilters,
  useRegisterWebsocketListener
} from 'hooks';
import { blocksSelector } from 'redux/selectors';
import { setBlocks } from 'redux/slices';
import {
  ApiAdapterResponseType,
  BlockType,
  WebsocketEventsEnum,
  WebsocketSubcriptionsEnum
} from 'types';

export interface FetchBlocksProps {
  blockPromise: (params?: any) => Promise<ApiAdapterResponseType>;
  blockCountPromise: (params?: any) => Promise<ApiAdapterResponseType>;
  filters?: Record<string, any>;
  subscription?: WebsocketSubcriptionsEnum;
  event?: WebsocketEventsEnum;
  config?: Record<string, any>;
}

export const useFetchBlocks = ({
  blockPromise,
  blockCountPromise,
  filters = {},
  subscription,
  event,
  config = {}
}: FetchBlocksProps) => {
  const dispatch = useDispatch();
  const urlParams = useGetBlockFilters();
  const [searchParams] = useSearchParams();
  const { page, size } = useGetPage();

  const { blocks, blocksCount, isDataReady, isWebsocket } =
    useSelector(blocksSelector);

  const [dataChanged, setDataChanged] = useState<boolean>(false);
  let isCalled = false;

  // Default Blocks Updater, subscribe to websocket events on default Tx flow
  const onWebsocketEvent = (event: BlockType[]) => {
    if (Boolean(searchParams.toString())) {
      return;
    }

    dispatch(
      setBlocks({
        blocks: event ?? [],
        blocksCount: ELLIPSIS,
        isWebsocket: true,
        isDataReady: true
      })
    );
  };

  useRegisterWebsocketListener({
    subscription,
    event,
    config: { from: 0, size: PAGE_SIZE, withProposerIdentity: true, ...config },
    onEvent: onWebsocketEvent
  });

  const fetchBlocks = (paramsChange = false) => {
    if ((isWebsocket && !paramsChange) || isCalled) {
      return;
    }

    isCalled = true;
    if (searchParams.toString() && paramsChange) {
      setDataChanged(true);
    }
    Promise.all([
      blockPromise({
        ...urlParams,
        ...filters,
        page,
        size
      }),
      blockCountPromise({ ...urlParams, ...filters })
    ])
      .then(([blocksData, blocksCountData]) => {
        dispatch(
          setBlocks({
            blocks: blocksData.data ?? [],
            blocksCount: blocksCountData.data ?? 0,
            isWebsocket: false,
            isDataReady: blocksData.success && blocksCountData.success
          })
        );
      })
      .finally(() => {
        if (paramsChange) {
          isCalled = false;
          setDataChanged(false);
        }
      });
  };

  return {
    blocks,
    totalBlocks: blocksCount,
    isDataReady,
    fetchBlocks,
    dataChanged
  };
};
