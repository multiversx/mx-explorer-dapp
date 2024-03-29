import { useState, useRef } from 'react';
import classNames from 'classnames';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { WithClassnameType } from 'types';

export interface OverlayUIType extends WithClassnameType {
  children?: React.ReactNode;
  title: React.ReactNode;
  tooltipClassName?: string;
  truncate?: boolean;
  persistent?: boolean;
  style?: any;
}

export const Overlay = ({
  children,
  title,
  className,
  tooltipClassName,
  persistent = false,
  truncate = false,
  style
}: OverlayUIType) => {
  const [show, setShow] = useState(false);
  const handleOnMouseEnter = () => {
    setShow(true);
  };
  const handleOnMouseLeave = () => {
    setShow(false);
  };
  const ref = useRef(null);

  return (
    <OverlayTrigger
      placement='top'
      delay={{ show: 0, hide: 200 }}
      overlay={(props: any) => (
        <Tooltip
          {...(tooltipClassName ? { className: tooltipClassName } : {})}
          {...props}
          {...(persistent
            ? {
                onMouseEnter: handleOnMouseEnter,
                onMouseLeave: handleOnMouseLeave
              }
            : { show: props.show.toString() })}
        >
          {title}
        </Tooltip>
      )}
      {...(persistent ? { show } : {})}
    >
      <span
        ref={ref}
        className={classNames(className, 'cursor-context', {
          'text-truncate': truncate
        })}
        {...(style ? { style: style } : {})}
        {...(persistent
          ? {
              onMouseEnter: handleOnMouseEnter,
              onMouseLeave: handleOnMouseLeave
            }
          : {})}
      >
        {children ?? ''}
      </span>
    </OverlayTrigger>
  );
};
