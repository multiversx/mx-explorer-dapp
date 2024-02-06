import { Denominate } from 'components';
import { NodeType } from 'types';

export const NodeLockedStakeTooltip = ({ node }: { node: NodeType }) => {
  if (!node) {
    return null;
  }

  if ((node.type === 'validator' && node.locked && node.stake) || node.topUp) {
    return (
      <>
        {node.stake && (
          <p className='mb-1'>
            Staked: <Denominate value={node.stake} showTooltip={false} />
          </p>
        )}
        {node.topUp && (
          <p className='mb-0'>
            Top up: <Denominate value={node.topUp} showTooltip={false} />
          </p>
        )}
      </>
    );
  }

  return null;
};
