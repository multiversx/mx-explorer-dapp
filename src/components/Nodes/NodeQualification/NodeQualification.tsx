import classNames from 'classnames';

import { Led, NodeDangerZoneTooltip } from 'components';
import {
  NodeType,
  WithClassnameType,
  NodeQualificationStatusEnum
} from 'types';

export interface NodeQualificationUIType extends WithClassnameType {
  node: NodeType;
  showDangerZone?: boolean;
}

export const NodeQualification = ({
  node,
  showDangerZone = false,
  className
}: NodeQualificationUIType) => {
  const { auctionQualified, isInDangerZone } = node;

  const NodeStatusComponent = () => {
    if (auctionQualified) {
      if (showDangerZone && isInDangerZone) {
        return (
          <>
            <Led color='bg-red-400' />
            <NodeDangerZoneTooltip node={node} />
          </>
        );
      }

      return (
        <>
          <Led color='bg-success' />
          <span className='text-success'>
            {NodeQualificationStatusEnum.qualified}
          </span>
        </>
      );
    }

    return (
      <>
        <Led color='bg-neutral-500' />
        <span className='text-neutral-500'>
          {NodeQualificationStatusEnum.notQualified}
        </span>
      </>
    );
  };

  return (
    <div className={classNames('d-flex align-items-center gap-2', className)}>
      <NodeStatusComponent />
    </div>
  );
};
