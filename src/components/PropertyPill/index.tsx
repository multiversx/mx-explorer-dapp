import * as React from 'react';
import { faTimes, faCheck } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const PropertyPill = ({
  name,
  active
}: {
  name: string;
  active: boolean;
}) => {
  return (
    <span
      className={`me-1 badge badge-outline badge-rounded badge-direction ${
        active ? 'in' : 'out'
      }`}
    >
      <FontAwesomeIcon className='me-1' icon={active ? faCheck : faTimes} />{' '}
      {name}
    </span>
  );
};
