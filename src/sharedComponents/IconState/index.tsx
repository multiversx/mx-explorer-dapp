import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IconState = ({ icon, className }: { icon: any; className?: string }) => {
  return (
    <span className={`icon-state mx-auto ${className ? className : ''}`}>
      <FontAwesomeIcon
        icon={icon}
        size={className && !className.includes('fa-spin') ? '3x' : '5x'}
        className={className && !className.includes('fa-spin') ? 'text-white' : 'text-primary'}
      />
    </span>
  );
};

export default IconState;
