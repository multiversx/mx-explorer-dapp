import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { numInitCharactersForScAddress as charNum } from 'appConfig';

interface ScAddressIconType {
  initiator: string;
  secondInitiator?: string;
}

const isContract = (initiator: string | undefined, charNum: number) =>
  initiator && charNum > 0 && initiator.substr('erd1'.length).startsWith('q'.repeat(charNum));

const ScAddressIcon = ({ initiator, secondInitiator }: ScAddressIconType) => {
  const showIcon = isContract(initiator, charNum) || isContract(secondInitiator, charNum);

  return showIcon ? <FontAwesomeIcon icon={faCode} className="mr-1 text-muted" /> : null;
};

export default ScAddressIcon;
