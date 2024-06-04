import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover } from 'react-bootstrap';

import {
  NodeChangingShardIcon,
  NodeIssueIcon,
  NodeOnlineState,
  Trim,
  CopyButton,
  NetworkLink
} from 'components';
import { urlBuilder } from 'helpers';
import { faSearch, faArrowUpRightFromSquare } from 'icons/regular';
import { NodeType } from 'types';

import { NodePanelCards } from './NodePanelCards';

export const NodePanel = ({
  node,
  index
}: {
  node: NodeType;
  index?: number;
}) => {
  return (
    <>
      <Popover.Header>
        <div className='d-flex flex-wrap gap-3 align-items-center justify-content-between'>
          <span>Node</span>
          <NodeOnlineState node={node} />
        </div>
        <div className='node-bls d-flex align-items-center gap-2'>
          <NodeChangingShardIcon node={node} />
          <NodeIssueIcon node={node} />
          <Trim text={node.bls} />
          <CopyButton text={node.bls} className='side-action ms-0' />
          <NetworkLink
            to={urlBuilder.nodeDetails(node.bls)}
            className='side-action ms-0'
          >
            <FontAwesomeIcon icon={faSearch} />
          </NetworkLink>
          <NetworkLink
            to={urlBuilder.nodeDetails(node.bls)}
            className='side-action mx-0'
            target='_blank'
            rel='noreferrer nofollow noopener'
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </NetworkLink>
        </div>
        <span>Nonce: {node.nonce}</span>
      </Popover.Header>
      <Popover.Body>
        <NodePanelCards node={node} index={index} />
        {node.isInDangerZone && (
          <div className='text-orange-400 px-3 py-2'>
            Danger Zone - your staking balance is within 5% of the threshold
          </div>
        )}
      </Popover.Body>
    </>
  );
};
