import React, { MouseEvent } from 'react';
import classNames from 'classnames';

import { multiversxApps } from 'config';

import styles from './styles.module.scss';
import { ApplicationsPropsType } from './types';

export const Applications = (props: ApplicationsPropsType) => {
  const { onClick } = props;

  const onItemClick = (event: MouseEvent) => {
    document.body.click();

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div className={styles.applications}>
      {multiversxApps.map((application) => (
        <a
          key={application.id}
          href={application.url}
          target={`${application.id === 'explorer' ? '' : '_blank'}`}
          rel='noopener noreferrer'
          onClick={onItemClick}
          className={classNames(styles.application, {
            [styles.active]: application.id === 'explorer'
          })}
        >
          {application.name}
        </a>
      ))}
    </div>
  );
};
