import { faCube } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface MiniBlockNotFoundType {
  miniBlockHash: string | undefined;
}

export default function MiniBlockNotFound({ miniBlockHash }: MiniBlockNotFoundType) {
  return (
    <div className="card">
      <div className="card-body card-details">
        <div className="empty">
          <FontAwesomeIcon icon={faCube} className="empty-icon" />
          <span className="h4 empty-heading">Unable to locate this miniblock hash</span>
          <span className="empty-details">{miniBlockHash}</span>
        </div>
      </div>
    </div>
  );
}
