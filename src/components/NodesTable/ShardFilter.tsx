import React from 'react';
import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { ShardSpan } from 'components';
import { useFetchShards } from 'hooks';

import { shardsSelector } from 'redux/selectors';

export const ShardFilter = () => {
  const shards = useSelector(shardsSelector);

  const [searchParams, setSearchParams] = useSearchParams();
  const { shard, page, ...rest } = Object.fromEntries(searchParams);

  useFetchShards();

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
