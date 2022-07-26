import * as React from 'react';
import { faHistory } from '@fortawesome/pro-regular-svg-icons/faHistory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NodeType } from 'helpers/types';
import { Overlay } from 'sharedComponents';

const RowFullHistory = ({ node, small }: { node: NodeType; small?: boolean }) => {
  if (node.type === 'observer' && node.fullHistory) {
    return (
      <Overlay title="Full History">
        <FontAwesomeIcon
          icon={faHistory}
          className="text-secondary ml-1 mr-2"
          size={small ? 'xs' : '1x'}
        />
      </Overlay>
    );
  }

  return null;
};

export default RowFullHistory;
