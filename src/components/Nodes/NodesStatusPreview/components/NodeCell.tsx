import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { useAdapter } from 'hooks';
import { faSpinnerThird } from 'icons/regular';
import { NodeStatusPreviewType, WithClassnameType, NodeType } from 'types';

export interface NodeCellUIType extends WithClassnameType {
  node: NodeStatusPreviewType;
}

export const NodeCell = ({ node, className }: NodeCellUIType) => {
  const { bls, status, isInDangerZone, auctionQualified } = node;
  const { getNode } = useAdapter();

  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [nodeDetails, setNodeDetails] = useState<NodeType | undefined>();

  const fetchNodeDetails = (bls: string) => {
    if (bls) {
      getNode(bls).then(({ data, success }) => {
        setNodeDetails(data);
        setDataReady(data && success);
      });
    }
  };

  return (
    <OverlayTrigger
      placement='top'
      delay={{ show: 0, hide: 400 }}
      onToggle={() => {
        fetchNodeDetails(bls);
      }}
      overlay={(props: any) => (
        <Tooltip {...props} show={props.show.toString()}>
          <>
            {dataReady ? (
              <>
                {nodeDetails?.bls}
                {node.status}
              </>
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faSpinnerThird}
                  size={'sm'}
                  className='ms-2 fa-spin fast-spin'
                />
              </>
            )}
          </>
        </Tooltip>
      )}
    >
      <div
        className={classNames(
          'node-cell cursor-context',
          status,
          {
            isInDangerZone: isInDangerZone,
            auctionQualified: auctionQualified
          },
          className
        )}
        aria-description={`${bls}: ${status}`}
      ></div>
    </OverlayTrigger>
  );
};
