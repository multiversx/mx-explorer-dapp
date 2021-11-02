import * as React from 'react';
import {
  faTwitter,
  faLinkedin,
  faInstagram,
  faFacebook,
  faYoutube,
  faTelegram,
  faTelegramPlane,
  faMediumM,
  faMedium,
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faEnvelope, faPencil, faFileAlt } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ReactComponent as CoinMarketCap } from 'assets/images/logos/coinmarketcap.svg';
import { ReactComponent as CoinGecko } from 'assets/images/logos/coingecko.svg';

const getFaIcon = (icon: string) => {
  switch (icon) {
    case 'email':
      return faEnvelope;
    case 'blog':
      return faPencil;
    case 'whitepaper':
      return faFileAlt;
    case 'twitter':
      return faTwitter;
    case 'instagram':
      return faInstagram;
    case 'linkedin':
      return faLinkedin;
    case 'youtube':
      return faYoutube;
    case 'facebook':
      return faFacebook;
    case 'telegram-plane':
      return faTelegramPlane;
    case 'telegram':
      return faTelegram;
    case 'medium-m':
      return faMediumM;
    case 'medium':
      return faMedium;
    default:
      return faGlobe;
  }
};

const Icon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'coinmarketcap':
      return <CoinMarketCap className="social-icon" />;
    case 'coingecko':
      return <CoinGecko className="social-icon" />;
    default:
      return <FontAwesomeIcon icon={getFaIcon(icon)} className="social-icon" />;
  }
};

const SocialIcons = ({ assets }: { assets: any }) => {
  return (
    <div className="social-icons d-flex align-items-center ml-n2 mt-2 mt-lg-0">
      {Object.keys(assets).map((key, i) => (
        <OverlayTrigger
          placement="top"
          delay={{ show: 250, hide: 400 }}
          overlay={(props) => (
            <Tooltip id="social-tooltip" {...props}>
              <span className="text-capitalize">{key}: </span>
              {assets[key]}
            </Tooltip>
          )}
        >
          {key === 'email' ? (
            <a
              className="icon d-flex align-items-center justify-content-center mx-2"
              href={`mailto:${assets[key]}`}
              key={key}
            >
              <Icon icon={key} />
            </a>
          ) : (
            <a
              target="_blank"
              className="icon d-flex align-items-center justify-content-center mx-2"
              href={assets[key]}
              aria-label={key}
              key={key}
              rel="noreferrer nofollow"
            >
              <Icon icon={key} />
            </a>
          )}
        </OverlayTrigger>
      ))}
    </div>
  );
};

export default SocialIcons;
