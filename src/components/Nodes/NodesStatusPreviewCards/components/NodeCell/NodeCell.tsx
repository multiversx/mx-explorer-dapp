import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { PreviewPanelWrapper } from 'components';
import { useAdapter } from 'hooks';

import { nodesOverviewSelector } from 'redux/selectors';
import { addNodeDetails } from 'redux/slices';
import { IndexedNodeStatusPreviewType, WithClassnameType } from 'types';

import { NodePanel } from '../NodePanel';

export interface NodeCellUIType extends WithClassnameType {
  node: IndexedNodeStatusPreviewType;
}

export const NodeCell = ({ node, className }: NodeCellUIType) => {
  const dispatch = useDispatch();
  const { bls, status, isInDangerZone, auctionQualified } = node;
  const { nodeDetails: stateNodeSetails } = useSelector(nodesOverviewSelector);
  const { getNode } = useAdapter();

  const currentNode = stateNodeSetails?.[bls];

  return (
    <PreviewPanelWrapper
      hash={bls}
      fetchData={() => getNode(bls)}
      cachedPreviews={stateNodeSetails ?? {}}
      preview={
        currentNode && <NodePanel node={currentNode} index={node.index} />
      }
      onApiData={(data) => {
        dispatch(addNodeDetails({ nodeDetails: data }));
      }}
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
    </PreviewPanelWrapper>
  );
};
