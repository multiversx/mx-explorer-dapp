import React from 'react';
import { CardItem, CopyButton, Denominate } from 'sharedComponents';
import { useGlobalState } from 'context';
import { ReactComponent as ElrondSymbol } from 'assets/images/elrond-symbol-chart.svg';
import { faDollarSign } from '@fortawesome/pro-solid-svg-icons/faDollarSign';
import { faUser } from '@fortawesome/pro-solid-svg-icons/faUser';
import { faCoins } from '@fortawesome/pro-solid-svg-icons/faCoins';
import { LockedAmountType } from '../AccountLayout';
import UsdValue from './UsdValue';
import LockedAmountCardItem from './LockedAmountCardItem';

const AccountInfo = ({ lockedAmount }: { lockedAmount: LockedAmountType }) => {
  const {
    activeNetwork: { id, adapter },
    accountDetails,
    accountTokens,
  } = useGlobalState();

  const { address, balance, nonce } = accountDetails;
  const tokensActive = id !== 'mainnet' && adapter === 'api';
  const cardItemClass = tokensActive ? 'n5' : '';

  return address !== '' ? (
    <div className="row account-info">
      <div className="col mb-spacer">
        <div className="card">
          <div className="card-header">
            <div className="card-header-item">
              <h6 data-testid="title">Account Details</h6>
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
