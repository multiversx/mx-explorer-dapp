import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';

import { Led, Overlay } from 'components';
import { faClose } from 'icons/regular';
import { NodeType } from 'types';

export const NodeOnlineIcon = ({ node }: { node: NodeType }) => {
  const { online, syncProgress } = node;

  if (online && !syncProgress) {
    return (
      <Overlay title='Online'>
        <Led color='bg-success' />
      </Overlay>
    );
  }
  if (!online && !syncProgress) {
    return (
      <Overlay title='Offline'>
        <FontAwesomeIcon icon={faClose} className='text-red-400' />
      </Overlay>
    );
  }

  if (syncProgress && new BigNumber(syncProgress).isGreaterThan(0)) {
    return (
      <Overlay title='Syncing'>
        <Led color='bg-primary' />
      </Overlay>
    );
  }

  return null;
};
