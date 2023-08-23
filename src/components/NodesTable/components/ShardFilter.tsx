import React from 'react';
import { faFilter } from 'icons/regular';
import { faFilter as faFilterSolid } from 'icons/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Dropdown, Anchor } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { ShardSpan } from 'components';
import { useFetchShards } from 'hooks';

import { shardsSelector } from 'redux/selectors';

const CustomToggle = React.forwardRef(
  ({ children, onClick }: any, ref: any) => (
    <a
      href=''
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </a>
  )
);

export const ShardFilter = () => {
  const shards = useSelector(shardsSelector);

  const [searchParams, setSearchParams] = useSearchParams();
  const { shard, page, size, ...rest } = Object.fromEntries(searchParams);

  useFetchShards();

  const setShardfilter = (shard: string) => {
    const nextUrlParams = {
      ...rest,
      ...(shard ? { shard } : {})
    };

    setSearchParams(nextUrlParams);
  };

  return (
    <Dropdown
      className='d-inline-block side-action cursor-pointer'
      onSelect={(eventKey: any) => {
        return setShardfilter(eventKey ?? '');
      }}
    >
      <Dropdown.Toggle as={CustomToggle} id='dropdown-custom-components'>
        <FontAwesomeIcon
          icon={shard !== undefined ? faFilterSolid : faFilter}
          className={shard !== undefined ? 'text-primary' : ''}
        />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {shards.map((entry, i) => {
          return (
            <Dropdown.Item
              as={Anchor}
              className={`dropdown-item ${
                shard === entry.shard.toString() ? 'active' : ''
              }`}
              eventKey={entry.shard}
              key={entry.shard + i}
            >
              <ShardSpan shard={entry.shard} />
            </Dropdown.Item>
          );
        })}
        <Dropdown.Item as={Anchor} eventKey=''>
          Show all
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
