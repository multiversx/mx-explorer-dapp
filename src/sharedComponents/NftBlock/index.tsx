import * as React from 'react';
import { types, urlBuilder } from 'helpers';
import { adapter, NetworkLink, Denominate } from 'sharedComponents';

interface NftBlockType {
  identifier: string;
  collection: string;
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

  const denomination =
    dataReady === true && nftDetails && nftDetails.decimals ? nftDetails.decimals : 1;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchNftBlock, [props.identifier]);

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
        to={urlBuilder.nftDetails(props.identifier)}
        className={`d-flex ${nftDetails?.assets?.svgUrl ? 'token-link' : ''}`}
      >
        <div className="d-flex align-items-center symbol">
          {dataReady === undefined && <span>{props.identifier}</span>}
          {dataReady === false && <span className="text-truncate">{props.identifier}</span>}
          {dataReady === true && nftDetails && (
            <>
              {nftDetails.assets ? (
                <>
                  {nftDetails.assets.svgUrl && (
                    <img
                      src={nftDetails.assets.svgUrl}
                      alt={nftDetails.name}
                      className="token-icon mr-1"
                    />
                  )}
                  <div>
                    {nftDetails.ticker ? nftDetails.ticker : nftDetails.name} (
                    {nftDetails.identifier})
                  </div>
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
