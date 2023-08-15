import React from 'react';
import { faHistory } from 'icons/regular';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Overlay } from 'components';
import { NodeType } from 'types';

export const RowFullHistory = ({
  node,
  small
}: {
  node: NodeType;
  small?: boolean;
}) => {
  if (node.type === 'observer' && node.fullHistory) {
    return (
      <Overlay title='Full History' className='node-icon'>
        <div className='d-flex align-items-center justify-content-center'>
          <FontAwesomeIcon
            icon={faHistory}
            className='text-neutral-400 mx-1'
            size={small ? 'xs' : '1x'}
          />
        </div>
      </Overlay>
    );
  }

  return null;
};
