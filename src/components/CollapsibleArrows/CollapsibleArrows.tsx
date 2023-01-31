import React from 'react';
import { faChevronDown } from '@fortawesome/pro-regular-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/pro-regular-svg-icons/faChevronUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

export interface CollapsibleArrowsPropsType {
  className?: string;
  expanded: boolean;
  size?: 'sm' | 'xs';
}

export const CollapsibleArrows = ({
  className,
  expanded,
  size = 'sm'
}: CollapsibleArrowsPropsType) => {
  return (
    <FontAwesomeIcon
      className={classNames('ms-auto', className)}
      size={size}
      icon={expanded ? faChevronUp : faChevronDown}
    />
  );
};
