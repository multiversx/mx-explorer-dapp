import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from 'icons/light';

export const PropertyPill = ({
  name,
  active
}: {
  name: string;
  active: boolean;
}) => {
  return (
    <span
      className={`badge badge-outline badge-rounded badge-direction ${
        active ? 'in' : 'out'
      }`}
    >
      <FontAwesomeIcon className='me-1' icon={active ? faCheck : faTimes} />{' '}
      {name}
    </span>
  );
};
