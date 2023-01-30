import React from 'react';
import classNames from 'classnames';

import type { ChartWrapperPropsType } from './types';

import styles from './styles.module.scss';

export const ChartWrapper = (props: ChartWrapperPropsType) => {
  const { size = 'full', children } = props;

  return (
    <div
      className={classNames(styles.wrapper, { [styles.half]: size === 'half' })}
    >
      {children}
    </div>
  );
};
