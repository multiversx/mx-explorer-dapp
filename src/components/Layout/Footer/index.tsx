import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/pro-solid-svg-icons/faHeart';

const Footer = () => {
  const explorerVersion = process.env.REACT_APP_CACHE_BUST;

  return (
    <footer
      className={`footer d-flex flex-column align-items-center justify-content-center text-muted ${
        explorerVersion ? 'pt-2' : ''
      }`}
    >
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
      </div>
      {explorerVersion && (
        <small className="text-muted version mt-1">Build {explorerVersion}</small>
      )}
    </footer>
  );
};

export default Footer;
