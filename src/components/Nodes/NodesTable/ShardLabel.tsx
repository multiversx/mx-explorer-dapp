import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import * as React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { ShardSpan, NetworkLink } from 'sharedComponents';

const ShardLabel = () => {
  const { search, pathname } = useLocation();
  const urlParams = new URLSearchParams(search);
  const { shardId, ...rest } = Object.fromEntries(urlParams);
  const { shards } = useGlobalState();

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
          <Popover id="popover-positioned-bottom">
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
                    <ShardSpan shardId={shard.shardId} />
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
        <span
          className="d-none d-md-inline-block d-lg-inline-block d-xl-inline-block side-action"
          data-testid="shardFilterButton"
        >
          <FontAwesomeIcon
            icon={faFilter}
            className={shardId !== undefined ? 'text-primary' : ''}
          />
        </span>
      </OverlayTrigger>
    </>
  );
};

export default ShardLabel;
