import React from 'react';

import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
import { faGrid } from '@fortawesome/pro-solid-svg-icons/faGrid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavDropdown, Anchor } from 'react-bootstrap';

import { multiversxApps } from 'config';

export const AppSwitcher = ({ onToggle }: { onToggle?: () => void }) => {
  const hidePopover = () => {
    document.body.click();
    if (onToggle) {
      onToggle();
    }
  };
  return (
    <NavDropdown
      title={<FontAwesomeIcon icon={faGrid} />}
      className='nav-dropdown'
    >
      {multiversxApps.map((app) => (
        <a
          key={app.id}
          href={app.url}
          target={`${app.id === 'explorer' ? '' : '_blank'}`}
          rel='noopener noreferrer'
          className={`dropdown-item ${app.id === 'explorer' ? 'active' : ''}`}
          onClick={hidePopover}
        >
          {app.name}
        </a>
      ))}
    </NavDropdown>
  );
};
