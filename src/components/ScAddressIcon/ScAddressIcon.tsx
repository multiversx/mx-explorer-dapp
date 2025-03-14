import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Overlay } from 'components';
import { isContract } from 'helpers';
import { faCommand } from 'icons/regular';

interface ScAddressIconType {
  initiator: string;
  secondInitiator?: string;
}

export const ScAddressIcon = ({
  initiator,
  secondInitiator
}: ScAddressIconType) => {
  const showIcon = isContract(initiator) || isContract(secondInitiator);

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
