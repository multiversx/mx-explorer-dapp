import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Anchor, Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { CustomNetworkMenu } from 'components';
import { networks, links } from 'config';
import { getSubdomainNetwork } from 'helpers';
import { faAngleDown } from 'icons/solid';

import { activeNetworkSelector, defaultNetworkSelector } from 'redux/selectors';

export const Switcher = () => {
  const { id: activeNetworkId, name: activeNetworkName } = useSelector(
    activeNetworkSelector
  );
  const { id: defaultNetworkId } = useSelector(defaultNetworkSelector);
  const { isSubSubdomain } = getSubdomainNetwork();

  const networkLinks = networks.map(({ name, id }) => {
    let url = id === defaultNetworkId ? '/' : `/${id}`;
    if (isSubSubdomain && window?.location?.hostname) {
      const [_omit, ...rest] = window.location.hostname.split('.');
      url = `https://${[id, ...rest].join('.')}`;
    }
    return {
      name,
      url,
      id
    };
  });

  return (
    <Dropdown className='switcher'>
      <Dropdown.Toggle
        id='network-switch'
        variant='dark'
        className='btn-unstyled control'
        aria-haspopup='true'
        aria-controls='network-switch-menu'
        aria-label='Change Network'
      >
        <div className='value text-truncate'>{activeNetworkName}</div>
        <FontAwesomeIcon
          className='ms-auto indicator'
          icon={faAngleDown}
          size='lg'
        />
      </Dropdown.Toggle>

      <Dropdown.Menu
        id='network-switch-menu'
        role='menu'
        aria-labelledby='network-switch'
      >
        <CustomNetworkMenu>
          {links.length > 0 ? (
            <>
              {links.map((link) => (
                <a
                  key={link.id}
                  target='_blank'
                  rel='noreferrer nofollow noopener'
                  className={classNames('dropdown-item', {
                    active: activeNetworkId === link.id
                  })}
                  href={link.url}
                  role='menuitem'
                >
                  {link.name}
                </a>
              ))}
            </>
          ) : (
            <>
              {isSubSubdomain && window?.location?.hostname ? (
                <>
                  {networkLinks.map((link) => (
                    <a
                      key={link.id}
                      target='_blank'
                      rel='noreferrer nofollow noopener'
                      className={classNames('dropdown-item', {
                        active: activeNetworkId === link.id
                      })}
                      href={link.url}
                      role='menuitem'
                    >
                      {link.name}
                    </a>
                  ))}
                </>
              ) : (
                <>
                  {networkLinks.map((link) => (
                    <Dropdown.Item
                      as={Anchor} // This is needed due to issues between threejs, react-bootstrap and typescript, what a time to be alive: https://github.com/react-bootstrap/react-bootstrap/issues/6283
                      href={link.url}
                      key={link.url}
                      active={activeNetworkId === link.id}
                      role='menuitem'
                    >
                      {link.name}
                    </Dropdown.Item>
                  ))}
                </>
              )}
            </>
          )}
        </CustomNetworkMenu>
      </Dropdown.Menu>
    </Dropdown>
  );
};
