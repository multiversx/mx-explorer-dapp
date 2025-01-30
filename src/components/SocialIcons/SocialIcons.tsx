import {
  faXTwitter,
  faLinkedin,
  faInstagram,
  faFacebook,
  faYoutube,
  faTelegram,
  faTelegramPlane,
  faMediumM,
  faMedium,
  faDiscord,
  faReddit,
  faThreads,
  faTiktok,
  faGithub,
  faGooglePlay,
  faAppStore
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ReactComponent as CoinGecko } from 'assets/img/logos/coingecko.svg';
import { ReactComponent as CoinMarketCap } from 'assets/img/logos/coinmarketcap.svg';
import { Overlay } from 'components';
import { faGlobe, faEnvelope, faPencil, faFileAlt } from 'icons/regular';
import { faUsers } from 'icons/solid';

const getFaIcon = (icon: string) => {
  const searchIcon = String(icon).toLowerCase();
  switch (searchIcon) {
    case 'appstore':
      return faAppStore;
    case 'blog':
      return faPencil;
    case 'community':
      return faUsers;
    case 'discord':
      return faDiscord;
    case 'email':
      return faEnvelope;
    case 'facebook':
      return faFacebook;
    case 'github':
      return faGithub;
    case 'googleplay':
      return faGooglePlay;
    case 'instagram':
      return faInstagram;
    case 'linkedin':
      return faLinkedin;
    case 'medium':
      return faMedium;
    case 'medium-m':
      return faMediumM;
    case 'reddit':
      return faReddit;
    case 'telegram-plane':
      return faTelegramPlane;
    case 'telegram':
      return faTelegram;
    case 'threads':
      return faThreads;
    case 'tiktok':
      return faTiktok;
    case 'whitepaper':
      return faFileAlt;
    case 'x':
    case 'twitter':
      return faXTwitter;
    case 'youtube':
      return faYoutube;
    default:
      return faGlobe;
  }
};

const Icon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'coinmarketcap':
      return <CoinMarketCap className='social-icon' />;
    case 'coingecko':
      return <CoinGecko className='social-icon' />;
    default:
      return <FontAwesomeIcon icon={getFaIcon(icon)} className='social-icon' />;
  }
};

export const SocialIcons = ({
  assets,
  excludeWebsite = false
}: {
  assets: any;
  excludeWebsite?: boolean;
}) => {
  if (!assets || Object.keys(assets).length === 0) {
    return null;
  }

  return (
    <div className='social-icons mt-2 mt-lg-0'>
      {Object.keys(assets).map((social, i) => {
        if (excludeWebsite && social === 'website') {
          return null;
        }

        return (
          <Overlay
            title={
              <>
                <span className='text-capitalize'>{social}: </span>
                {assets[social]}
              </>
            }
            key={`social-icon-${i}`}
            truncate
          >
            {social === 'email' ? (
              <a
                className='icon d-flex align-items-center justify-content-center'
                href={`mailto:${assets[social]}`}
              >
                <Icon icon={social} />
              </a>
            ) : (
              <a
                target='_blank'
                className='icon d-flex align-items-center justify-content-center'
                href={assets[social]}
                aria-label={social}
                rel='noreferrer nofollow noopener'
              >
                <Icon icon={social} />
              </a>
            )}
          </Overlay>
        );
      })}
    </div>
  );
};
