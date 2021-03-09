import { faTh } from '@fortawesome/pro-solid-svg-icons/faTh';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import React from 'react';
import { NavDropdown } from 'react-bootstrap';

export default function AppSwitcher({ onToggle }: { onToggle?: () => void }) {
  const {
    config: { elrondApps },
  } = useGlobalState();

  const hidePopover = () => {
    document.body.click();
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <NavDropdown
      title={
        <div className="nav-link-icon flex-fill text-lg-center">
          <i className="material-icons icon-sm m-0 d-none d-lg-block">
            <span className="px-1 my-0 mx-2">
              <FontAwesomeIcon icon={faTh} />
            </span>
          </i>
          <span className="d-lg-none">Switch to</span>
          <FontAwesomeIcon className="d-inline-block d-lg-none ml-1" icon={faAngleDown} />
        </div>
      }
      id="app-switcher-dropdown"
      alignRight
    >
      {elrondApps.map(({ name, url, id }) => {
        const active = id === 'explorer';
        return (
          <a
            key={id}
            onClick={hidePopover}
            href={url}
            target={`${active ? '' : '_blank'}`}
            rel="noopener noreferrer"
            className={`dropdown-item ${active ? 'text-primary' : ''}`}
          >
            {name}
          </a>
        );
      })}
    </NavDropdown>
  );
}
