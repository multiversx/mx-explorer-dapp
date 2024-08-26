import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { faChevronDown, faChevronUp } from 'icons/regular';

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
      className={classNames(className)}
      size={size}
      icon={expanded ? faChevronUp : faChevronDown}
    />
  );
};
