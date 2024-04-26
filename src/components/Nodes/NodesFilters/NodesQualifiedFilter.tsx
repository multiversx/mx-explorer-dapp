import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Anchor, Dropdown } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { faFilter } from 'icons/regular';
import { faFilter as faFilterSolid } from 'icons/solid';

enum DropdownKeyEnum {
  qualified = 'qualified',
  notQualified = 'notQualified',
  dangerZone = 'dangerZone'
}

export const NodesQualifiedFilter = ({ text }: { text: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuctionDangerZone, isQualified } = Object.fromEntries(searchParams);

  const resetFiltersLink = () => {
    const { isQualified, isAuctionDangerZone, search, page, size, ...rest } =
      Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest
    };

    setSearchParams(nextUrlParams);
  };

  const nodeQualifiedLink = (isQualified: boolean) => {
    const { isAuctionDangerZone, page, size, ...rest } =
      Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest,
      ...(isQualified !== undefined ? { isQualified: String(isQualified) } : {})
    };

    setSearchParams(nextUrlParams);
  };

  const nodeDangerZoneLink = (isAuctionDangerZone: boolean) => {
    const { isQualified, page, size, ...rest } =
      Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest,
      ...(isAuctionDangerZone
        ? { isAuctionDangerZone: 'true', isQualified: 'true' }
        : {})
    };

    setSearchParams(nextUrlParams);
  };

  const hasAuctionFilter =
    isQualified !== undefined || isAuctionDangerZone !== undefined;

  return (
    <div
      className={classNames({
        'text-primary-100': hasAuctionFilter
      })}
    >
      {text}
      <Dropdown
        className='d-inline-flex'
        onSelect={(eventKey) => {
          if (
            eventKey === DropdownKeyEnum.qualified ||
            eventKey === DropdownKeyEnum.notQualified
          ) {
            return nodeQualifiedLink(eventKey === DropdownKeyEnum.qualified);
          }
          if (eventKey === DropdownKeyEnum.dangerZone) {
            return nodeDangerZoneLink(true);
          }
          return resetFiltersLink();
        }}
      >
        <Dropdown.Toggle
          className='btn-link-unstyled side-action cursor-pointer'
          variant='link'
        >
          <FontAwesomeIcon
            icon={hasAuctionFilter ? faFilterSolid : faFilter}
            className={hasAuctionFilter ? 'text-primary' : ''}
          />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item
            as={Anchor}
            eventKey={DropdownKeyEnum.qualified}
            className={`dropdown-item ${
              isQualified === 'true' && isAuctionDangerZone === undefined
                ? 'active'
                : ''
            }`}
          >
            Qualified
          </Dropdown.Item>
          <Dropdown.Item
            as={Anchor}
            eventKey={DropdownKeyEnum.dangerZone}
            className={`dropdown-item ${
              isAuctionDangerZone === 'true' ? 'active' : ''
            }`}
          >
            Danger Zone
          </Dropdown.Item>
          <Dropdown.Item
            as={Anchor}
            eventKey={DropdownKeyEnum.notQualified}
            className={`dropdown-item ${
              isQualified === 'false' ? 'active' : ''
            }`}
          >
            Not Qualified
          </Dropdown.Item>
          <Dropdown.Item as={Anchor} eventKey=''>
            Show All
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
