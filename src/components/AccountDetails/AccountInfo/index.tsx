import React from 'react';
import { CardItem, CopyButton, Denominate, NetworkLink, adapter } from 'sharedComponents';
import { useGlobalState } from 'context';
import { ReactComponent as ElrondSymbol } from 'assets/images/elrond-symbol-chart.svg';
import { faDollarSign } from '@fortawesome/pro-solid-svg-icons/faDollarSign';
import { faUser } from '@fortawesome/pro-solid-svg-icons/faUser';
import { faCoins } from '@fortawesome/pro-solid-svg-icons/faCoins';
import { LockedAmountType } from '../AccountLayout';
import UsdValue from './UsdValue';
import LockedAmountCardItem from './LockedAmountCardItem';
import { isContract, urlBuilder } from 'helpers';

const AccountInfo = ({ lockedAmount }: { lockedAmount: LockedAmountType }) => {
  const ref = React.useRef(null);
  const {
    activeNetwork: { id, adapter: networkAdapter },
    accountDetails,
    accountTokens,
  } = useGlobalState();

  const { getProvider } = adapter();

  const { address, balance, nonce } = accountDetails;
  const tokensActive = id !== 'mainnet' && networkAdapter === 'api';
  const cardItemClass = tokensActive ? 'n5' : '';

  const [isProvider, setIsProvider] = React.useState(false);
  const fetchProviderDetails = () => {
    if (isContract(accountDetails.address)) {
      setIsProvider(true);
      // getProvider(accountDetails.address).then(({ success, data }) => {
      //   if (ref.current !== null) {
      //     if (success && data !== undefined) {
      //       setIsProvider(true);
      //     }
      //   }
      // });
    }
  };

  React.useEffect(() => {
    fetchProviderDetails();
  }, [id, accountDetails.address]);

  return address !== '' ? (
    <div ref={ref} className="row account-info">
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
              Address:
              <div className="d-flex align-items-center text-break-all ml-2 text-secondary">
                <span>{address}</span>
                <CopyButton text={address} />
              </div>
            </div>
          </div>

          <div className="card-body card-item-container">
            <CardItem className={cardItemClass} title="Balance" customIcon={<ElrondSymbol />}>
              <div className="d-flex align-items-center">
                {balance !== '...' ? <Denominate value={balance} /> : balance}
              </div>
            </CardItem>

            <CardItem className={cardItemClass} title="Value" icon={faDollarSign}>
              <UsdValue input={balance} usd={lockedAmount.usd} />
            </CardItem>

            <LockedAmountCardItem lockedAmount={lockedAmount} cardItemClass={cardItemClass} />

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

export default AccountInfo;
