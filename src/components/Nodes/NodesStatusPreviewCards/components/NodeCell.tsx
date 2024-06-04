import { useState } from 'react';
import classNames from 'classnames';
import { OverlayTrigger, Popover } from 'react-bootstrap';

import { Loader } from 'components';
import { useAdapter } from 'hooks';
import {
  IndexedNodeStatusPreviewType,
  WithClassnameType,
  NodeType
} from 'types';

import { NodePanel } from './NodePanel';

export interface NodeCellUIType extends WithClassnameType {
  node: IndexedNodeStatusPreviewType;
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
      key='popover'
      trigger='click'
      placement='top'
      rootClose
      onToggle={() => {
        fetchNodeDetails(bls);
      }}
      overlay={
        <Popover id='popover-positioned-bottom' className='node-panel-wrapper'>
          {dataReady && nodeDetails ? (
            <NodePanel node={nodeDetails} index={node.index} />
          ) : (
            <Loader className='px-5' />
          )}
        </Popover>
      }
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
