import * as React from 'react';
import { faClock, faTrophy } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';

import {
  Loader,
  DetailItem,
  Trim,
  NetworkLink,
  NftBadge,
  CollectionBlock,
  Denominate,
  TimeAgo,
  ScAddressIcon,
  Pager,
  CardItem
} from 'components';
import { urlBuilder, dateFormatted } from 'helpers';
import { useAdapter, useGetFilters, useURLSearchParams } from 'hooks';
import { NftType, NftEnumType } from 'types';

import { FailedNftDetails } from './FailedNftDetails';
import { NftPreview } from './NftPreview';

interface NftAccountType {
  address: string;
  balance: string;
}

export const nftText = (type: NftType['type']) => {
  switch (type) {
    case NftEnumType.SemiFungibleESDT:
      return 'SFT';
    case NftEnumType.NonFungibleESDT:
      return 'NFT';
    case NftEnumType.MetaESDT:
      return 'Meta-ESDT';
    default:
      return '';
  }
};

export const NftDetails = () => {
  const params: any = useParams();
  const { hash: identifier } = params;
  const ref = React.useRef(null);
  const { page } = useURLSearchParams();
  const { getQueryObject, size } = useGetFilters();
  const { getNft, getNftAccounts, getNftAccountsCount } = useAdapter();
  const [nftDetails, setNftDetails] = React.useState<NftType>();
  const [nftAccounts, setNftAccounts] = React.useState<NftAccountType[]>([]);
  const [nftAccountsCount, setNftAccountsCount] = React.useState<
    number | '...'
  >('...');
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [showData, setShowData] = React.useState(false);

  const show = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowData((existing) => !existing);
  };

  const fetchNftDetails = () => {
    const queryObject = getQueryObject();
    Promise.all([
      getNft(identifier),
      getNftAccounts({ ...queryObject, size, identifier }),
      getNftAccountsCount({ ...queryObject, identifier })
    ]).then(([nftData, nftAccounts, nftAccountsCount]) => {
      if (ref.current !== null) {
        if (nftData.success) {
          setNftDetails(nftData.data);
          document.title = `${nftText(nftData.data.type)} Details`;
        }
        if (nftAccounts.success && nftAccountsCount.success) {
          setNftAccounts(nftAccounts.data);
          setNftAccountsCount(Math.min(nftAccountsCount.data, 10000));
        }
        setDataReady(nftData.success);
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchNftDetails, [identifier]); // run the operation only once since the parameter does not change

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && <FailedNftDetails identifier={identifier} />}

      <div ref={ref}>
        {dataReady === true && nftDetails && (
          <div className='container page-content'>
            <div className='row'>
              <div className='col-12'>
                <div className='card'>
                  <div className='card-header'>
                    <div className='card-header-item d-flex align-items-center'>
                      <h5
                        data-testid='title'
                        className='mb-0 d-flex align-items-center'
                      >
                        {nftText(nftDetails.type)} Details
                      </h5>
                    </div>
                  </div>
                  <div className='card-body'>
                    <DetailItem title='Name'>
                      {nftDetails.scamInfo
                        ? showData
                          ? nftDetails.name
                          : `[Hidden - ${nftDetails.scamInfo.info}]`
                        : nftDetails.name}
                    </DetailItem>
                    <DetailItem title='Identifier'>
                      {nftDetails.identifier}
                    </DetailItem>
                    {nftDetails.ticker !== undefined &&
                      nftDetails.ticker !== nftDetails.collection &&
                      nftDetails.type === 'MetaESDT' && (
                        <DetailItem title='Ticker'>
                          {nftDetails.ticker}
                        </DetailItem>
                      )}
                    {nftDetails.nonce && (
                      <DetailItem title='Nonce'>{nftDetails.nonce}</DetailItem>
                    )}
                    <DetailItem title='Type'>
                      <NftBadge type={nftDetails.type} />
                    </DetailItem>
                    <DetailItem title='Collection'>
                      <CollectionBlock nft={nftDetails} />
                    </DetailItem>
                    {nftDetails.owner !== undefined && (
                      <DetailItem title='Owner'>
                        <div className='d-flex'>
                          <NetworkLink
                            to={urlBuilder.accountDetails(nftDetails.owner)}
                            className='trim-wrapper'
                          >
                            <Trim text={nftDetails.owner} />
                          </NetworkLink>
                        </div>
                      </DetailItem>
                    )}
                    <DetailItem title='Creator'>
                      <div className='d-flex'>
                        <NetworkLink
                          to={urlBuilder.accountDetails(nftDetails.creator)}
                          className='trim-wrapper'
                        >
                          <Trim text={nftDetails.creator} />
                        </NetworkLink>
                      </div>
                    </DetailItem>
                    {nftDetails.timestamp !== undefined && (
                      <DetailItem title='Minted'>
                        <FontAwesomeIcon
                          icon={faClock}
                          className='me-2 text-neutral-400'
                        />
                        <TimeAgo value={nftDetails.timestamp} />
                        &nbsp;
                        <span className='text-neutral-400'>
                          ({dateFormatted(nftDetails.timestamp, false, true)})
                        </span>
                      </DetailItem>
                    )}
                    {nftDetails.royalties !== undefined &&
                      nftDetails.royalties !== null && (
                        <DetailItem title='Royalties'>
                          {nftDetails.royalties}%
                        </DetailItem>
                      )}
                    {nftDetails.supply !== undefined &&
                      nftDetails.type !== 'NonFungibleESDT' && (
                        <DetailItem title='Supply'>
                          {nftDetails.decimals ? (
                            <Denominate
                              value={nftDetails.supply}
                              showLabel={false}
                              denomination={nftDetails.decimals}
                            />
                          ) : (
                            Number(nftDetails.supply).toLocaleString('en')
                          )}
                        </DetailItem>
                      )}
                    {nftDetails.decimals !== undefined && (
                      <DetailItem title='Decimals'>
                        {nftDetails.decimals}
                      </DetailItem>
                    )}
                    {nftDetails.uris !== undefined && nftDetails.uris[0] && (
                      <DetailItem title='Assets'>
                        {nftDetails.scamInfo ? (
                          showData ? (
                            <NftPreview token={nftDetails} />
                          ) : (
                            `[Hidden - ${nftDetails.scamInfo.info}]`
                          )
                        ) : (
                          <NftPreview token={nftDetails} />
                        )}
                      </DetailItem>
                    )}
                    {nftDetails.tags !== undefined &&
                      nftDetails.tags.length > 0 && (
                        <DetailItem title='Tags'>
                          {nftDetails.tags.map((tag) => (
                            <div
                              key={tag}
                              className='badge badge-light p-2 me-2 font-weight-normal'
                            >
                              #{tag}
                            </div>
                          ))}
                        </DetailItem>
                      )}
                    {nftDetails.scamInfo && (
                      <DetailItem title=''>
                        <a
                          href='/#'
                          onClick={show}
                          className='small-font text-neutral-400'
                        >
                          {!showData ? 'Show' : 'Hide'} original content
                        </a>
                      </DetailItem>
                    )}
                    {nftDetails?.rarities &&
                      Object.keys(nftDetails.rarities).length > 0 && (
                        <DetailItem title='Rarities'>
                          <div className='card-item-container my-n2'>
                            {nftDetails?.rarities?.openRarity?.rank && (
                              <CardItem
                                title='Open Rarity Rank'
                                icon={faTrophy}
                                className='nft-card-item'
                              >
                                {nftDetails.rarities.openRarity.rank}
                              </CardItem>
                            )}
                            {nftDetails?.rarities?.statistical?.rank && (
                              <CardItem
                                title='Statistical Rank'
                                icon={faTrophy}
                                className='nft-card-item'
                              >
                                {nftDetails.rarities.statistical.rank}
                              </CardItem>
                            )}
                            {nftDetails?.rarities?.jaccardDistances?.rank && (
                              <CardItem
                                title='Jaccard Distances Rank'
                                icon={faTrophy}
                                className='nft-card-item'
                              >
                                {nftDetails.rarities.jaccardDistances.rank}
                              </CardItem>
                            )}
                            {nftDetails?.rarities?.trait?.rank && (
                              <CardItem
                                title='Trait Rank'
                                icon={faTrophy}
                                className='nft-card-item'
                              >
                                {nftDetails.rarities.trait.rank}
                              </CardItem>
                            )}
                          </div>
                        </DetailItem>
                      )}
                    {nftDetails?.metadata?.attributes && (
                      <DetailItem title='Attributes'>
                        <div className='attributes-holder'>
                          {nftDetails.metadata.attributes.map(
                            ({ value, trait_type }) => (
                              <div
                                className='attribute'
                                key={`${trait_type}-${value}`}
                              >
                                <p className='trait' title={trait_type}>
                                  {trait_type}
                                </p>
                                <p className='value' title={value}>
                                  {value}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </DetailItem>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {nftAccounts &&
              nftAccounts.length > 0 &&
              nftDetails.type !== 'NonFungibleESDT' && (
                <div className='row mt-spacer'>
                  <div className='col-12'>
                    <div className='card'>
                      <div className='card-header'>
                        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
                          <h5
                            data-testid='title'
                            className='table-title mb-0 d-flex align-items-center'
                          >
                            Owners
                          </h5>
                          <Pager
                            page={String(page)}
                            total={nftAccountsCount}
                            itemsPerPage={25}
                            show={nftAccounts.length > 0}
                            className='d-flex ms-auto me-auto me-sm-0'
                          />
                        </div>
                      </div>
                      <div className='card-body'>
                        <div className='table-wrapper animated-list'>
                          <table className='table mb-0'>
                            <thead>
                              <tr>
                                <th>Address</th>
                                <th>Balance</th>
                              </tr>
                            </thead>
                            <tbody data-testid='accountsTable'>
                              {nftAccounts.map((account, i) => (
                                <tr key={account.address}>
                                  <td>
                                    <div className='d-flex align-items-center'>
                                      <ScAddressIcon
                                        initiator={account.address}
                                      />
                                      <NetworkLink
                                        to={urlBuilder.accountDetails(
                                          account.address
                                        )}
                                        className='trim-only-sm'
                                      >
                                        <Trim
                                          text={account.address}
                                          dataTestId={`accountLink${i}`}
                                        />
                                      </NetworkLink>
                                    </div>
                                  </td>
                                  <td>
                                    {nftDetails.decimals ? (
                                      <Denominate
                                        value={account.balance}
                                        showLabel={false}
                                        denomination={nftDetails.decimals}
                                      />
                                    ) : (
                                      Number(account.balance).toLocaleString(
                                        'en'
                                      )
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
                        <Pager
                          page={String(page)}
                          total={nftAccountsCount}
                          itemsPerPage={25}
                          show={nftAccounts.length > 0}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </>
  );
};
