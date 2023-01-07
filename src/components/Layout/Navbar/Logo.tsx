import * as React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from 'context';
import { NetworkIdType } from 'helpers/types';
import { ReactComponent as MultiversXLogo } from 'assets/images/logo-full.svg';
import { ReactComponent as MultiversXSymbol } from 'assets/images/symbol.svg';

const Logo = () => {
  const {
    activeNetwork: { id },
  } = useGlobalState();

  return (
    <Link to="/" className="d-flex align-items-center navbar-brand mr-2 pr-1">
      {id !== NetworkIdType.mainnet ? (
        <>
          <MultiversXSymbol className="main-symbol flex-shrink-0" />
          <span className="text-capitalize text-truncate">{id} Explorer</span>
        </>
      ) : (
        <MultiversXLogo className="main-logo flex-shrink-0" />
      )}
    </Link>
  );
};

export default Logo;
