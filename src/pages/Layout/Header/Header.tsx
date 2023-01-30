import React, { useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGrid, faGrid2 } from '@fortawesome/pro-solid-svg-icons';
import classNames from 'classnames';

import { ReactComponent as MultiversXLogo } from 'assets/img/logo-full.svg';

import { Applications } from './components/Applications';
import { Links } from './components/Links';
import { Switcher } from './components/Switcher';

import type { HeaderPropsType } from './types';

import styles from './styles.module.scss';

export const Header = (props: HeaderPropsType) => {
  const { onExpand } = props;

  const [menu, setMenu] = useState(false);
  const [applications, setApplications] = useState(false);

  const onMenuToggle = (event: MouseEvent) => {
    if (window.innerWidth <= 768) {
      onExpand(!menu);
    }

    event.preventDefault();
    setApplications(false);
    setTimeout(() => setMenu((menu) => !menu), applications ? 400 : 0);
  };

  const onApplicationsToggle = (event: MouseEvent) => {
    event.preventDefault();
    setMenu(false);

    setTimeout(
      () => {
        console.log(window.innerWidth);

        if (window.innerWidth <= 768) {
          onExpand(!applications);
        }

        setApplications((applications) => !applications);
      },
      menu ? 400 : 0
    );
  };

  const onApplicationsClose = () => {
    setApplications(false);
    onExpand(false);
  };

  const onMenuClose = () => {
    setMenu(false);
    onExpand(false);
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
        onBlur={() => setTimeout(onApplicationsClose, 100)}
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
        <Applications onClick={onApplicationsClose} />
      </div>

      <div
        className={classNames(styles.menu, {
          [styles.active]: menu
        })}
      >
        <Links onClick={onMenuClose} />
        <Switcher onSwitch={onMenuClose} />
      </div>
    </header>
  );
};
