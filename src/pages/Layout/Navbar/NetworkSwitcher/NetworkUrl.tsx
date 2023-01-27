import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { networks } from 'config';
import { networksSelector } from 'redux/selectors';
import { changeNetwork } from 'redux/slices';
import { NetworkUrlType } from 'types';

export interface NetworkUrlPropsType extends React.PropsWithChildren {
  link: NetworkUrlType;
  internal?: boolean;
}

const isDevelopment = process.env.NODE_ENV === 'development';

export const NetworkUrl = ({ internal = false, link }: NetworkUrlPropsType) => {
  const {
    activeNetwork,
    defaultNetwork: { id: defaultNetworkId }
  } = useSelector(networksSelector);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hidePopover = () => {
    document.body.click();
  };

  const swapNetwork = (networkId: string) => {
    hidePopover();

    if (activeNetwork.id !== networkId) {
      const foundNetwork = networks.find(({ id }) => id === networkId);

      if (foundNetwork) {
        dispatch(changeNetwork(foundNetwork));
        navigate(networkId !== defaultNetworkId ? `/${networkId}` : '/');
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDevelopment || internal) {
      e.preventDefault();
    }

    if (internal) {
      return swapNetwork(link.id);
    }

    hidePopover();
  };

  return (
    <a
      className={`dropdown-item ${
        activeNetwork.id === link.id ? 'active' : ''
      }`}
      key={link.id}
      href={
        internal ? `/${link.id !== defaultNetworkId ? link.id : ''}` : link.url
      }
      data-testid={link.id}
      onClick={handleClick}
      {...(internal ? {} : { target: '_blank' })}
      {...(internal ? {} : { rel: 'noreferrer nofollow' })}
    >
      {link.name}
    </a>
  );
};
