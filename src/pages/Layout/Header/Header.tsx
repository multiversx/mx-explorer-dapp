import React, { useState, MouseEvent, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGrid, faGrid2 } from '@fortawesome/pro-solid-svg-icons';
import classNames from 'classnames';

import { ReactComponent as MultiversXLogo } from 'assets/img/logo-full.svg';

import { Applications } from './components/Applications';
import { Links } from './components/Links';
import { Switcher } from './components/Switcher';

import styles from './styles.module.scss';

export const Header = () => {
  const [menu, setMenu] = useState(false);
  const [applications, setApplications] = useState(false);

  const onMenuToggle = (event: MouseEvent) => {
    event.preventDefault();
    setApplications(false);
    setTimeout(() => setMenu((menu) => !menu), applications ? 400 : 0);
  };

  const onApplicationsToggle = (event: MouseEvent) => {
    event.preventDefault();
    setMenu(false);

    setTimeout(
      () => setApplications((applications) => !applications),
      menu ? 400 : 0
    );
  };

  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <Link to='/' className={styles.logo}>
          <MultiversXLogo />
        </Link>
      </div>

      <div className={styles.burger} onClick={onMenuToggle}>
        <div className={classNames(styles.bars, { [styles.active]: menu })}>
          {Array.from({ length: 3 }).map((item, index) => (
            <span className={styles.bar} key={`bar-${index}`} />
          ))}
        </div>
      </div>

      <div
        tabIndex={0}
        onClick={onApplicationsToggle}
        onBlur={() => setTimeout(() => setApplications(false), 100)}
        className={classNames(styles.matrix, {
          [styles.active]: applications
        })}
      >
        <FontAwesomeIcon icon={faGrid} className={styles.desktop} />
        <FontAwesomeIcon icon={faGrid2} className={styles.mobile} />
      </div>

      <div
        className={classNames(styles.applications, {
          [styles.active]: applications
        })}
      >
        <Applications onClick={() => setApplications(false)} />
      </div>

      <div
        className={classNames(styles.menu, {
          [styles.active]: menu
        })}
      >
        <Links onClick={() => setMenu(false)} />
        <Switcher onSwitch={() => setMenu(false)} />
      </div>
    </header>
  );
};
