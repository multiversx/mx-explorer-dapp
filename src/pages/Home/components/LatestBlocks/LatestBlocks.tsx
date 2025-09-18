import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  NetworkLink,
  TimeAgo,
  Trim,
  Loader,
  LatestItem,
  PulsatingLed,
  ShardLink
} from 'components';
import { FailedBlocks } from 'components/BlocksTable/components/FailedBlocks';
import { NoBlocks } from 'components/BlocksTable/components/NoBlocks';
import { urlBuilder } from 'helpers';
import { useAdapter, useFetchBlocks } from 'hooks';
import { activeNetworkSelector, refreshSelector } from 'redux/selectors';
import { blocksRoutes } from 'routes';
import { WebsocketEventsEnum, WebsocketSubcriptionsEnum } from 'types';

export const LatestBlocks = () => {
  const { timestamp } = useSelector(refreshSelector);
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { getBlocks } = useAdapter();

  const { fetchBlocks, blocks, isDataReady } = useFetchBlocks({
    blockPromise: getBlocks,
    subscription: WebsocketSubcriptionsEnum.subscribeBlocks,
    event: WebsocketEventsEnum.blocksUpdate
  });

  useEffect(fetchBlocks, [activeNetworkId, timestamp]);

  const Component = () => {
    return (
      <div className='card card-lg card-black'>
        {isDataReady === undefined && <Loader data-testid='blocksLoader' />}
        {isDataReady === false && <FailedBlocks />}
        {isDataReady === true && blocks.length === 0 && <NoBlocks />}
        {isDataReady === true && blocks.length > 0 && (
          <>
            <div className='card-header'>
              <div className='d-flex justify-content-between align-items-center flex-wrap'>
                <div className='h5 mb-0 d-flex align-items-center'>
                  Recent Blocks <PulsatingLed className='ms-2 mt-1' />
                </div>
                <NetworkLink
                  to={blocksRoutes.blocks}
                  className='btn btn-sm btn-dark'
                >
                  View All
                </NetworkLink>
              </div>
            </div>
            <div className='card-body' data-testid='blocksList'>
              <div className='latest-items-container'>
                {blocks.map((block, i) => (
                  <LatestItem
                    totalItems={blocks.length}
                    key={block.hash}
                    isNew={block.isNew}
                    index={i + 1}
                  >
                    <div className='latest-item-card p-4'>
                      <div className='d-flex align-items-center justify-content-between mb-3'>
                        <div className='d-flex align-items-center'>
                          <NetworkLink
                            to={urlBuilder.blockDetails(block.hash)}
                            data-testid={`blockLink${i}`}
                          >
                            {block.nonce}
                          </NetworkLink>
                        </div>

                        <span className='text-neutral-400'>
                          <TimeAgo value={block.timestamp} showAgo />
                        </span>
                      </div>
                      <div className='d-flex'>
                        <span className='text-neutral-400 me-2'>
                          Transactions:
                        </span>{' '}
                        {block.txCount}
                        <span className='text-muted mx-2'>•</span>
                        <ShardLink
                          shard={block.shard}
                          className='flex-shrink-0'
                        />
                      </div>
                      <div className='d-flex flex-row mt-1'>
                        <span className='me-2 text-neutral-400'>Hash:</span>
                        <NetworkLink
                          to={urlBuilder.blockDetails(block.hash)}
                          className='trim-wrapper'
                        >
                          <Trim
                            data-testid={`blockHashLink${i}`}
                            text={block.hash}
                          />
                        </NetworkLink>
                      </div>
                    </div>
                  </LatestItem>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return React.useMemo(Component, [blocks]);
};
