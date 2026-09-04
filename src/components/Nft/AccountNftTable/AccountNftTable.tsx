import {
  CollectionBlock,
  FormatAmount,
  NetworkLink,
  NftBadge
} from 'components';
import { isProof, urlBuilder } from 'helpers';
import { NftType, WithClassnameType } from 'types';

export interface AccountNftTableUIType extends WithClassnameType {
  nfts: NftType[];
}

export const AccountNftTable = ({ nfts }: AccountNftTableUIType) => {
  return (
    <div className='table-wrapper animated-list'>
      <table className='table mb-0'>
        <thead>
          <tr>
            <th>Identifier</th>
            <th>Name</th>
            <th>Collection</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody data-testid='accountNftsTable'>
          {nfts.map((nft, i) => (
            <tr key={`${nft.name}-${nft.identifier}`}>
              <td>
                <div className='d-flex align-items-center'>
                  <NetworkLink
                    to={urlBuilder.nftDetails(nft.identifier)}
                    data-testid={`accountNftsLink${i}`}
                    className={`d-flex text-truncate ${
                      nft.assets?.svgUrl ? 'side-link' : ''
                    }`}
                  >
                    <div className='d-flex align-items-center'>
                      {nft.assets?.svgUrl && (
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
                  <NftBadge
                    type={nft.type}
                    subType={nft.subType}
                    isProof={isProof(nft)}
                    className='ms-2'
                  />
                </div>
              </td>
              <td>
                {nft.scamInfo ? `[Hidden - ${nft.scamInfo.info}]` : nft.name}
              </td>
              <td>
                <CollectionBlock nft={nft} />
              </td>
              <td>
                {nft.balance !== undefined && (
                  <>
                    {nft.decimals ? (
                      <FormatAmount
                        showLabel={false}
                        showSymbol={false}
                        value={nft.balance ? nft.balance : '0'}
                        decimals={nft.decimals}
                      />
                    ) : (
                      Number(nft.balance).toLocaleString('en')
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
