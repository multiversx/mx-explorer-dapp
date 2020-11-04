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
  setShard: React.Dispatch<React.SetStateAction<FiltersType['shard']>>;
  shard: FiltersType['shard'];
}

const ShardLabel = ({ shardData, shard, setShard }: ShardLabelType) => {
  const changeShard = (shardID: FiltersType['shard']) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    document.body.click();
    setShard(shardID);
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
                    className={`dropdown-item ${shard === shardNumber.toString() ? 'active' : ''}`}
                    key={shardNumber + i}
                    href="/nodes"
                    onClick={changeShard(shardNumber.toString())}
                  >
                    <ShardSpan shardId={shardNumber} />
                  </a>
                );
              })}
              <a
                className={`dropdown-item ${shard === '' ? 'active' : ''}`}
                key={-1}
                href="/nodes"
                onClick={changeShard('')}
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
          <FontAwesomeIcon icon={faFilter} className={shard !== '' ? 'text-primary' : ''} />
        </span>
      </OverlayTrigger>
    </>
  );
};

export default ShardLabel;
