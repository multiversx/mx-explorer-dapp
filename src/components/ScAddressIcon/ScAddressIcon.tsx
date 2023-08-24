import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { SC_INIT_CHARACTERS_LENGTH } from 'appConstants';
import { faFileAlt } from 'icons/regular';

interface ScAddressIconType {
  initiator: string;
  secondInitiator?: string;
}

export const isContract = (initiator: string | undefined, charNum: number) =>
  initiator &&
  charNum > 0 &&
  initiator.substring('erd1'.length).startsWith('q'.repeat(charNum));

export const ScAddressIcon = ({
  initiator,
  secondInitiator
}: ScAddressIconType) => {
  const showIcon =
    isContract(initiator, SC_INIT_CHARACTERS_LENGTH) ||
    isContract(secondInitiator, SC_INIT_CHARACTERS_LENGTH);

  return showIcon ? (
    <OverlayTrigger
      placement='top'
      delay={{ show: 0, hide: 400 }}
      overlay={(props: any) => (
        <Tooltip {...props} show={props.show.toString()}>
          Smart Contract
        </Tooltip>
      )}
    >
      <FontAwesomeIcon icon={faFileAlt} className='me-1 text-primary' />
    </OverlayTrigger>
  ) : null;
};
