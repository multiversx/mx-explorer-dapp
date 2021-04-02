import React from 'react';
import { CardItem, CopyButton, Denominate, NetworkLink, adapter } from 'sharedComponents';
import { useGlobalState } from 'context';
import { ReactComponent as ElrondSymbol } from 'assets/images/elrond-symbol-chart.svg';
import { faDollarSign } from '@fortawesome/pro-solid-svg-icons/faDollarSign';
import { faUser } from '@fortawesome/pro-solid-svg-icons/faUser';
import { faCoins } from '@fortawesome/pro-solid-svg-icons/faCoins';
import UsdValue from './UsdValue';
import { isContract, urlBuilder } from 'helpers';

export interface LockedAmountType {
  stakeFetched?: boolean | undefined;
  totalStaked?: string;
  delegationFetched?: boolean | undefined;
  userActiveStake?: string;
  userDeferredPaymentStake?: string;
  userUnstakedStake?: string;
  userWaitingStake?: string;
  userWithdrawOnlyStake?: string;
  usd?: number;
}

const AccountDetailsCard = () => {
  const ref = React.useRef(null);
  const {
    activeNetwork: { id, adapter: networkAdapter },
    accountDetails,
    accountTokens,
  } = useGlobalState();
  const { getProvider, /*getAccountDelegation, getAccountStake,*/ getEgldPrice } = adapter();
  const { address, balance, nonce, txCount } = accountDetails;

  const tokensActive = id !== 'mainnet' && networkAdapter === 'api';
  const cardItemClass = tokensActive ? 'n5' : '';

  const [lockedAmount, setLockedAmount] = React.useState<LockedAmountType>({
    stakeFetched: undefined,
    delegationFetched: undefined,
  });

  // const fetchLockedAmountAndPrice = () => {
  //   if (!document.hidden) {
  //     Promise.all([getAccountDelegation(address), getAccountStake(address), getEgldPrice()]).then(
  //       ([delegationData, stakeData, priceData]) => {
  //         if (ref.current !== null) {
  //           const delegationFetched = delegationData.success ? delegationData.data : {};
  //           const stakeFetched = stakeData.success ? stakeData.data : {};
  //           const usd = priceData.success ? priceData.data : undefined;
  //
  //           setLockedAmount({
  //             ...(delegationFetched ? delegationData.data : {}),
  //             ...(stakeFetched ? stakeData.data : {}),
  //             usd,
  //             delegationFetched,
  //             stakeFetched,
  //           });
  //         }
  //       }
  //     );
  //   }
  // };

  const fetchLockedAmountAndPrice = () => {
    if (!document.hidden) {
      getEgldPrice().then((priceData) => {
        if (ref.current !== null) {
          const usd = priceData.success ? priceData.data : undefined;

          setLockedAmount({
            usd,
          });
        }
      });
    }
  };

  React.useEffect(() => {
    fetchLockedAmountAndPrice();
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
                <span data-testid="address">{address}</span>
                <CopyButton text={address} />
              </div>
            </div>
          </div>

          <div className="card-body card-item-container mx-spacing">
            <CardItem className={cardItemClass} title="Balance" customIcon={<ElrondSymbol />}>
              <div className="d-flex align-items-center">
                {balance !== '...' ? <Denominate value={balance} /> : balance}
              </div>
            </CardItem>

            <CardItem className={cardItemClass} title="Value" icon={faDollarSign}>
              <UsdValue input={balance} usd={lockedAmount.usd} />
            </CardItem>

            {/* <LockedAmountCardItem lockedAmount={lockedAmount} cardItemClass={cardItemClass} /> */}

            <CardItem className={cardItemClass} title="Nonce" icon={faUser}>
              {nonce !== undefined ? nonce.toLocaleString('en') : '...'}
            </CardItem>

            {tokensActive && (
              <CardItem className={cardItemClass} title="Tokens" icon={faCoins}>
                {accountTokens.success ? accountTokens.data.length : '...'}
              </CardItem>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default AccountDetailsCard;
