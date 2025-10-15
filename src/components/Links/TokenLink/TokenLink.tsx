import classNames from 'classnames';
import { useSelector } from 'react-redux';

import {
  NATIVE_TOKEN_IDENTIFIER,
  NATIVE_TOKEN_SEARCH_LABEL
} from 'appConstants';
import { NativeTokenSymbol, NetworkLink, Overlay } from 'components';
import { urlBuilder, isEgldToken, isProof } from 'helpers';
import { activeNetworkSelector } from 'redux/selectors';
import { TokenType, TokenTypeEnum } from 'types';

export const TokenLink = ({ token }: { token: TokenType }) => {
  const isNftProof = isProof(token);

  const { egldLabel = '' } = useSelector(activeNetworkSelector);

  const identifierArray = token.identifier ? token.identifier.split('-') : [];
  if (identifierArray.length > 2 && token.type === TokenTypeEnum.MetaESDT) {
    identifierArray.pop();
  }
  const detailsIdentifier = identifierArray.join('-');

  const metaDetails = isNftProof
    ? urlBuilder.proofDetails(token.identifier)
    : urlBuilder.tokenMetaEsdtDetails(detailsIdentifier);

  const networkLink =
    token.type === TokenTypeEnum.MetaESDT
      ? metaDetails
      : urlBuilder.tokenDetails(token.identifier);

  if (token.identifier === NATIVE_TOKEN_IDENTIFIER) {
    const isEgldNetworkToken = isEgldToken(egldLabel);

    if (isEgldNetworkToken) {
      const defaultCoinLink = `/${egldLabel.toLowerCase()}`;
      return (
        <NetworkLink to={defaultCoinLink} className='d-flex text-truncate'>
          <span className='fam'></span>
          <NativeTokenSymbol
            className={classNames('sym', { custom: !isEgldNetworkToken })}
          />
          <sup className='suf opc'></sup>
        </NetworkLink>
      );
    }

    return (
      <span className='d-flex align-items-center text-truncate'>
        <div className='text-truncate'>{NATIVE_TOKEN_SEARCH_LABEL}</div>
      </span>
    );
  }

  const TokenComponent = () => (
    <span className='d-flex align-items-center gap-1 text-truncate'>
      {(token.assets?.svgUrl || token.assets?.pngUrl) && (
        <img
          src={token.assets?.svgUrl || token.assets?.pngUrl}
          alt={token.identifier}
          className='side-icon'
        />
      )}
      <div className='text-truncate'>{token?.ticker ?? token.name}</div>
    </span>
  );

  return (
    <NetworkLink
      to={networkLink}
      className={`d-flex text-truncate ${
        token.assets?.svgUrl || token.assets?.pngUrl ? 'side-link' : ''
      }`}
    >
      <div className='d-flex align-items-center symbol text-truncate'>
        {token?.assets ? (
          <>
            {token.type === TokenTypeEnum.MetaESDT &&
            detailsIdentifier !== token.identifier ? (
              <Overlay title={token.identifier} truncate>
                <TokenComponent />
              </Overlay>
            ) : (
              <TokenComponent />
            )}
          </>
        ) : (
          <span className='text-truncate'>{token.identifier}</span>
        )}
      </div>
    </NetworkLink>
  );
};
