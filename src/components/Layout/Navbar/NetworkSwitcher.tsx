import React from 'react';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { NetworkLinkType } from 'context/state';
import { NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NetworkUrl = ({ link, onClick }: { link: NetworkLinkType; onClick: () => void }) => {
  const { activeNetworkId } = useGlobalState();

  return (
    <Link
      className={`dropdown-item ${activeNetworkId === link.id ? 'active' : ''}`}
      to={link.url}
      onClick={onClick}
    >
      {link.name}
    </Link>
  );
};

export default function NetworkSwitcher({ onToggle }: { onToggle?: () => void }) {
  const {
    config: { links, networks },
    defaultNetwork,
    activeNetwork,
  } = useGlobalState();

  const internalLinks = networks.map(({ name, id }) => ({
    name,
    url: id === defaultNetwork.id ? '' : id,
    id,
  }));

  const hidePopover = () => {
    document.body.click();
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <>
      <NavDropdown
        title={
          <div className="nav-link-icon flex-fill pr-0 pl-md-1 ml-md-2" data-testid="networkSwitch">
            {activeNetwork.name}
            <FontAwesomeIcon className="d-inline-block ml-1" icon={faAngleDown} />
          </div>
        }
        id="network-switcher-dropdown"
        alignRight
      >
        {links.length > 0
          ? links.map((link) => (
              <a
                className={`dropdown-item ${activeNetwork.id === link.id ? 'active' : ''}`}
                href={link.url}
                key={link.id}
                onClick={hidePopover}
              >
                {link.name}
              </a>
            ))
          : internalLinks.map((link) => (
              <NetworkUrl link={link} onClick={hidePopover} key={link.id} />
            ))}
      </NavDropdown>
    </>
  );
}
