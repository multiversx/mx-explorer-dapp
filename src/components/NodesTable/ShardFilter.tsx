import React, { useEffect } from 'react';
import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { ShardSpan, useAdapter } from 'components';

import { shardsSelector } from 'redux/selectors';
import { setShards } from 'redux/slices/interface';

export const ShardFilter = () => {
  const { getShards } = useAdapter();
  const dispatch = useDispatch();
  const shards = useSelector(shardsSelector);

  const [searchParams, setSearchParams] = useSearchParams();
  const { shard, page, ...rest } = Object.fromEntries(searchParams);

  const fetchShards = () => {
    if (shards.length === 0) {
      getShards().then((shards) => {
        if (shards.success && shards?.data) {
          dispatch(setShards(shards.data));
        }
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fetchShards, []);

  const setShardfilter = (shard: string) => {
    const nextUrlParams = {
      ...rest,
      ...(shard ? { shard } : {})
    };

    setSearchParams(nextUrlParams);
  };

  return (
    <OverlayTrigger
      trigger='click'
      key='popover'
      placement='bottom'
      rootClose
      overlay={
        <Popover id='popover-positioned-bottom' className='border'>
          {shards.length > 0 && (
            <Popover.Body>
              {shards.map((entry, i) => {
                return (
                  <div
                    className={`dropdown-item cursor-pointer ${
                      shard === entry.shard.toString() ? 'active' : ''
                    }`}
                    key={entry.shard + i}
                    onClick={() => {
                      setShardfilter(entry.shard.toString());
                    }}
                  >
                    <ShardSpan shard={entry.shard} />
                  </div>
                );
              })}
              <div
                className={`dropdown-item cursor-pointer ${
                  shard === undefined ? 'active' : ''
                }`}
                key={-1}
                onClick={() => {
                  setShardfilter('');
                }}
              >
                Show all
              </div>
            </Popover.Body>
          )}
        </Popover>
      }
    >
      <div
        className='d-inline-block side-action cursor-pointer'
        data-testid='shardFilterButton'
      >
        <FontAwesomeIcon
          icon={shard !== undefined ? faFilterSolid : faFilter}
          className={shard !== undefined ? 'text-primary' : ''}
        />
      </div>
    </OverlayTrigger>
  );
};
