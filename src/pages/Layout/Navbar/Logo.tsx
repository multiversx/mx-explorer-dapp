import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ReactComponent as MultiversXLogo } from 'assets/img/logo-full.svg';
import { ReactComponent as MultiversXSymbol } from 'assets/img/symbol.svg';

import { activeNetworkSelector } from 'redux/selectors';
import { NetworkIdType } from 'types';

export const Logo = () => {
  const { id: activeNetworkId, name } = useSelector(activeNetworkSelector);

  return (
    <Link to='/' className='d-flex align-items-center navbar-brand me-2 pe-1'>
      {activeNetworkId !== NetworkIdType.mainnet ? (
        <>
          <MultiversXSymbol className='main-symbol flex-shrink-0' />
          <span className='text-capitalize text-truncate'>{name} Explorer</span>
        </>
      ) : (
        <MultiversXLogo className='main-logo flex-shrink-0' />
      )}
    </Link>
  );
};
