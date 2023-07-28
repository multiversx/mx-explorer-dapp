import React from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { ChartWrapperPropsType } from './types';

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
