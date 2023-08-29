import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export const Overlay = ({
  children,
  title,
  className,
  tooltipClassName
}: {
  children: React.ReactNode;
  title: React.ReactNode | string;
  className?: string;
  tooltipClassName?: string;
}) => (
  <OverlayTrigger
    placement='top'
    delay={{ show: 0, hide: 400 }}
    overlay={(props: any) => (
      <Tooltip
        {...(tooltipClassName ? { className: tooltipClassName } : {})}
        {...props}
        show={props.show.toString()}
      >
        {title}
      </Tooltip>
    )}
  >
    <div className={className ?? 'text-truncate'}>{children}</div>
  </OverlayTrigger>
);
