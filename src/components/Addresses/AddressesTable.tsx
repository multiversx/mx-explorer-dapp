import * as React from 'react';
import { Denominate, NetworkLink } from 'sharedComponents';
import { types, urlBuilder } from 'helpers';

const AddressesTable = ({ addresses }: { addresses: types.AddressType[] }) => {
  return (
    <div className="table-wrapper animated-list">
      <table className="table">
        <thead>
          <tr>
            <th>Address</th>
            <th className="text-right">Balance</th>
          </tr>
        </thead>
        <tbody data-testid="addressesTable">
          {addresses.map((address, i) => (
            <tr key={address.address}>
              <td>
                <div className="d-flex">
                  <NetworkLink
                    to={urlBuilder.addressDetails(address.address)}
                    data-testid={`addressLink${i}`}
                  >
                    {address.address}
                  </NetworkLink>
                </div>
              </td>
              <td className="text-right">
                <Denominate value={address.balance} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddressesTable;
