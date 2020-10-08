import * as React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as ElrondLogo } from 'assets/img/logo.svg';
import { ReactComponent as ElrondSymbol } from 'assets/img/symbol.svg';

const Logo = () => {
  return (
    <Link to="/" className="d-flex align-items-center navbar-brand mr-0 ml-3">
      <ElrondSymbol className="main-symbol d-sm-none" />
      <ElrondLogo className="main-logo d-none d-sm-block" />
      <span className="text-secondary text-truncate">Explorer</span>
    </Link>
  );
};

export default Logo;
