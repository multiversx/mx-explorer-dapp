import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalDispatch, useGlobalState } from 'context';
import * as React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { ShardSpan, NetworkLink, adapter } from 'sharedComponents';

const ShardLabel = () => {
  const { search, pathname } = useLocation();
  const dispatch = useGlobalDispatch();
  const urlParams = new URLSearchParams(search);
  const { shardId, ...rest } = Object.fromEntries(urlParams);
  const { getShards } = adapter();
  const { shards } = useGlobalState();

  const fetchShards = () => {
    if (shards.length === 0) {
      getShards().then((shards) => {
        if (shards.success) {
          dispatch({
            type: 'setShards',
            shards: shards.data,
          });
        }
      });
    }
  };

  React.useEffect(fetchShards, []);

  const shardLink = (shardId: string) => {
    const nextUrlParams = new URLSearchParams({
      ...rest,
      ...(shardId ? { shardId } : {}),
    }).toString();
    return `${pathname}?${nextUrlParams}`;
  };

  return (
    <>
      Shard{' '}
      <OverlayTrigger
        trigger="click"
        key="popover"
        placement="bottom"
        rootClose
        overlay={
          <Popover id="popover-positioned-bottom" className="border">
            <Popover.Content>
              {shards.map((shard, i) => {
                return (
                  <NetworkLink
                    to={shardLink(shard.shardId.toString())}
                    className={`dropdown-item ${
                      shardId === shard.shardId.toString() ? 'active' : ''
                    }`}
                    key={shard.shardId + i}
                  >
                    <ShardSpan shard={shard.shardId} />
                  </NetworkLink>
                );
              })}
              <NetworkLink
                className={`dropdown-item ${shardId === undefined ? 'active' : ''}`}
                key={-1}
                to={shardLink('')}
              >
                Show all
              </NetworkLink>
            </Popover.Content>
          </Popover>
        }
      >
        <a
          className="d-none d-md-inline-block d-lg-inline-block d-xl-inline-block side-action"
          data-testid="shardFilterButton"
          href={`${pathname}/${search}`}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <FontAwesomeIcon
            icon={faFilter}
            className={shardId !== undefined ? 'text-primary' : ''}
          />
        </a>
      </OverlayTrigger>
    </>
  );
};

export default ShardLabel;
