import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CopyButton } from 'components';
import { downloadFile, urlBuilder } from 'helpers';
import { useNetworkRoute } from 'hooks';
import { accountSelector } from 'redux/selectors';

import { AccountTabs } from './AccountLayout/AccountTabs';
import { AccountVerifiedContract } from './AccountVerifiedContract';

export const DownloadContractCode = ({
  code,
  fileName
}: {
  code: string;
  fileName?: string;
}) => {
  const download = (e: React.MouseEvent) => {
    const name = fileName ?? 'contract';

    e.preventDefault();
    if (code && name) {
      const codeBuffer = Buffer.from(code, 'hex');
      downloadFile({ data: codeBuffer, name, fileType: 'wasm' });
    }
  };

  return (
    <div className='mt-4'>
      <button type='button' onClick={download} className='btn btn-primary'>
        Download WASM File
      </button>
    </div>
  );
};

export const AccountContractCode = () => {
  const navigate = useNavigate();

  const networkRoute = useNetworkRoute();

  const { account } = useSelector(accountSelector);
  const { codeHash, code, address, isVerified } = account;

  const codeHashBase64Buffer = Buffer.from(String(codeHash ?? ''), 'base64');
  const codeHashHexValue = codeHashBase64Buffer.toString('hex');

  return !code ? (
    navigate(networkRoute(urlBuilder.accountDetails(address)))
  ) : (
    <div className='card'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <AccountTabs />
        </div>

        {codeHash && (
          <div className='pt-4'>
            <div className='card card-sm bg-table-header p-3 d-flex flex-column'>
              <div className='d-flex flex-row'>
                <span className='text-neutral-400'>Code Hash:</span>
                <div className='d-flex align-items-center text-break-all ms-2'>
                  <span data-testid='address'>{codeHashHexValue}</span>
                  <CopyButton text={codeHashHexValue} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {isVerified && <AccountVerifiedContract />}
      <div className='card-body'>
        <h5 className='mb-3'>Contract Code</h5>
        <div className='textarea-wrapper'>
          <textarea
            readOnly
            className='form-control col'
            rows={10}
            defaultValue={code}
          />
        </div>

        <DownloadContractCode code={code} fileName={address} />
      </div>
    </div>
  );
};
