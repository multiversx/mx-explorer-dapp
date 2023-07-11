import React from 'react';
import classNames from 'classnames';

import { ControlType } from './helpers/types';

export const ChartControls = ({ controls }: { controls: ControlType[] }) => (
  <div
    className={`chart-controls d-flex flex-wrap align-items-center ${
      controls.length > 1 ? 'flex-grow-1' : ''
    }`}
  >
    {controls.map((control) => (
      <div className={control.plural} key={control.singular}>
        {Object.keys(control.data).map((dataKey: string) => (
          <div
            key={dataKey}
            onClick={() => control.callback(dataKey)}
            className={classNames(control.singular, {
              active: dataKey === control.comparison
            })}
          >
            {control.data[dataKey]}
          </div>
        ))}
      </div>
    ))}
  </div>
);
