import * as React from 'react';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons/faSpinnerThird';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { types, urlBuilder } from 'helpers';
import { adapter, NetworkLink } from 'sharedComponents';

interface NftBlockType {
  identifier: string;
  collection: string;
}

const NftBlock = (props: NftBlockType) => {
  const ref = React.useRef(null);
  const { getCollection } = adapter();
  const [nftCollectionDetails, setNftCollectionDetails] = React.useState<types.CollectionType>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchNftBlock = () => {
    getCollection(props.collection).then(({ success, data }) => {
      if (ref.current !== null) {
        setNftCollectionDetails(data);
        setDataReady(success);
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchNftBlock, [props.identifier]);

  return (
    <div ref={ref} className="d-flex">
      <NetworkLink
        to={urlBuilder.nftDetails(props.identifier)}
        className={`d-flex ${nftCollectionDetails?.assets?.svgUrl ? 'token-link' : ''}`}
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
          {dataReady === true && nftCollectionDetails && (
            <>
              {nftCollectionDetails.assets ? (
                <>
                  {nftCollectionDetails.assets.svgUrl && (
                    <img
                      src={nftCollectionDetails.assets.svgUrl}
                      alt={props.identifier}
                      className="token-icon mr-1"
                    />
                  )}
                  <div>{props.identifier}</div>
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

export default NftBlock;
