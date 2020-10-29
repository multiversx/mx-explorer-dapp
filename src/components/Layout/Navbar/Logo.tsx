import * as React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from 'context';
import { ReactComponent as ElrondLogo } from 'assets/images/logo.svg';
import { ReactComponent as ElrondSymbol } from 'assets/images/symbol.svg';

const Logo = () => {
  const { activeNetworkId } = useGlobalState();
  const title = activeNetworkId === 'mainnet' ? 'Explorer' : 'Testnet Explorer';

  return (
    <Link to="/" className="d-flex align-items-center navbar-brand mr-0 ml-3">
      <ElrondLogo
        className={`main-logo flex-shrink-0 ${
          activeNetworkId === 'mainnet' ? 'd-md-none d-xl-block' : 'd-none'
        }`}
      />
      <ElrondSymbol
        className={`main-symbol flex-shrink-0 ${
          activeNetworkId === 'mainnet' ? 'd-none d-md-block d-xl-none' : ''
        }`}
      />
      <span className="text-secondary text-truncate">{title}</span>
    </Link>
  );
};

export default Logo;
