import React, { useEffect, useRef, useState } from 'react';
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
import { useAdapter } from 'hooks';
import { activeNetworkSelector, refreshSelector } from 'redux/selectors';
import { blocksRoutes } from 'routes';
import { BlockType } from 'types';

export const LatestBlocks = () => {
  const ref = useRef(null);
  const { timestamp } = useSelector(refreshSelector);
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { getLatestBlocks } = useAdapter();

  const [blocks, setBlocks] = useState<BlockType[]>([]);
  const [blocksFetched, setBlocksFetched] = useState<boolean | undefined>();
  const size = 5;

  const fetchBlocks = () => {
    getLatestBlocks({ size }).then(({ data, success }) => {
      if (ref.current !== null) {
        if (success) {
          const existingHashes = blocks.map((b) => b.hash);

          // keep previous blocks and reset them
          const oldBlocks: BlockType[] = [...blocks.slice(0, size)];
          oldBlocks.forEach((block) => (block.isNew = false));

          let newBlocks: BlockType[] = [];
          data.forEach((block: BlockType) => {
            const isNew = !existingHashes.includes(block.hash);
            if (isNew) {
              newBlocks.push({
                ...block,
                isNew
              });
            }
          });

          newBlocks = [...newBlocks, ...oldBlocks];

          const allNew =
            newBlocks.filter((a) => a.isNew === true).length ===
            newBlocks.length;
          if (allNew) {
            newBlocks.forEach((block) => (block.isNew = false));
          }

          setBlocks(newBlocks);
        }
        setBlocksFetched(success);
      }
    });
  };

  useEffect(fetchBlocks, [activeNetworkId, timestamp]);

  const Component = () => {
    return (
      <div className='card card-lg card-black' ref={ref}>
        {blocksFetched === undefined && <Loader data-testid='blocksLoader' />}
        {blocksFetched === false && <FailedBlocks />}
        {blocksFetched === true && blocks.length === 0 && <NoBlocks />}
        {blocksFetched === true && blocks.length > 0 && (
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
  return React.useMemo(Component, [blocks, blocksFetched]);
};
