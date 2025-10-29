import { useState, MouseEvent, useEffect, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { BRAND_NAME } from 'appConstants';
import MultiversXLogo from 'assets/img/logo-full.svg';
import MultiversXSymbol from 'assets/img/symbol.svg';
import { NetworkLink } from 'components';
import { useIsMainnet, useGetExplorerTitle } from 'hooks';
import { faGrid, faGrid2 } from 'icons/solid';
import { EcosystemMenu } from './components/EcosystemMenu';
import { Links } from './components/Links';
import { Switcher } from './components/Switcher';
import { HeaderPropsType } from './types';

export const Header = memo((props: HeaderPropsType) => {
  const isMainnet = useIsMainnet();
  const explorerTitle = useGetExplorerTitle();

  const { onExpand } = props;

  const [menuActive, setMenuActive] = useState(false);
  const [ecosystemMenuActive, setEcosystemMenuActive] = useState(false);

  const onMenuToggle = (event: MouseEvent) => {
    if (window.innerWidth <= 768) {
      onExpand(!menuActive);
    }

    event.preventDefault();
    setEcosystemMenuActive(false);
    setTimeout(
      () => setMenuActive((menuActive) => !menuActive),
      ecosystemMenuActive ? 400 : 0
    );
  };

  const onEcosystemMenuToggle = (event: MouseEvent) => {
    event.preventDefault();
    setMenuActive(false);

    setTimeout(
      () => {
        if (window.innerWidth <= 768) {
          onExpand(!ecosystemMenuActive);
        }

        setEcosystemMenuActive((ecosystemMenuActive) => !ecosystemMenuActive);
      },
      menuActive ? 400 : 0
    );
  };

  const onMenuClose = () => {
    setMenuActive(false);
    onExpand(false);
  };

  useEffect(() => {
    const onClickOutsideEcosystemMenu = () => {
      setEcosystemMenuActive(false);
      onExpand(false);
    };

    window.addEventListener('pointerdown', onClickOutsideEcosystemMenu);

    return () =>
      window.removeEventListener('pointerdown', onClickOutsideEcosystemMenu);
  }, [onExpand]);

  return (
    <header className='header'>
      <div className='logo-wrapper'>
        <NetworkLink
          to='/'
          className='logo'
          aria-label={`${BRAND_NAME} Explorer`}
        >
          {isMainnet ? (
            <MultiversXLogo />
          ) : (
            <span className='header-symbol'>
              <MultiversXSymbol />
              <span className='header-title'>{explorerTitle}</span>
            </span>
          )}
        </NetworkLink>
      </div>

      <div
        className={classNames('menu-wrapper', {
          active: menuActive
        })}
      >
        <Links onClick={onMenuClose} />
        <Switcher />
      </div>

      <button
        type='button'
        id='ecosystem-menu-button'
        onClick={onEcosystemMenuToggle}
        onPointerDown={(e) => e.stopPropagation()}
        className={classNames('matrix btn-unstyled  btn btn-dark', {
          active: ecosystemMenuActive
        })}
        aria-haspopup='true'
        aria-controls='ecosystem-menu'
        aria-label='Ecosystem Menu'
      >
        <FontAwesomeIcon icon={faGrid} className='desktop' />
        <FontAwesomeIcon icon={faGrid2} className='mobile' />
      </button>

      <div className='burger' onClick={onMenuToggle}>
        <div className={classNames('bars', { active: menuActive })}>
          {Array.from({ length: 3 }).map((_item, index) => (
            <span className='bar' key={`bar-${index}`} />
          ))}
        </div>
      </div>

      <div
        onPointerDown={(e) => e.stopPropagation()}
        className={classNames('ecosystem-menu-wrapper', {
          active: ecosystemMenuActive
        })}
      >
        <EcosystemMenu />
      </div>
    </header>
  );
});
