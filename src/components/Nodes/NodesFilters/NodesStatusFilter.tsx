import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { Anchor, Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { faFilter } from 'icons/regular';
import { faFilter as faFilterSolid } from 'icons/solid';
import { stakeSelector } from 'redux/selectors';
import { TableFilterUIType, NodeStatusEnum } from 'types';

export const NodesStatusFilter = ({ text, hideFilters }: TableFilterUIType) => {
  const { queueSize, auctionValidators } = useSelector(stakeSelector);
  const [searchParams, setSearchParams] = useSearchParams();
  const { status, page, size, ...rest } = Object.fromEntries(searchParams);

  const statusLink = (status: NodeStatusEnum) => {
    const nextUrlParams = {
      ...rest,
      ...(status ? { status } : {})
    };

    setSearchParams(nextUrlParams);
  };

  if (hideFilters) {
    return text;
  }

  return (
    <div
      className={classNames({
        'text-primary-100': status !== undefined
      })}
    >
      {text}
      <Dropdown
        className='d-inline-flex'
        onSelect={(eventKey: any) => {
          return statusLink(eventKey ?? '');
        }}
      >
        <Dropdown.Toggle
          className='btn-link-unstyled side-action cursor-pointer'
          variant='link'
        >
          <FontAwesomeIcon
            icon={status !== undefined ? faFilterSolid : faFilter}
            className={status !== undefined ? 'text-primary' : ''}
          />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item as={Anchor} className='text-neutral-400' eventKey=''>
            All
          </Dropdown.Item>
          <Dropdown.Item
            as={Anchor}
            eventKey={NodeStatusEnum.eligible}
            className={`dropdown-item text-success ${
              status === NodeStatusEnum.eligible ? 'active' : ''
            }`}
          >
            Eligible
          </Dropdown.Item>
          <Dropdown.Item
            as={Anchor}
            eventKey={NodeStatusEnum.new}
            className={`dropdown-item text-primary ${
              status === NodeStatusEnum.new ? 'active' : ''
            }`}
          >
            New
          </Dropdown.Item>
          <Dropdown.Item
            as={Anchor}
            eventKey={NodeStatusEnum.waiting}
            className={`dropdown-item text-cyan-400 ${
              status === NodeStatusEnum.waiting ? 'active' : ''
            }`}
          >
            Waiting
          </Dropdown.Item>
          {auctionValidators !== undefined && (
            <Dropdown.Item
              as={Anchor}
              eventKey={NodeStatusEnum.auction}
              className={`dropdown-item text-blue-400 ${
                status === NodeStatusEnum.auction ? 'active' : ''
              }`}
            >
              Auction List
            </Dropdown.Item>
          )}
          {queueSize !== undefined && (
            <Dropdown.Item
              as={Anchor}
              eventKey={NodeStatusEnum.queued}
              className={`dropdown-item text-blue-400 ${
                status === NodeStatusEnum.queued ? 'active' : ''
              }`}
            >
              Queued
            </Dropdown.Item>
          )}
          <Dropdown.Item
            as={Anchor}
            eventKey={NodeStatusEnum.leaving}
            className={`dropdown-item text-orange-500 ${
              status === NodeStatusEnum.leaving ? 'active' : ''
            }`}
          >
            Leaving
          </Dropdown.Item>
          <Dropdown.Item
            as={Anchor}
            eventKey={NodeStatusEnum.jailed}
            className={`dropdown-item text-red-600 ${
              status === NodeStatusEnum.jailed ? 'active' : ''
            }`}
          >
            Jailed
          </Dropdown.Item>
          <Dropdown.Item
            as={Anchor}
            eventKey={NodeStatusEnum.inactive}
            className={`dropdown-item text-neutral-500 ${
              status === NodeStatusEnum.inactive ? 'active' : ''
            }`}
          >
            Inactive
          </Dropdown.Item>
          <Dropdown.Item
            as={Anchor}
            eventKey={NodeStatusEnum.unknown}
            className={`dropdown-item text-neutral-600 ${
              status === NodeStatusEnum.unknown ? 'active' : ''
            }`}
          >
            Unknown
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
