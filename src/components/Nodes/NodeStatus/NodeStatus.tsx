import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import { PercentageBar } from 'components';
import { getNodeStatusDisplay } from 'helpers';
import { NodeType, WithClassnameType } from 'types';

export interface NodeStatusType extends WithClassnameType {
  node: NodeType;
}

export const NodeStatus = ({ node, className }: NodeStatusType) => {
  const { syncProgress } = node;
  const { text, textColor, icon, iconColor } = getNodeStatusDisplay(node);
  const fillPercent = new BigNumber(syncProgress || 0).times(100);

  return (
    <div className={classNames('d-flex flex-column', className)}>
      <div className='d-flex align-items-center gap-1'>
        {icon && <FontAwesomeIcon icon={icon} className={iconColor} />}
        <span className={textColor}>
          {text}
          {node?.syncProgress && (
            <span className='text-neutral-400'> (Syncing)</span>
          )}
        </span>
        {node?.syncProgress && (
          <span className='text-neutral-400'>
            ({`${fillPercent.toFormat(2)}%`})
          </span>
        )}
      </div>
      {node?.syncProgress && (
        <PercentageBar
          overallPercent={0}
          fillPercent={fillPercent.toNumber()}
          fillPercentLabel={`${fillPercent.toFormat()}%`}
          type='small'
          className='mt-2'
        />
      )}
    </div>
  );
};
