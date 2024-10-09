import { DetailItem, CopyButton, AccountLink } from 'components';

export const AddressDetailItem = ({ address }: { address: string }) => (
  <DetailItem title='Address' noBorder>
    <div className='d-flex align-items-center'>
      <AccountLink address={address} />
      <CopyButton text={address} />
    </div>
  </DetailItem>
);
