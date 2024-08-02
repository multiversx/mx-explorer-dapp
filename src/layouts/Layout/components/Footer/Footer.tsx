import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { BRAND_NAME } from 'appConstants';
import { faHeart } from 'icons/solid';
import { activeNetworkSelector } from 'redux/selectors';

import { version } from '../../../../../package.json';

export const Footer = () => {
  const explorerVersion = process.env.VITE_APP_CACHE_BUST;
  const { accessToken: hasAccessToken } = useSelector(activeNetworkSelector);

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
      {hasAccessToken && (
        <small className='grecaptcha-footer-badge text-neutral-400 mt-1 text-center'>
          This site is protected by reCAPTCHA and the Google{' '}
          <a
            href='https://policies.google.com/privacy'
            target='_blank'
            rel='noreferrer nofollow noopener'
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href='https://policies.google.com/terms'
            target='_blank'
            rel='noreferrer nofollow noopener'
          >
            Terms of Service
          </a>{' '}
          apply.
        </small>
      )}
      {explorerVersion && (
        <small className='text-muted version mt-1'>
          Build {version}-{explorerVersion}
        </small>
      )}
    </footer>
  );
};
