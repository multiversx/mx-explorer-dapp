import * as React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from 'context';
import { ReactComponent as ElrondLogo } from 'assets/images/logo.svg';
import { ReactComponent as ElrondSymbol } from 'assets/images/symbol.svg';

const Logo = () => {
  const {
    activeNetwork: { id },
  } = useGlobalState();

  let networkLabel;
  switch (id) {
    case 'testnet':
      networkLabel = 'Testnet';
      break;
    case 'devnet':
      networkLabel = 'Devnet';
      break;
    default:
      networkLabel = '';
      break;
  }

  const title = `${networkLabel} Explorer`;

  return (
    <Link to="/" className="d-flex align-items-center navbar-brand mr-2 pr-1">
      <ElrondLogo
        className={`main-logo flex-shrink-0 ${id === 'mainnet' ? '' : 'd-none d-md-block'}`}
      />
      <ElrondSymbol
        className={`main-symbol flex-shrink-0 ${id === 'mainnet' ? 'd-none' : 'd-block d-md-none'}`}
      />
      <span className="text-secondary text-truncate">{title}</span>
    </Link>
  );
};

export default Logo;
