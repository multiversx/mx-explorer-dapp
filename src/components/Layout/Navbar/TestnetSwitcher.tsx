import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function TestnetSwitcher({ onToggle }: { onToggle: (prop: boolean) => void }) {
  const globalState = useGlobalState();

  const liksArray = globalState.config.testnets.map(testnet => ({
    name: testnet.name,
    to: testnet.id === globalState.defaultTestnet.id ? '' : testnet.id,
    key: testnet.id,
  }));

  const hidePopover = () => {
    document.body.click();
    onToggle(false);
  };

  return (
    <>
      <NavDropdown
        title={
          <span id="switch" data-testid="testnetSwitch" className="switch">
            {globalState.activeTestnet.name}&nbsp;
            <FontAwesomeIcon icon={faAngleDown} />
          </span>
        }
        id="basic-nav-dropdown"
      >
        {liksArray.map(link => {
          return (
            <Link
              className={`dropdown-item ${globalState.activeTestnetId === link.to ? 'active' : ''}`}
              key={link.key}
              to={`/${link.to}`}
              onClick={hidePopover}
            >
              {link.name}
            </Link>
          );
        })}
      </NavDropdown>
    </>
  );
}
