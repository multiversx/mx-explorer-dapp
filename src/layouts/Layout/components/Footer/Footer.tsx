import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BRAND_NAME } from 'appConstants';
import { faHeart } from 'icons/solid';

import { version } from '../../../../../package.json';

export const Footer = () => {
  const explorerVersion = process.env.VITE_APP_CACHE_BUST;

  return (
    <footer
      className={`footer d-flex flex-column align-items-center justify-content-center text-muted ${
        explorerVersion ? 'pt-2' : ''
      }`}
    >
      <div className='footer-inner'>
        <a
          rel='noopener noreferrer nofollow'
          target='_blank'
          className='d-flex align-items-center text-neutral-400'
          href='https://multiversx.com/'
        >
          Made with{' '}
          <FontAwesomeIcon icon={faHeart} className='text-danger mx-1' />
          by the {BRAND_NAME} team
        </a>
      </div>
      {explorerVersion && (
        <small className='text-muted version mt-1'>
          Build {version}-{explorerVersion}
        </small>
      )}
    </footer>
  );
};
