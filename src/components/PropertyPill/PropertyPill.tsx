import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { faTimes } from 'icons/regular';
import { faCheck } from 'icons/solid';

export const PropertyPill = ({
  name,
  active
}: {
  name: string;
  active: boolean;
}) => {
  return (
    <span
      className={classNames(
        'badge badge-outline badge-rounded badge-property',
        { active: active },
        { inactive: !active }
      )}
    >
      <FontAwesomeIcon className='me-1' icon={active ? faCheck : faTimes} />{' '}
      {name}
    </span>
  );
};
