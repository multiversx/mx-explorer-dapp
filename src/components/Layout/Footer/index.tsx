import { useGlobalState } from 'context';
import { useLocation } from 'react-router-dom';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/pro-solid-svg-icons/faHeart';

const Footer = () => {
  const { activeNetwork } = useGlobalState();
  const { pathname } = useLocation();

  return (
    <footer className="footer d-flex flex-column align-items-center justify-content-center text-muted">
      <div className="footer-inner">
        <a
          {...{
            target: '_blank',
          }}
          className="d-flex align-items-center"
          href="https://elrond.com/"
        >
          Made with <FontAwesomeIcon icon={faHeart} className="text-danger mx-1" />
          by the Elrond team.
        </a>
        {pathname === '/erd' && !activeNetwork.default && (
          <span>
            {' '}
            • <span data-testid="footerCurrentTestnet">{activeNetwork.name}</span>
          </span>
        )}
      </div>
    </footer>
  );
};

export default Footer;
