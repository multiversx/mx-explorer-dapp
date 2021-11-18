import * as React from 'react';
import { types, urlBuilder } from 'helpers';
import { adapter, NetworkLink, Denominate } from 'sharedComponents';

interface NftBlockType {
  identifier: string;
  value?: string;
  showLastNonZeroDecimal?: boolean;
  showLabel?: boolean;
  token?: string | React.ReactNode;
  decimals?: number;
  denomination?: number;
  'data-testid'?: string;
}

const NftBlock = (props: NftBlockType) => {
  const ref = React.useRef(null);
  const { getNft } = adapter();
  const [nftDetails, setNftDetails] = React.useState<types.NftType>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchNftBlock = () => {
    getNft(props.identifier).then((nftData) => {
      if (ref.current !== null) {
        if (nftData.success) {
          setNftDetails(nftData.data);
        }
        setDataReady(nftData.success);
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchNftBlock, [props.identifier]);

  return (
    <div ref={ref} className="d-flex text-truncate">
      {dataReady === undefined && <span className="text-truncate">{props.identifier}</span>}
      {dataReady === false && <span className="text-truncate">{props.identifier}</span>}
      {dataReady === true && nftDetails && (
        <>
          {props.value && nftDetails.type !== 'NonFungibleESDT' && (
            <>
              <div className="mr-2">Value</div>
              <div className="mr-1">
                {nftDetails.decimals ? (
                  <Denominate
                    value={props.value}
                    showLabel={false}
                    denomination={nftDetails.decimals}
                  />
                ) : (
                  Number(props.value).toLocaleString('en')
                )}
              </div>
            </>
          )}
          <NetworkLink
            to={urlBuilder.nftDetails(props.identifier)}
            className={`d-flex text-truncate ${nftDetails?.assets?.svgUrl ? 'token-link' : ''}`}
          >
            <div className="d-flex align-items-center symbol text-truncate">
              {nftDetails.assets ? (
                <>
                  {nftDetails.assets.svgUrl && (
                    <img
                      src={nftDetails.assets.svgUrl}
                      alt={nftDetails.name}
                      className="token-icon mr-1"
                    />
                  )}
                  <div className="text-truncate">
                    {nftDetails.name} ({nftDetails.identifier})
                  </div>
                </>
              ) : (
                <span className="text-truncate">{props.identifier}</span>
              )}
            </div>
          </NetworkLink>
        </>
      )}
    </div>
  );
};

export default NftBlock;
