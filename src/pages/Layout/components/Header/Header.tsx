import React, { useState, MouseEvent } from 'react';
import { faGrid, faGrid2 } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { ReactComponent as MultiversXLogo } from 'assets/img/logo-full.svg';

import { Applications } from './components/Applications';
import { Links } from './components/Links';
import { Switcher } from './components/Switcher';
import { HeaderPropsType } from './types';

export const Header = (props: HeaderPropsType) => {
  const { onExpand } = props;

  const [menuActive, setMenuActive] = useState(false);
  const [applicationsActive, setApplicationsActive] = useState(false);

  const onMenuToggle = (event: MouseEvent) => {
    if (window.innerWidth <= 768) {
      onExpand(!menuActive);
    }

    event.preventDefault();
    setApplicationsActive(false);
    setTimeout(
      () => setMenuActive((menuActive) => !menuActive),
      applicationsActive ? 400 : 0
    );
  };

  const onApplicationsToggle = (event: MouseEvent) => {
    event.preventDefault();
    setMenuActive(false);

    setTimeout(
      () => {
        if (window.innerWidth <= 768) {
          onExpand(!applicationsActive);
        }

        setApplicationsActive((applicationsActive) => !applicationsActive);
      },
      menuActive ? 400 : 0
    );
  };

  const onApplicationsClose = () => {
    setApplicationsActive(false);
    onExpand(false);
  };

  const onMenuClose = () => {
    setMenuActive(false);
    onExpand(false);
  };

  return (
    <header className='header'>
      <div className='wrapper'>
        <Link to='/' className='logo'>
          <MultiversXLogo />
        </Link>
      </div>

      <div className='burger' onClick={onMenuToggle}>
        <div className={classNames('bars', { active: menuActive })}>
          {Array.from({ length: 3 }).map((item, index) => (
            <span className='bar' key={`bar-${index}`} />
          ))}
        </div>
      </div>

      <div
        tabIndex={0}
        onClick={onApplicationsToggle}
        onBlur={() => setTimeout(onApplicationsClose, 100)}
        className={classNames('matrix', {
          active: applicationsActive
        })}
      >
        <FontAwesomeIcon icon={faGrid} className='desktop' />
        <FontAwesomeIcon icon={faGrid2} className='mobile' />
      </div>

      <div
        className={classNames('applicationswrapper', {
          active: applicationsActive
        })}
      >
        <Applications onClick={onApplicationsClose} />
      </div>

      <div
        className={classNames('menuwrapper', {
          active: menuActive
        })}
      >
        <Links onClick={onMenuClose} />
        <Switcher onSwitch={onMenuClose} />
      </div>
    </header>
  );
};
