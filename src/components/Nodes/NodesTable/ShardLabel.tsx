import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { ShardSpan } from 'sharedComponents';
import { FiltersType } from './../helpers/useFilters';

interface ComputedShard {
  status: string;
  allValidators: number;
  allActiveValidators: number;
  shardNumber: number;
}

interface ShardLabelType {
  shardData: ComputedShard[];
  setShardId: React.Dispatch<React.SetStateAction<FiltersType['shardId']>>;
  shardId: FiltersType['shardId'];
}

const ShardLabel = ({ shardData, shardId, setShardId }: ShardLabelType) => {
  const changeShardId = (shardId: FiltersType['shardId']) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    document.body.click();
    setShardId(shardId);
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
                  <a
                    className={`dropdown-item ${
                      shardId === shardNumber.toString() ? 'active' : ''
                    }`}
                    key={shardNumber + i}
                    href="/nodes"
                    onClick={changeShardId(shardNumber.toString())}
                  >
                    <ShardSpan shardId={shardNumber} />
                  </a>
                );
              })}
              <a
                className={`dropdown-item ${shardId === '' ? 'active' : ''}`}
                key={-1}
                href="/nodes"
                onClick={changeShardId('')}
              >
                Show all
              </a>
            </Popover.Content>
          </Popover>
        }
      >
        <span
          className="d-none d-md-inline-block d-lg-inline-block d-xl-inline-block side-action"
          data-testid="shardFilterButton"
        >
          <FontAwesomeIcon icon={faFilter} className={shardId !== '' ? 'text-primary' : ''} />
        </span>
      </OverlayTrigger>
    </>
  );
};

export default ShardLabel;
