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
          <div>
            Staked: <Denominate value={node.stake} showTooltip={false} />
          </div>
        )}
        {node.topUp && (
          <div>
            Top up: <Denominate value={node.topUp} showTooltip={false} />
          </div>
        )}
      </>
    );
  }

  return null;
};
