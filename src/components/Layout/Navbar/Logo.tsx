import * as React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from 'context';
import { ReactComponent as ElrondLogo } from 'assets/images/logo.svg';
import { ReactComponent as ElrondSymbol } from 'assets/images/symbol.svg';

const Logo = () => {
  const {
    activeNetwork: { id },
    config: { links },
  } = useGlobalState();

  let networkLabel = '';
  switch (true) {
    case id === 'testnet':
      networkLabel = 'Testnet';
      break;
    case id === 'devnet':
      networkLabel = 'Devnet';
      break;
    case links.length === 0:
      networkLabel = 'Internal';
      break;
  }

  return (
    <Link to="/" className="d-flex align-items-center navbar-brand mr-2 pr-1">
      <ElrondLogo
        className={`main-logo flex-shrink-0 ${id === 'mainnet' ? '' : 'd-none d-md-block'}`}
      />
      <ElrondSymbol
        className={`main-symbol flex-shrink-0 ${id === 'mainnet' ? 'd-none' : 'd-block d-md-none'}`}
      />
      <span className="text-secondary text-truncate">{networkLabel} Explorer</span>
    </Link>
  );
};

export default Logo;
