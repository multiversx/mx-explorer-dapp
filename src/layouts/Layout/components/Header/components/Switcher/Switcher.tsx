import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Anchor, Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { CustomNetworkMenu } from 'components';
import { networks, links, hasExtraNetworks } from 'config';
import { getSubdomainNetwork } from 'helpers';
import { useGetNetworkChangeLink } from 'hooks';
import { faAngleDown } from 'icons/solid';
import { activeNetworkSelector } from 'redux/selectors';

export const Switcher = () => {
  const { id: activeNetworkId, name: activeNetworkName } = useSelector(
    activeNetworkSelector
  );
  const { isSubSubdomain } = getSubdomainNetwork();
  const getNetworkChangeLink = useGetNetworkChangeLink();

  const networkLinks = useMemo(() => {
    return networks
      .filter((network) => !network.isCustom)
      .map(({ name, id }) => {
        const url = getNetworkChangeLink({ networkId: id });
        return {
          name,
          url,
          id
        };
      });
  }, [networks]);

  const LinksList = () => {
    return (
      <div className='network-list'>
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
      </div>
    );
  };

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
        <div className='network-switch-list'>
          {hasExtraNetworks ? (
            <CustomNetworkMenu>
              <LinksList />
            </CustomNetworkMenu>
          ) : (
            <LinksList />
          )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};
