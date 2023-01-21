import { faFileAlt } from '@fortawesome/pro-regular-svg-icons/faFileAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { numInitCharactersForScAddress as charNum } from 'appConfig';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface ScAddressIconType {
  initiator: string;
  secondInitiator?: string;
}

export const isContract = (initiator: string | undefined, charNum: number) =>
  initiator && charNum > 0 && initiator.substr('erd1'.length).startsWith('q'.repeat(charNum));

export const ScAddressIcon = ({ initiator, secondInitiator }: ScAddressIconType) => {
  const showIcon = isContract(initiator, charNum) || isContract(secondInitiator, charNum);

  return showIcon ? (
    <OverlayTrigger
      placement="top"
      delay={{ show: 0, hide: 400 }}
      overlay={(props: any) => (
        <Tooltip {...props} show={props.show.toString()}>
          Smart Contract
        </Tooltip>
      )}
    >
      <FontAwesomeIcon icon={faFileAlt} className="mr-1 text-secondary" />
    </OverlayTrigger>
  ) : null;
};
