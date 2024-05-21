import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import { Led, Overlay } from 'components';
import { faClose } from 'icons/regular';
import { NodeType, WithClassnameType } from 'types';

export interface NodeOnlineIconUIType extends WithClassnameType {
  node: NodeType;
}

export const NodeOnlineIcon = ({ node, className }: NodeOnlineIconUIType) => {
  const { online, syncProgress } = node;

  if (online && !syncProgress) {
    return (
      <Overlay title='Online'>
        <Led color={classNames('bg-success', className)} />
      </Overlay>
    );
  }
  if (!online && !syncProgress) {
    return (
      <Overlay title='Offline'>
        <FontAwesomeIcon
          icon={faClose}
          className={classNames('text-red-400', className)}
        />
      </Overlay>
    );
  }

  if (syncProgress && new BigNumber(syncProgress).isGreaterThan(0)) {
    const fillPercent = new BigNumber(syncProgress || 0).times(100);

    return (
      <Overlay title={`Syncing (${fillPercent.toFormat(2)}%)`}>
        <Led color={classNames('bg-primary', className)} />
      </Overlay>
    );
  }

  return null;
};
