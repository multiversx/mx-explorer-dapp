import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SC_INIT_CHARACTERS_LENGTH } from 'appConstants';
import { Overlay } from 'components';
import { faCommand } from 'icons/regular';

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
    <Overlay title='Smart Contract'>
      <FontAwesomeIcon
        icon={faCommand}
        className='me-1 text-primary'
        size='sm'
      />
    </Overlay>
  ) : null;
};
