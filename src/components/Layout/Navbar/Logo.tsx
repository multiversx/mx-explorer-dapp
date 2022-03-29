import * as React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from 'context';
import { NetworkIdType } from 'helpers/types';
import { ReactComponent as ElrondLogo } from 'assets/images/logo.svg';
import { ReactComponent as ElrondSymbol } from 'assets/images/symbol.svg';

const Logo = () => {
  const {
    activeNetwork: { id },
    config: { elrondApps },
  } = useGlobalState();

  const explorerApp = elrondApps.find((app) => app.id === 'explorer');
  const explorerTitle = explorerApp ? explorerApp.name : 'Explorer';

  return (
    <Link to="/" className="d-flex align-items-center navbar-brand mr-2 pr-1">
      <ElrondLogo
        className={`main-logo flex-shrink-0 ${
          id === NetworkIdType.mainnet ? '' : 'd-none d-md-block'
        }`}
      />
      <ElrondSymbol
        className={`main-symbol flex-shrink-0 ${
          id === NetworkIdType.mainnet ? 'd-none' : 'd-block d-md-none'
        }`}
      />
      <span className="text-secondary">{explorerTitle}</span>
    </Link>
  );
};

export default Logo;
