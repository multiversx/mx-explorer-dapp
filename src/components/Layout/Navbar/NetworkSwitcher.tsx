import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { NetworkLinkType } from 'context/state';
import { NetworkIdType } from 'helpers/types';

const networksWithHttps = [...Object.values(NetworkIdType), 'testnet-azure-all-in-one-maiar'];

const NetworkUrl = ({
  link,
  onClick,
  internal,
}: {
  link: NetworkLinkType;
  onClick: () => void;
  internal?: boolean;
}) => {
  const { activeNetworkId } = useGlobalState();

  let internalUrl = `/${link.url}`;
  if (internal) {
    const { protocol: currentProtocol, origin: currentOrigin } = window.location;
    const requiredProtocol = networksWithHttps.includes(link.id) ? 'https:' : 'http:';
    const newOrigin = currentOrigin.replace(currentProtocol, requiredProtocol);
    internalUrl = `${newOrigin}${internalUrl}`;
  }

  return (
    <a
      className={`dropdown-item ${activeNetworkId === link.id ? 'active' : ''}`}
      href={internal ? internalUrl : link.url}
      onClick={onClick}
    >
      {link.name}
    </a>
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
          <div className="nav-link-icon flex-fill pr-0 pl-lg-1 ml-lg-2" data-testid="networkSwitch">
            {activeNetwork.name}
            <FontAwesomeIcon className="d-inline-block ml-1" icon={faAngleDown} />
          </div>
        }
        id="network-switcher-dropdown"
        alignRight
      >
        {links.length > 0
          ? links.map((link) => <NetworkUrl link={link} onClick={hidePopover} key={link.id} />)
          : internalLinks.map((link) => (
              <NetworkUrl link={link} onClick={hidePopover} key={link.id} internal />
            ))}
      </NavDropdown>
    </>
  );
}
