import * as React from 'react';
import { types, urlBuilder } from 'helpers';
import { adapter, NetworkLink } from 'sharedComponents';

import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons/faSpinnerThird';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TokenBlock = ({ identifier }: { identifier: string }) => {
  const ref = React.useRef(null);
  const { getToken } = adapter();
  const [tokenDetails, setTokenBlock] = React.useState<types.TokenType>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchTokenBlock = () => {
    getToken(identifier).then(({ success, data }) => {
      if (ref.current !== null) {
        setTokenBlock(data);
        setDataReady(success);
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchTokenBlock, [identifier]);

  return (
    <div ref={ref} className="d-inline-block ml-1">
      <NetworkLink
        to={urlBuilder.tokenDetails(identifier)}
        className={`d-flex ${tokenDetails?.assets?.svgUrl ? 'token-link' : ''}`}
      >
        <div className="d-flex align-items-center symbol">
          {dataReady === undefined && (
            <>
              <span className="mr-2">{identifier}</span>
              <FontAwesomeIcon
                icon={faSpinnerThird}
                size="xs"
                className="text-primary fa-spin fast-spin"
              />
            </>
          )}
          {dataReady === false && <span className="text-truncate">{identifier}</span>}
          {dataReady === true && tokenDetails && tokenDetails.assets ? (
            <>
              {tokenDetails.assets.svgUrl && (
                <img
                  src={tokenDetails.assets.svgUrl}
                  alt={tokenDetails.name}
                  className="token-icon mx-1"
                />
              )}
              <div>{tokenDetails.name}</div>
            </>
          ) : (
            <span className="text-truncate">{identifier}</span>
          )}
        </div>
      </NetworkLink>
    </div>
  );
};

export default TokenBlock;
