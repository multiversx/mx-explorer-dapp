import * as React from 'react';
import { Link } from 'react-router-dom';

import { NetworkIdType } from 'types';
import { ReactComponent as MultiversXLogo } from 'assets/img/logo-full.svg';
import { ReactComponent as MultiversXSymbol } from 'assets/img/symbol.svg';

import { useSelector } from 'react-redux';
import { activeNetworkSelector } from 'redux/selectors';

export const Logo = () => {
  const { id: activeNetworkId, name } = useSelector(activeNetworkSelector);

  return (
    <Link to="/" className="d-flex align-items-center navbar-brand mr-2 pr-1">
      {activeNetworkId !== NetworkIdType.mainnet ? (
        <>
          <MultiversXSymbol className="main-symbol flex-shrink-0" />
          <span className="text-capitalize text-truncate">{name} Explorer</span>
        </>
      ) : (
        <MultiversXLogo className="main-logo flex-shrink-0" />
      )}
    </Link>
  );
};
