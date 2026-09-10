import { NetworkLink, AccountLink, NftBadge } from 'components';
import { urlBuilder, formatBigNumber } from 'helpers';
import { NftType, NftTypeEnum, WithClassnameType } from 'types';

export interface NftTableUIType extends WithClassnameType {
  nfts: NftType[];
  type: NftTypeEnum;
}

export const NftTable = ({ nfts, type }: NftTableUIType) => {
  return (
    <div className='table-wrapper animated-list'>
      <table className='table mb-0'>
        <thead>
          <tr>
            <th>Identifier</th>
            <th>Name</th>
            <th>Creator</th>
            <th>
              {type === NftTypeEnum.NonFungibleESDT && <>Owner</>}
              {type === NftTypeEnum.SemiFungibleESDT && <>Supply</>}
            </th>
          </tr>
        </thead>
        <tbody data-testid='nftsTable'>
          {nfts.map((nft, i) => (
            <tr key={`${nft.name}-${nft.identifier}`}>
              <td>
                <div className='d-flex align-items-center'>
                  <NetworkLink
                    to={urlBuilder.nftDetails(nft.identifier)}
                    data-testid={`nftsLink${i}`}
                    className={`d-flex text-truncate ${
                      nft.assets?.svgUrl ? 'side-link' : ''
                    }`}
                  >
                    <div className='d-flex align-items-center'>
                      {nft.assets && nft.assets.svgUrl && (
                        <img
                          src={nft.assets.svgUrl}
                          className='side-icon me-1'
                          alt=''
                          role='presentation'
                        />
                      )}
                      <div>{nft.identifier}</div>
                    </div>
                  </NetworkLink>
                  {type !== NftTypeEnum.MetaESDT && (
                    <NftBadge
                      type={nft.type}
                      subType={nft.subType}
                      className='ms-2'
                    />
                  )}
                </div>
              </td>
              <td>
                {nft.scamInfo ? `[Hidden - ${nft.scamInfo.info}]` : nft.name}
              </td>
              <td>
                <div className='d-flex trim-size-xl'>
                  <AccountLink address={nft.creator} />
                </div>
              </td>
              <td>
                {type === NftTypeEnum.NonFungibleESDT && nft?.owner && (
                  <div className='d-flex trim-size-xl'>
                    <AccountLink address={nft.owner} />
                  </div>
                )}
                {type === NftTypeEnum.SemiFungibleESDT && nft?.supply && (
                  <>{formatBigNumber({ value: nft.supply })}</>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
