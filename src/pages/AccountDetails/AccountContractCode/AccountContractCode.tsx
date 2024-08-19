import { useEffect, useState } from 'react';
import { VerifiedContractType } from '@multiversx/sdk-dapp-sc-explorer/types/verifiedContract.types';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { CopyButton } from 'components';
import { urlBuilder } from 'helpers';
import { useNetworkRoute, useAdapter } from 'hooks';
import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';
import { accountSelector } from 'redux/selectors';

import { DownloadABIFile } from './DownloadABIFile';
import { DownloadContractCode } from './DownloadContractCode';
import { AccountVerifiedContract } from '../AccountVerifiedContract';

export const AccountContractCode = () => {
  const networkRoute = useNetworkRoute();
  const { getAccountContractVerification } = useAdapter();

  const { account } = useSelector(accountSelector);
  const { codeHash, code, address, isVerified } = account;

  const [contract, setContract] = useState<VerifiedContractType>();
  const [isDataReady, setIsDataReady] = useState<undefined | boolean>();

  const codeHashBase64Buffer = Buffer.from(String(codeHash ?? ''), 'base64');
  const codeHashHexValue = codeHashBase64Buffer.toString('hex');

  const fetchContractVerification = () => {
    getAccountContractVerification({ address }).then(({ success, data }) => {
      if (success && data) {
        setContract(data);
      }
      setIsDataReady(success);
    });
  };

  useEffect(() => {
    if (address && isVerified) {
      fetchContractVerification();
    }
  }, [address, isVerified]);

  const contractSource = contract?.source as any; // temporary until types extendes in SC explorer
  const contractName =
    contractSource?.contract?.metadata?.contractName ||
    contractSource?.abi?.name;

  return !code ? (
    <Navigate to={networkRoute(urlBuilder.accountDetails(address))} />
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
      {isVerified && (
        <AccountVerifiedContract
          contract={contract}
          isDataReady={isDataReady}
        />
      )}
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

        <div className='mt-4 d-flex flex-wrap gap-3 align-items-center'>
          <DownloadContractCode
            code={code}
            fileName={contractName ?? address}
          />
          {contract?.source?.abi && (
            <DownloadABIFile
              abi={contract.source.abi}
              fileName={contractName ?? address}
            />
          )}
        </div>
      </div>
    </div>
  );
};
