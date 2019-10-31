import React from 'react';
import { faFileCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from '../../context';

interface ScAddressIconType {
  value: string;
}

const ScAddressIcon = ({ value }: ScAddressIconType) => {
  const {
    activeTestnet: { numInitCharactersForScAddress },
  } = useGlobalState();

  const showIcon =
    numInitCharactersForScAddress > 0 &&
    value.startsWith('0'.repeat(numInitCharactersForScAddress));

  return showIcon ? <FontAwesomeIcon icon={faFileCode} className="w300 mr-1" /> : null;
};

export default ScAddressIcon;
