import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { ShardSpan, NetworkLink } from 'sharedComponents';

interface ComputedShard {
  status: string;
  allValidators: number;
  allActiveValidators: number;
  shardNumber: number;
}

interface ShardLabelType {
  shardData: ComputedShard[];
}

const ShardLabel = ({ shardData }: ShardLabelType) => {
  const { search, pathname } = useLocation();
  const urlParams = new URLSearchParams(search);
  const { shardId, ...rest } = Object.fromEntries(urlParams);

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
              {shardData.map(({ shardNumber }, i) => {
                return (
                  <NetworkLink
                    to={shardLink(shardNumber.toString())}
                    className={`dropdown-item ${
                      shardId === shardNumber.toString() ? 'active' : ''
                    }`}
                    key={shardNumber + i}
                  >
                    <ShardSpan shardId={shardNumber} />
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
