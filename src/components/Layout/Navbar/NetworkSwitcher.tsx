import React from 'react';
import { Link } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { NetworkLinkType } from 'context/state';

const networksWithHttps = ['mainnet', 'devnet', 'testnet', 'testnet-azure-all-in-one-maiar'];

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

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const requiredProtocol = networksWithHttps.includes(activeNetwork.id) ? 'https:' : 'http:';
      const { protocol: currentProtocol, origin: currentOrigin, pathname } = window.location;
      if (requiredProtocol !== currentProtocol) {
        const origin = currentOrigin.replace(currentProtocol, requiredProtocol);
        const href = `${origin}${pathname}`;
        window.location.href = href;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetwork]);

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
