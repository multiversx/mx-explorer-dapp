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
    <span className={`direction-badge my-1 me-1 ${active ? 'in' : 'out'}`}>
      <FontAwesomeIcon className='me-1' icon={active ? faCheck : faTimes} />{' '}
      {name}
    </span>
  );
};
