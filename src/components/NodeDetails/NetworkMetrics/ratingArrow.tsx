import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { NodeType } from 'context/state';

const RatingArrow = ({ node, showTemp = false }: { node: NodeType; showTemp?: boolean }) => {
  const arrowsOffset = '0.56rem';
  const value = showTemp ? node.tempRating : node.rating;

  return (
    <div
      className={`${showTemp ? 'temp-' : ''}rating`}
      style={{
        left: `calc(${value}% - ${arrowsOffset})`,
      }}
    >
      <OverlayTrigger
        placement={showTemp ? 'bottom' : 'top'}
        delay={{ show: 0, hide: 400 }}
        overlay={(props: any) => (
          <Tooltip {...props} show={props.show.toString()}>
            {showTemp ? 'Temp' : ''} Rating {value}
          </Tooltip>
        )}
      >
        <div className={`arrow-${showTemp ? 'down' : 'up'}`} />
      </OverlayTrigger>
    </div>
  );
};

export default RatingArrow;
