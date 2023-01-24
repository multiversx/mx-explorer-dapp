import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/pro-light-svg-icons';

export const PropertyPill = ({ name, active }: { name: string; active: boolean }) => {
  return (
    <span className={`direction-badge my-1 me-1 ${active ? 'in' : 'out'}`}>
      <FontAwesomeIcon className="me-1" icon={active ? faCheck : faTimes} /> {name}
    </span>
  );
};
