import { AccountName, FormatAmount, NetworkLink } from 'components';
import { urlBuilder } from 'helpers';
import { AccountType } from 'types';

export const SearchAccountRow = ({ account }: { account: AccountType }) => {
  const { address, assets, username } = account;
  return (
    <NetworkLink
      to={urlBuilder.accountDetails(account.address)}
      key={address}
      className='search-suggestion selectable'
    >
      <div className='search-text trim text-truncate'>
        <AccountName
          address={address}
          assets={assets}
          username={username}
          trimClassName='hash'
        />
      </div>

      <div className='ms-auto'>
        <FormatAmount value={account.balance} />
      </div>
    </NetworkLink>
  );
};
