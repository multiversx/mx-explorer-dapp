import * as React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from 'context';
import { NetworkIdType } from 'helpers/types';
import { ReactComponent as MultiversXLogo } from 'assets/images/logo-full.svg';
import { ReactComponent as MultiversXLogoShort } from 'assets/images/logo-short.svg';

const Logo = () => {
  const {
    activeNetwork: { id },
  } = useGlobalState();

  return (
    <Link to="/" className="d-flex align-items-center navbar-brand mr-2 pr-1">
      <MultiversXLogo className="main-logo flex-shrink-0 d-none d-md-block" />
      <MultiversXLogoShort className="main-logo-short flex-shrink-0 d-block d-md-none" />
      {id !== NetworkIdType.mainnet && <span className="text-capitalize">{id}</span>}
    </Link>
  );
};

export default Logo;
