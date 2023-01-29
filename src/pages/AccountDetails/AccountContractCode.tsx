import React from 'react';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { downloadFile, urlBuilder } from 'helpers';
import { useNetworkRoute } from 'hooks';

import { accountSelector } from 'redux/selectors';
import { AccountTabs } from './AccountLayout/AccountTabs';

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
  const { codeHash, code, address } = account;

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
      </div>
      {codeHash && (
        <div className='card-body d-flex flex-wrap border-bottom py-3 px-lg-spacer text-truncate'>
          <div className='text-neutral-400 pe-3'>Code Hash</div>
          <div className='text-truncate'>{codeHashHexValue}</div>
        </div>
      )}
      <div className='card-body px-lg-spacer py-lg-4'>
        <textarea
          readOnly
          className='form-control col cursor-text'
          rows={10}
          defaultValue={code}
        />
        <DownloadContractCode code={code} fileName={address} />
      </div>
    </div>
  );
};
