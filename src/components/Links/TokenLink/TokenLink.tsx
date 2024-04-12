import { NetworkLink, Overlay } from 'components';
import { urlBuilder } from 'helpers';
import { TokenType, TokenTypeEnum } from 'types';

export const TokenLink = ({ token }: { token: TokenType }) => {
  const identifierArray = token.identifier ? token.identifier.split('-') : [];
  if (identifierArray.length > 2 && token.type === TokenTypeEnum.MetaESDT) {
    identifierArray.pop();
  }
  const detailsIdentifier = identifierArray.join('-');
  const networkLink =
    token.type === TokenTypeEnum.MetaESDT
      ? urlBuilder.tokenMetaEsdtDetails(detailsIdentifier)
      : urlBuilder.tokenDetails(token.identifier);

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
