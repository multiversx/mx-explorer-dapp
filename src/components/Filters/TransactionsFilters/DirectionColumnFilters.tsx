import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Anchor, Dropdown } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { faFilter } from 'icons/regular';
import { faFilter as faFilterSolid } from 'icons/solid';
import {
  TransactionDirectionEnum,
  TransactionFiltersEnum,
  WithClassnameType
} from 'types';

export interface DirectionColumnFiltersUIType extends WithClassnameType {
  address?: string;
  inactiveFilters?: TransactionFiltersEnum[];
}

export const DirectionColumnFilters = ({
  address,
  inactiveFilters = []
}: DirectionColumnFiltersUIType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { sender, receiver } = Object.fromEntries(searchParams);

  const isInactive = [
    TransactionFiltersEnum.sender,
    TransactionFiltersEnum.receiver
  ].every((filter) => inactiveFilters.includes(filter));

  const isReceiver = address && receiver?.split(',')?.includes(address);
  const isActive = sender === address || isReceiver;

  if (isInactive || !address) {
    return null;
  }

  const updateSelectValue = (selectValue: string) => {
    const paramsObject = Object.fromEntries(searchParams);
    const { page, size, sender, receiver, ...rest } = paramsObject;

    switch (selectValue) {
      case TransactionDirectionEnum.in:
        setSearchParams({
          receiver: address,
          ...rest
        });
        break;
      case TransactionDirectionEnum.out:
        setSearchParams({
          sender: address,
          ...rest
        });
        break;
      default:
        setSearchParams(rest);
        break;
    }

    document.body.click();
  };

  return (
    <Dropdown
      className={classNames('d-inline-flex', {
        'text-neutral-500': !isActive,
        'text-primary-100': isActive
      })}
      onSelect={(eventKey: any) => {
        return updateSelectValue(eventKey ?? '');
      }}
    >
      <Dropdown.Toggle
        className='btn-link-unstyled cursor-pointer'
        variant='link'
      >
        <FontAwesomeIcon
          icon={isActive ? faFilterSolid : faFilter}
          className={isActive ? 'text-primary' : ''}
        />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item as={Anchor} eventKey=''>
          <span
            className={classNames(
              'badge badge-outline badge-rounded badge-direction int'
            )}
          >
            ALL
          </span>
        </Dropdown.Item>
        <Dropdown.Item
          as={Anchor}
          eventKey={TransactionDirectionEnum.in}
          className={`dropdown-item text-success ${isReceiver ? 'active' : ''}`}
        >
          <span
            className={classNames(
              'badge badge-outline badge-rounded badge-direction in'
            )}
          >
            IN
          </span>
        </Dropdown.Item>
        <Dropdown.Item
          as={Anchor}
          eventKey={TransactionDirectionEnum.out}
          className={`dropdown-item text-primary ${
            address === sender ? 'active' : ''
          }`}
        >
          <span
            className={classNames(
              'badge badge-outline badge-rounded badge-direction out'
            )}
          >
            OUT
          </span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
