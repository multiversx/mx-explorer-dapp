import React from 'react';
import { CopyButton, Denominate, DetailItem } from 'sharedComponents';
import { NavDropdown } from 'react-bootstrap';
import { useGlobalState } from 'context';

const AccountInfo = () => {
  const {
    activeNetwork: { erdLabel },
    accountDetails,
  } = useGlobalState();

  if (!accountDetails) {
    return null;
  }

  const { address, stake, delegation, balance, code } = accountDetails;

  const total = (stake + delegation).toLocaleString('en', {
    minimumFractionDigits: 4,
  });

  return (
    <div className="row balance-and-basic-info">
      <div className="col-12 col-lg-6 mb-spacer">
        <div className="card balance-card">
          <div className="card-header">
            <div className="card-header-item">
              <h6 data-testid="title">Balance</h6>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="container-fluid">
              <DetailItem title="Balance">
                {balance !== '...' ? <Denominate value={balance} /> : balance}
              </DetailItem>
              <DetailItem title="Locked">
                <div className="d-flex align-items-center">
                  <span className="mr-2">
                    {total} {erdLabel}
                  </span>
                  <NavDropdown
                    title={<span className="btn btn-sm btn-outline-primary">Details</span>}
                    id="locked-amount-details"
                  >
                    <div className="locked-item">
                      <span className="locked-item-label">
                        <strong>Delegation</strong>
                      </span>
                      <span>
                        12321321321321{stake} {erdLabel}
                      </span>
                    </div>
                    <div className="locked-item">
                      <span className="locked-item-label">
                        <strong>Stake</strong>
                      </span>
                      <span>
                        1231{delegation} {erdLabel}
                      </span>
                    </div>
                  </NavDropdown>
                </div>
              </DetailItem>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-6 mb-spacer">
        <div className="card">
          <div className="card-header">
            <div className="card-header-item">
              <h6 data-testid="title">Basic Info</h6>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="container-fluid">
              <DetailItem title="Address">
                <div className="d-flex align-items-center text-break-all mr-lg-n1rem">
                  <span data-testid="address">{address}</span>
                  <CopyButton text={address} />
                </div>
              </DetailItem>
              <DetailItem title="Nonce">[12312312]</DetailItem>
              {code && (
                <DetailItem title="Contract Code">
                  <textarea
                    readOnly
                    className="form-control col cursor-text mt-2"
                    rows={4}
                    defaultValue={code}
                  />
                </DetailItem>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
