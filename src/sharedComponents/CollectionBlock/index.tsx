import * as React from 'react';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons/faSpinnerThird';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { types, urlBuilder } from 'helpers';
import { adapter, NetworkLink, Denominate } from 'sharedComponents';

interface CollectionBlockType {
  identifier: string;
  value?: string;
  showLastNonZeroDecimal?: boolean;
  showLabel?: boolean;
  token?: string | React.ReactNode;
  decimals?: number;
  denomination?: number;
  'data-testid'?: string;
}

const CollectionBlock = (props: CollectionBlockType) => {
  const ref = React.useRef(null);
  const { getCollection } = adapter();
  const [tokenDetails, setCollectionBlock] = React.useState<types.CollectionType>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchCollectionBlock = () => {
    getCollection(props.identifier).then(({ success, data }) => {
      if (ref.current !== null) {
        setCollectionBlock(data);
        setDataReady(success);
      }
    });
  };

  const denomination =
    dataReady === true && tokenDetails && tokenDetails.decimals ? tokenDetails.decimals : 1;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchCollectionBlock, [props.identifier]);

  return (
    <div ref={ref} className="d-flex">
      {props.value && (
        <div className="mr-1">
          <Denominate
            {...props}
            value={props.value}
            showLabel={false}
            denomination={denomination}
          />
        </div>
      )}
      <NetworkLink
        to={urlBuilder.collectionDetails(props.identifier)}
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

export default CollectionBlock;
