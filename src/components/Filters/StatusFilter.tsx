import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Anchor, Dropdown } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { faFilter } from 'icons/regular';
import { faFilter as faFilterSolid } from 'icons/solid';

export const StatusFilter = ({ text }: { text: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { online, page, size, ...rest } = Object.fromEntries(searchParams);

  const onlineLink = (onlineValue: string) => {
    const nextUrlParams = {
      ...rest,
      ...(onlineValue ? { online: onlineValue } : {})
    };

    setSearchParams(nextUrlParams);
  };

  return (
    <div
      className={classNames({
        'text-primary-100': online !== undefined
      })}
    >
      {text}
      <Dropdown
        className='d-inline-flex'
        onSelect={(eventKey: any) => {
          return onlineLink(eventKey ?? '');
        }}
      >
        <Dropdown.Toggle
          className='btn-link-unstyled side-action cursor-pointer'
          variant='link'
        >
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
            Show All
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
