import * as React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from 'context';
import { NetworkIdType } from 'helpers/types';
import { ReactComponent as MultiversXLogo } from 'assets/images/logo.svg';
import { ReactComponent as MultiverxXSymbol } from 'assets/images/symbol.svg';

const Logo = () => {
  const {
    activeNetwork: { id },
    config: { multiversXApps },
  } = useGlobalState();

  const explorerApp = multiversXApps.find((app) => app.id === 'explorer');
  const explorerTitle = explorerApp ? explorerApp.name : 'Explorer';

  return (
    <Link to="/" className="d-flex align-items-center navbar-brand mr-2 pr-1">
      <MultiversXLogo
        className={`main-logo flex-shrink-0 ${
          id === NetworkIdType.mainnet ? '' : 'd-none d-md-block'
        }`}
      />
      <MultiverxXSymbol
        className={`main-symbol flex-shrink-0 ${
          id === NetworkIdType.mainnet ? 'd-none' : 'd-block d-md-none'
        }`}
      />
      <span className="text-secondary">{explorerTitle}</span>
    </Link>
  );
};

export default Logo;
