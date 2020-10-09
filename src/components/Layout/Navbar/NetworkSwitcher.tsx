import React from 'react';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { defaultNetwork } from 'context/config';
import { NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NetworkSwitcher({ onToggle }: { onToggle?: () => void }) {
  const globalState = useGlobalState();

  const liksArray = globalState.config.networks.map((network) => ({
    name: network.name,
    to: network.id === globalState.defaultNetwork.id ? '' : network.id,
    key: network.id,
  }));

  const hidePopover = () => {
    document.body.click();
    if (onToggle) {
      onToggle();
    }
  };

  const changeNetwork = (networkId: string) => (e: React.MouseEvent) => {
    hidePopover();
    if (globalState.activeNetworkId !== networkId) {
      const network =
        globalState.config.networks.find((t) => {
          if (networkId) {
            return t.id === networkId;
          } else return t.default;
        }) || defaultNetwork;

      if (!network.default) {
        switch (network.name.toLocaleLowerCase()) {
          case 'mainnet':
            e.preventDefault();
            window.location.href = 'https://explorer.elrond.com/';
            break;
          case 'testnet':
            e.preventDefault();
            window.location.href = 'https://testnet-explorer.elrond.com/';
            break;
          default:
            break;
        }
      }
    }
  };

  return (
    <>
      <NavDropdown
        title={
          <div className="nav-link-icon flex-fill pr-0 pl-lg-1 ml-lg-2" data-testid="networkSwitch">
            {globalState.activeNetwork.name}&nbsp;
            <FontAwesomeIcon className="d-none d-lg-inline-block" icon={faAngleDown} />
          </div>
        }
        id="network-switcher-dropdown"
        alignRight
      >
        {liksArray.map((link) => {
          return (
            <Link
              className={`dropdown-item ${globalState.activeNetworkId === link.to ? 'active' : ''}`}
              key={link.key}
              to={`/${link.to}`}
              onClick={changeNetwork(link.to)}
            >
              {link.name}
            </Link>
          );
        })}
      </NavDropdown>
    </>
  );
}
