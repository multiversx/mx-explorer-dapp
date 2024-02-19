import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getValidLink } from 'helpers';
import { faArrowUpRight } from 'icons/regular';

export const SocialWebsite = ({ link }: { link?: string }) => {
  const formattedLink = getValidLink({ link });
  if (!formattedLink) {
    return null;
  }

  return (
    <a href={formattedLink} target='_blank' rel='noreferrer nofollow noopener'>
      {formattedLink}
      <FontAwesomeIcon icon={faArrowUpRight} className='ms-1' size='sm' />
    </a>
  );
};
