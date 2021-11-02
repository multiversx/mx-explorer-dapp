import React from 'react';
import {
  CardItem,
  CopyButton,
  Denominate,
  NetworkLink,
  adapter,
  ShardSpan,
  ScAddressIcon,
  Trim,
} from 'sharedComponents';
import { useGlobalState } from 'context';
import { isContract, urlBuilder } from 'helpers';
import { ReactComponent as ElrondSymbol } from 'assets/images/elrond-symbol-chart.svg';
import { faDollarSign } from '@fortawesome/pro-solid-svg-icons/faDollarSign';
import { faUser } from '@fortawesome/pro-solid-svg-icons/faUser';
import { faCoins } from '@fortawesome/pro-solid-svg-icons/faCoins';
import { faLayerGroup } from '@fortawesome/pro-solid-svg-icons/faLayerGroup';
import LockedAmountCardItem from './LockedAmountCardItem';
import UsdValue from './UsdValue';

interface Undelegation {
  amount: string;
  seconds: number;
}

interface DelegationType {
  address: string;
  contract: string;
  userUnBondable?: string;
  userActiveStake: string;
  claimableRewards?: string;
  userUndelegatedList: Undelegation[];
}
export interface LockedAmountType {
  stakeFetched: boolean | undefined;
  delegationLegacyFetched: boolean | undefined;
  delegationFetched: boolean | undefined;
  stake?: {
    totalStaked?: string;
  };
  delegationLegacy?: {
    userActiveStake?: string;
    userDeferredPaymentStake?: string;
    userUnstakedStake?: string;
    userWaitingStake?: string;
    userWithdrawOnlyStake?: string;
    claimableRewards?: string;
  };
  delegation?: DelegationType[];
  usd?: number;
}

const AccountDetailsCard = () => {
  const ref = React.useRef(null);
  const {
    activeNetwork: { id, adapter: networkAdapter },
    accountDetails,
    usd,
  } = useGlobalState();
  const {
    getProvider,
    getAccountDelegationLegacy,
    getAccountDelegation,
    getAccountStake,
    getAccountTokensCount,
  } = adapter();
  const { address, balance, nonce, txCount, shard, ownerAddress } = accountDetails;
  const [accountTokensCount, setAccountTokensCount] = React.useState<number>();

  const tokensActive = networkAdapter === 'api';
  const cardItemClass = tokensActive ? 'n5' : '';

  const [lockedAmount, setLockedAmount] = React.useState<LockedAmountType>({
    stakeFetched: undefined,
    delegationLegacyFetched: undefined,
    delegationFetched: undefined,
    stake: undefined,
    delegationLegacy: undefined,
    delegation: undefined,
  });

  const fetchLockedAmountAndPrice = () => {
    if (!document.hidden) {
      Promise.all([
        getAccountDelegation(address),
        getAccountStake(address),
        getAccountDelegationLegacy(address),
      ]).then(([delegationData, stakeData, delegationLegacyData]) => {
        if (ref.current !== null) {
          const delegationFetched = delegationData.success ? delegationData.data : {};
          const stakeFetched = stakeData.success ? stakeData.data : {};
          const delegationLegacyFetched = delegationLegacyData.success
            ? delegationLegacyData.data
            : {};

          const delegation = delegationFetched ? delegationData.data : [];
          const stake = stakeFetched ? stakeData.data : {};
          const delegationLegacy = delegationLegacyFetched ? delegationLegacyData.data : {};

          setLockedAmount({
            delegation,
            stake,
            delegationLegacy,
            delegationFetched,
            stakeFetched,
            delegationLegacyFetched,
          });
        }
      });
    }
  };

  React.useEffect(() => {
    if (!isContract(address)) {
      fetchLockedAmountAndPrice();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txCount, id, address]);

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
      getAccountTokensCount(address).then(({ data, success }) => {
        if (ref.current !== null && success) {
          setAccountTokensCount(typeof data === 'number' ? data : 0);
        }
      });
    }
  };
  React.useEffect(() => {
    fetchAccountTokensCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountDetails.txCount, id, address]);

  return address !== '' ? (
    <div ref={ref} className="row account-details-card">
      <div className="col mb-spacer">
        <div className="card">
          <div className="card-header">
            <div className="card-header-item">
              <div className="d-flex align-items-center justify-content-between">
                <h6 data-testid="title">Account Details</h6>
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
            <div className="card-header-item compact d-flex">
              <span className="text-secondary">Address:</span>
              <div className="d-flex align-items-center text-break-all ml-2">
                <ScAddressIcon initiator={address} />
                <span data-testid="address">{address}</span>
                <CopyButton text={address} />
              </div>
            </div>
          </div>

          <div className="card-body card-item-container mx-spacing">
            <CardItem className={cardItemClass} title="Balance" customIcon={<ElrondSymbol />}>
              <div className="d-flex align-items-center">
                {balance !== '...' ? <Denominate value={balance} decimals={4} /> : balance}
              </div>
            </CardItem>

            <CardItem className={cardItemClass} title="Value" icon={faDollarSign}>
              <UsdValue input={balance} usd={usd} />
            </CardItem>

            <CardItem className={cardItemClass} title="Nonce" icon={faUser}>
              {nonce !== undefined ? nonce.toLocaleString('en') : '...'}
            </CardItem>

            {isContract(address) ? (
              <>
                <CardItem className={cardItemClass} title="Shard" icon={faLayerGroup}>
                  {shard !== undefined ? (
                    <NetworkLink to={urlBuilder.shard(shard)} data-testid="shardLink">
                      <ShardSpan shard={shard} />
                    </NetworkLink>
                  ) : (
                    <>N/A</>
                  )}
                </CardItem>

                {ownerAddress && (
                  <CardItem className={cardItemClass} title="Owner" icon={faUser}>
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
                  </CardItem>
                )}
              </>
            ) : (
              <>
                {tokensActive && (
                  <CardItem className={cardItemClass} title="Tokens" icon={faCoins}>
                    {accountTokensCount !== undefined ? accountTokensCount : '...'}
                  </CardItem>
                )}
                <LockedAmountCardItem lockedAmount={lockedAmount} cardItemClass={cardItemClass} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default AccountDetailsCard;
