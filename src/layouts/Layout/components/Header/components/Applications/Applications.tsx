import React from 'react';
import classNames from 'classnames';

import { multiversxApps } from 'config';

export const Applications = () => {
  return (
    <div className='applications'>
      {multiversxApps.map((application) => {
        return application.id === 'explorer' ? (
          <span key={application.id} className='application active'>
            {application.name}
          </span>
        ) : (
          <a
            key={application.id}
            href={application.url}
            target={`${application.id === 'explorer' ? '' : '_blank'}`}
            rel='noopener noreferrer'
            className={classNames('application', {
              active: application.id === 'explorer'
            })}
          >
            {application.name}
          </a>
        );
      })}
    </div>
  );
};
