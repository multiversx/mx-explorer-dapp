import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Dropdown, Anchor } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ShardSpan } from 'components';
import { useFetchShards } from 'hooks';
import { faFilter } from 'icons/regular';
import { faFilter as faFilterSolid } from 'icons/solid';
import { shardsSelector } from 'redux/selectors';
import { TableFilterUIType } from 'types';

export const ShardFilter = ({ text, hideFilters }: TableFilterUIType) => {
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

  if (hideFilters) {
    return text;
  }

  return (
    <div
      className={classNames({
        'text-primary-100': shard !== undefined
      })}
    >
      {text}
      <Dropdown
        className='d-inline-flex'
        onSelect={(eventKey: any) => {
          return setShardfilter(eventKey ?? '');
        }}
      >
        <Dropdown.Toggle
          className='btn-link-unstyled side-action cursor-pointer'
          variant='link'
        >
          <FontAwesomeIcon
            icon={shard !== undefined ? faFilterSolid : faFilter}
            className={shard !== undefined ? 'text-primary' : ''}
          />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item as={Anchor} eventKey=''>
            All
          </Dropdown.Item>
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
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
