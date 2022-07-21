import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const Overlay = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <OverlayTrigger
    placement="top"
    delay={{ show: 0, hide: 400 }}
    overlay={(props: any) => (
      <Tooltip {...props} show={props.show.toString()}>
        {title}
      </Tooltip>
    )}
  >
    <div className="d-flex align-items-center justify-content-center">{children}</div>
  </OverlayTrigger>
);
export default Overlay;
