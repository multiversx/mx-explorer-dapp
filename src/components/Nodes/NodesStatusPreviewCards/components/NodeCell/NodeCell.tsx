import { useRef, useState } from 'react';
import classNames from 'classnames';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { Loader } from 'components';
import { useAdapter } from 'hooks';

import { nodesOverviewSelector } from 'redux/selectors';
import { addNodeDetails } from 'redux/slices';
import {
  IndexedNodeStatusPreviewType,
  WithClassnameType,
  NodeType
} from 'types';

import { NodePanel } from '../NodePanel';

export interface NodeCellUIType extends WithClassnameType {
  node: IndexedNodeStatusPreviewType;
}

export const NodeCell = ({ node, className }: NodeCellUIType) => {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const { bls, status, isInDangerZone, auctionQualified } = node;
  const { nodeDetails: stateNodeSetails } = useSelector(nodesOverviewSelector);
  const { getNode } = useAdapter();

  const [show, setShow] = useState(false);
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [nodeDetails, setNodeDetails] = useState<NodeType | undefined>();

  const fetchNodeDetails = (bls: string) => {
    if (bls) {
      if (stateNodeSetails?.[bls]) {
        setNodeDetails(stateNodeSetails[bls]);
        setDataReady(true);
        return;
      }

      getNode(bls).then(({ data, success }) => {
        setNodeDetails(data);
        dispatch(addNodeDetails({ nodeDetails: data }));
        setDataReady(data && success);
      });
    }
  };

  const handleOnMouseEnter = () => {
    setShow(true);
  };
  const handleOnMouseLeave = () => {
    setShow(false);
  };

  return (
    <OverlayTrigger
      key='popover'
      trigger={['click', 'hover']}
      placement='top'
      delay={{ show: 100, hide: 400 }}
      rootClose
      onToggle={(show) => {
        if (show) {
          fetchNodeDetails(bls);
        }
      }}
      show={show}
      overlay={
        <Popover
          id='popover-positioned-bottom'
          className='node-panel-wrapper'
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        >
          {dataReady && nodeDetails ? (
            <NodePanel node={nodeDetails} index={node.index} />
          ) : (
            <Loader className='px-5' />
          )}
        </Popover>
      }
    >
      <div
        ref={ref}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
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
