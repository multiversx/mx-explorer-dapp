import React from 'react';
import { faFilter } from 'icons/regular';
import { faFilter as faFilterSolid } from 'icons/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Anchor, Dropdown } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

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

export const StatusFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { online, page, ...rest } = Object.fromEntries(searchParams);

  const onlineLink = (onlineValue: string) => {
    const nextUrlParams = {
      ...rest,
      ...(onlineValue ? { online: onlineValue } : {})
    };

    setSearchParams(nextUrlParams);
  };

  return (
    <Dropdown
      className='d-inline-block side-action cursor-pointer'
      onSelect={(eventKey: any) => {
        return onlineLink(eventKey ?? '');
      }}
    >
      <Dropdown.Toggle as={CustomToggle} id='dropdown-custom-components'>
        <FontAwesomeIcon
          icon={online !== undefined ? faFilterSolid : faFilter}
          className={online !== undefined ? 'text-primary' : ''}
        />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item
          as={Anchor}
          eventKey='true'
          className={`dropdown-item ${online === 'true' ? 'active' : ''}`}
        >
          Online
        </Dropdown.Item>
        <Dropdown.Item
          as={Anchor}
          eventKey='false'
          className={`dropdown-item ${online === 'false' ? 'active' : ''}`}
        >
          Offline
        </Dropdown.Item>
        <Dropdown.Item as={Anchor} eventKey=''>
          Show all
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
