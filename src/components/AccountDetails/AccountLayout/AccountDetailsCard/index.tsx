import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';
import { faDollarSign, faUser, faCoins, faLayerGroup } from '@fortawesome/pro-solid-svg-icons';
import {
  CardItem,
  CopyButton,
  Denominate,
  NetworkLink,
  adapter,
  ShardSpan,
  ScAddressIcon,
  Trim,
  TimeAgo,
  PropertyPill,
  SmallDetailItem,
  UsdValue,
} from 'sharedComponents';
import { useGlobalState } from 'context';
import { isContract, urlBuilder, dateFormatted, formatHerotag } from 'helpers';
import { ReactComponent as ElrondSymbol } from 'assets/images/elrond-symbol-chart.svg';

const AccountDetailsCard = () => {
  const ref = React.useRef(null);
  const {
    activeNetwork: { id, adapter: networkAdapter },
    accountDetails,
  } = useGlobalState();
  const { getProvider, getAccountTokensCount, getAccountNftsCount } = adapter();
  const {
    address,
    balance,
    nonce,
    shard,
    ownerAddress,
    developerReward,
    deployedAt,
    scamInfo,
    isUpgradeable,
    isReadable,
    isPayable,
    isPayableBySmartContract,
    assets,
    username,
  } = accountDetails;
  const [accountTokensCount, setAccountTokensCount] = React.useState<number>();

  const tokensActive = networkAdapter === 'api';
  const cardItemClass = tokensActive ? 'n5' : '';

  const [isProvider, setIsProvider] = React.useState(false);
  const fetchProviderDetails = () => {
    if (isContract(address)) {
      getProvider({ address }).then(({ success, data }) => {
        if (ref.current !== null) {
          if (success && data !== undefined) {
            setIsProvider(true);
          }
        }
      });
    }
  };

  React.useEffect(() => {
    fetchProviderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, address]);

  const fetchAccountTokensCount = () => {
    if (tokensActive) {
      const type = 'MetaESDT';
      Promise.all([getAccountTokensCount(address), getAccountNftsCount({ address, type })]).then(
        ([accountTokensCountData, accountNftsCountData]) => {
          if (ref.current !== null) {
            if (accountTokensCountData.success && accountNftsCountData.success) {
              const accountTokens =
                typeof accountTokensCountData.data === 'number' ? accountTokensCountData.data : 0;
              const accountMetaTokens =
                typeof accountNftsCountData.data === 'number' ? accountNftsCountData.data : 0;

              setAccountTokensCount(accountTokens + accountMetaTokens);
            }
          }
        }
      );
    }
  };
  React.useEffect(() => {
    fetchAccountTokensCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountDetails.txCount, id, address]);

  const dynamicIconColor = assets?.iconSvg && assets.iconSvg.includes('elrond.svg');

  return address !== '' ? (
    <div ref={ref} className="row account-details-card mb-spacer">
      {isContract(address) ? (
        <>
          <div className="col-12 col-lg-6 mb-spacer mb-lg-0">
            <div className="card">
              <div className={`card-header ${scamInfo ? 'status-text-warning' : ''}`}>
                <div className="card-header-item d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center w-100">
                    <span className="mr-2 h6 mb-0" data-testid="title">
                      Contract Details
                    </span>
                    {scamInfo && (
                      <span className="text-warning d-flex align-items-center ml-2">
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          size="sm"
                          className="text-warning mr-2"
                        />
                        {scamInfo.info}
                      </span>
                    )}
                  </div>
                  {isProvider && (
                    <NetworkLink
                      to={urlBuilder.providerDetails(accountDetails.address)}
                      className="btn btn-sm btn-primary-light"
                    >
                      Provider Details
                    </NetworkLink>
                  )}
                </div>
              </div>
              <div className="card-body p-0">
                <div className="container-fluid">
                  <SmallDetailItem title="Address">
                    <div className="d-flex align-items-center">
                      <ScAddressIcon initiator={address} />
                      <Trim text={address} />
                      <CopyButton text={address} />
                    </div>
                  </SmallDetailItem>

                  {assets?.name && (
                    <SmallDetailItem title="Name">
                      <div className="d-flex align-items-center">
                        {assets?.iconSvg && (
                          <div className="side-icon mr-1">
                            <img
                              src={assets?.iconSvg}
                              alt=" "
                              className={dynamicIconColor ? 'icon-elrond' : ''}
                            />
                          </div>
                        )}
                        <div>{assets.name}</div>
                      </div>
                    </SmallDetailItem>
                  )}

                  <SmallDetailItem title="Balance">
                    <div className="d-flex align-items-center">
                      {balance !== '...' ? <Denominate value={balance} decimals={4} /> : balance}
                    </div>
                  </SmallDetailItem>

                  <SmallDetailItem title="Value">
                    <UsdValue input={balance} />
                  </SmallDetailItem>

                  <SmallDetailItem title="Properties">
                    <div className="d-flex alig-items-center flex-wrap">
                      <PropertyPill name={'Upgradeable'} active={Boolean(isUpgradeable)} />
                      <PropertyPill name={'Readable'} active={Boolean(isReadable)} />
                      <PropertyPill name={'Payable'} active={Boolean(isPayable)} />
                      <PropertyPill
                        name={'Payable by Smart Contract'}
                        active={Boolean(isPayableBySmartContract)}
                      />
                    </div>
                  </SmallDetailItem>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="card">
              <div className="card-header">
                <div className="card-header-item d-flex align-items-center">
                  <span className="h6 mb-0" data-testid="overview">
                    Overview
                  </span>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="container-fluid">
                  <SmallDetailItem title="Shard">
                    {shard !== undefined ? (
                      <NetworkLink to={urlBuilder.shard(shard)} data-testid="shardLink">
                        <ShardSpan shard={shard} />
                      </NetworkLink>
                    ) : (
                      <span className="text-secondary">N/A</span>
                    )}
                  </SmallDetailItem>

                  <SmallDetailItem title="Rewards">
                    {developerReward !== undefined ? (
                      <Denominate value={developerReward} decimals={4} />
                    ) : (
                      <span className="text-secondary">N/A</span>
                    )}
                  </SmallDetailItem>

                  <SmallDetailItem title="Owner">
                    {ownerAddress !== undefined ? (
                      <div className="d-flex align-items-center">
                        <ScAddressIcon initiator={ownerAddress} />
                        {ownerAddress !== address ? (
                          <NetworkLink
                            to={urlBuilder.accountDetails(ownerAddress)}
                            data-testid="ownerLink"
                            className="trim-wrapper"
                          >
                            <Trim text={ownerAddress} />
                          </NetworkLink>
                        ) : (
                          <Trim text={ownerAddress} />
                        )}
                        <CopyButton text={ownerAddress} />
                      </div>
                    ) : (
                      <span className="text-secondary">N/A</span>
                    )}
                  </SmallDetailItem>

                  <SmallDetailItem title="Deployed">
                    {deployedAt !== undefined ? (
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faClock} className="mr-2 text-secondary" />
                        <TimeAgo value={deployedAt} /> ago &nbsp;
                        <span className="text-secondary">
                          ({dateFormatted(deployedAt, false, true)})
                        </span>
                      </div>
                    ) : (
                      <span className="text-secondary">N/A</span>
                    )}
                  </SmallDetailItem>

                  {assets?.description && (
                    <SmallDetailItem title="Description">
                      <span className="account-description" title={assets.description}>
                        {assets.description}
                      </span>
                    </SmallDetailItem>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="col mb-spacer">
          <div className="card">
            <div className={`card-header ${scamInfo ? 'status-text-warning' : ''}`}>
              <div className="card-header-item">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center w-100">
                    <span className="mr-2 h6 mb-0" data-testid="title">
                      <div className="d-flex align-items-center">
                        {assets?.iconSvg && (
                          <div className="side-icon mr-1">
                            <img
                              src={assets?.iconSvg}
                              alt=" "
                              className={dynamicIconColor ? 'icon-elrond' : ''}
                            />
                          </div>
                        )}
                        <div>{assets?.name ?? 'Address Details'}</div>
                      </div>
                    </span>
                    {scamInfo && (
                      <span className="text-warning d-flex align-items-center ml-2">
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          size="sm"
                          className="text-warning mr-2"
                        />
                        {scamInfo.info}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="card-header-item compact d-flex">
                <span className="text-secondary">Address:</span>
                <div className="d-flex align-items-center text-break-all ml-2">
                  <span data-testid="address">{address}</span>
                  <CopyButton text={address} />
                </div>
              </div>
              {username && (
                <div className="card-header-item compact d-flex">
                  <span className="text-secondary">Maiar Herotag:</span>
                  <div className="d-flex align-items-center text-break-all ml-2">
                    <span data-testid="address">{formatHerotag(username)}</span>
                    <CopyButton text={formatHerotag(username)} />
                  </div>
                </div>
              )}
            </div>
            <div className="card-body card-item-container mx-spacing">
              <CardItem className={cardItemClass} title="Balance" customIcon={<ElrondSymbol />}>
                <div className="d-flex align-items-center">
                  {balance !== '...' ? <Denominate value={balance} decimals={4} /> : balance}
                </div>
              </CardItem>
              <CardItem className={cardItemClass} title="Value" icon={faDollarSign}>
                <UsdValue input={balance} />
              </CardItem>
              <CardItem className={cardItemClass} title="Nonce" icon={faUser}>
                {nonce !== undefined ? nonce.toLocaleString('en') : '...'}
              </CardItem>
              {tokensActive && (
                <CardItem className={cardItemClass} title="Tokens" icon={faCoins}>
                  {accountTokensCount !== undefined ? accountTokensCount : '...'}
                </CardItem>
              )}
              <CardItem className={cardItemClass} title="Shard" icon={faLayerGroup}>
                {shard !== undefined ? (
                  <NetworkLink to={urlBuilder.shard(shard)} data-testid="shardLink">
                    <ShardSpan shard={shard} />
                  </NetworkLink>
                ) : (
                  <>N/A</>
                )}
              </CardItem>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default AccountDetailsCard;
