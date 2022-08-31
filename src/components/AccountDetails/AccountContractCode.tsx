import React from 'react';
import { useGlobalState } from 'context';
import AccountTabs from './AccountLayout/AccountTabs';
import { Redirect } from 'react-router-dom';
import { urlBuilder, useNetworkRoute } from 'helpers';
import { downloadFile } from 'helpers';

const DownloadContractCode = ({ code, fileName }: { code: string; fileName?: string }) => {
  const download = (event: any) => {
    const name = fileName ?? 'contract';

    event.preventDefault();
    if (code && name) {
      const codeBuffer = Buffer.from(code, 'hex');
      downloadFile({ data: [codeBuffer], name, fileType: 'wasm' });
    }
  };

  return (
    <div className="mt-4">
      <button type="button" onClick={download} className="btn btn-primary-light">
        Download WASM File
      </button>
    </div>
  );
};

const AccountContractCode = () => {
  const { accountDetails } = useGlobalState();
  const networkRoute = useNetworkRoute();

  const codeHash = accountDetails?.codeHash ?? '';
  const codeHashBase64Buffer = Buffer.from(String(codeHash), 'base64');
  const codeHashHexValue = codeHashBase64Buffer.toString('hex');

  return !accountDetails.code ? (
    <Redirect to={networkRoute(urlBuilder.accountDetails(accountDetails.address))} />
  ) : (
    <div className="card">
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <AccountTabs />
        </div>
      </div>
      {codeHash && (
        <div className="card-body d-flex flex-wrap border-bottom py-3 px-lg-spacer text-truncate">
          <div className="text-secondary pr-3">Code Hash</div>
          <div className="text-truncate">{codeHashHexValue}</div>
        </div>
      )}
      <div className="card-body px-lg-spacer py-lg-4">
        <textarea
          readOnly
          className="form-control col cursor-text"
          rows={10}
          defaultValue={accountDetails.code}
        />
        <DownloadContractCode code={accountDetails.code} fileName={accountDetails.address} />
      </div>
    </div>
  );
};

export default AccountContractCode;
