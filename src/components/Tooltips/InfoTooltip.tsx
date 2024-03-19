import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { Overlay, OverlayUIType } from 'components';
import { faInfoCircle } from 'icons/regular';

export const InfoTooltip = ({
  title,
  className,
  tooltipClassName
}: OverlayUIType) => (
  <Overlay
    title={title}
    className={classNames('side-action cursor-context', className)}
    tooltipClassName={classNames('tooltip-lg', tooltipClassName)}
  >
    <FontAwesomeIcon icon={faInfoCircle} />
  </Overlay>
);
