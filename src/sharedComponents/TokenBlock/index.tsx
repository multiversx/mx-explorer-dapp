import * as React from 'react';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons/faSpinnerThird';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { types, urlBuilder } from 'helpers';
import { adapter, NetworkLink, Denominate } from 'sharedComponents';
import { denomination as configDenomination } from 'appConfig';
import { DenominateType } from 'sharedComponents/Denominate';

interface TokenBlockType extends DenominateType {
  identifier: string;
}

const TokenBlock = (props: TokenBlockType) => {
  const ref = React.useRef(null);
  const { getToken } = adapter();
  const [tokenDetails, setTokenBlock] = React.useState<types.TokenType>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchTokenBlock = () => {
    getToken(props.identifier).then(({ success, data }) => {
      if (ref.current !== null) {
        setTokenBlock(data);
        setDataReady(success);
      }
    });
  };

  const denomination =
    dataReady === true && tokenDetails && tokenDetails.decimals
      ? tokenDetails.decimals
      : configDenomination;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchTokenBlock, [props.identifier]);

  return (
    <div ref={ref} className="d-flex">
      {props.value && (
        <div className="mr-1">
          <Denominate {...props} denomination={denomination} showLabel={false} />
        </div>
      )}
      <NetworkLink
        to={urlBuilder.tokenDetails(props.identifier)}
        className={`d-flex ${tokenDetails?.assets?.svgUrl ? 'token-link' : ''}`}
      >
        <div className="d-flex align-items-center symbol">
          {dataReady === undefined && (
            <>
              <span className="mr-2">{props.identifier}</span>
              <FontAwesomeIcon
                icon={faSpinnerThird}
                size="xs"
                className="text-primary fa-spin fast-spin"
              />
            </>
          )}
          {dataReady === false && <span className="text-truncate">{props.identifier}</span>}
          {dataReady === true && tokenDetails && (
            <>
              {tokenDetails.assets ? (
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
                <span className="text-truncate">{props.identifier}</span>
              )}
            </>
          )}
        </div>
      </NetworkLink>
    </div>
  );
};

export default TokenBlock;
