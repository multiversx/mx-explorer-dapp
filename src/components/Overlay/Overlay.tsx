import { useState, useRef } from 'react';
import classNames from 'classnames';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export interface OverlayUIType {
  children: React.ReactNode;
  title: React.ReactNode | string;
  className?: string;
  tooltipClassName?: string;
  persistent?: boolean;
}

export const Overlay = ({
  children,
  title,
  className,
  tooltipClassName,
  persistent = false
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
      delay={{ show: 0, hide: 400 }}
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
      <div
        ref={ref}
        className={classNames(className, {
          'text-truncate': !Boolean(className)
        })}
        {...(persistent
          ? {
              onMouseEnter: handleOnMouseEnter,
              onMouseLeave: handleOnMouseLeave
            }
          : {})}
      >
        {children}
      </div>
    </OverlayTrigger>
  );
};
