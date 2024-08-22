import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { Led, PercentageBar } from 'components';
import { NodeType, WithClassnameType } from 'types';

export interface NodeOnlineStateType extends WithClassnameType {
  node: NodeType;
}

const getNodeOnlineState = (node: NodeType) => {
  const { online, syncProgress } = node;

  switch (true) {
    case online && !syncProgress:
      return {
        textColor: 'text-success',
        ledColor: 'bg-success',
        status: 'online'
      };
    case !online && !syncProgress:
      return {
        textColor: 'text-danger',
        ledColor: 'bg-danger',
        status: 'offline'
      };
    case syncProgress && Number(syncProgress) > 0:
      return {
        textColor: '',
        ledColor: 'bg-primary',
        status: 'syncing'
      };
    default:
      return {
        textColor: '',
        ledColor: '',
        status: ''
      };
  }
};

export const NodeOnlineState = ({ node, className }: NodeOnlineStateType) => {
  const { syncProgress } = node;
  const { ledColor, textColor, status } = getNodeOnlineState(node);
  const fillPercent = new BigNumber(syncProgress || 0).times(100);

  return (
    <div
      className={classNames('node-online-state d-flex flex-column', className)}
    >
      <div className='d-flex align-items-center gap-2'>
        <Led color={ledColor} />
        <span className={textColor}>{status}</span>
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
