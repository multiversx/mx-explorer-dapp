import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import {
  Denominate,
  CopyButton,
  Trim,
  NetworkLink,
  DataDecode,
  AccountLink
} from 'components';
import { DecodeMethodType } from 'components/DataDecode';
import { urlBuilder } from 'helpers';
import { faExchange, faSearch } from 'icons/regular';
import { activeNetworkSelector } from 'redux/selectors';
import { transactionsRoutes } from 'routes';
import { TransactionSCResultType } from 'types';

import { decodePart } from './helpers/decodePart';

export const ScResultsList = ({
  results
}: {
  results: TransactionSCResultType[];
}) => {
  const { hash } = useLocation();
  const { egldLabel } = useSelector(activeNetworkSelector);

  const ref = useRef<HTMLDivElement>(null);
  const formattedHash = hash
    .substring(0, hash.indexOf('/') > 0 ? hash.indexOf('/') : hash.length)
    .replace('#', '');

  const initialDecodeMethod =
    hash.indexOf('/') > 0
      ? hash.substring(hash.indexOf('/') + 1)
      : DecodeMethodType.raw;

  const [decodeMethod, setDecodeMethod] = useState<string>(
    initialDecodeMethod &&
      Object.values<string>(DecodeMethodType).includes(initialDecodeMethod)
      ? initialDecodeMethod
      : DecodeMethodType.raw
  );

  const decodeData = (data: string) => {
    const parts = Buffer.from(data, 'base64').toString().split('@');

    if (parts.length >= 2) {
      if (parts[0].length > 0) {
        parts[0] = decodePart(parts[0]);
      } else {
        parts[1] = decodePart(parts[1]);
      }
    }

    return parts.join('@');
  };

  useEffect(() => {
    setTimeout(() => {
      if (formattedHash && ref.current && ref.current !== null) {
        window.scrollTo({
          top: ref.current.getBoundingClientRect().top - 86,
          behavior: 'smooth'
        });
      }
    }, 200);
  }, [formattedHash]);

  return (
    <div className='sc-results-list detailed-list d-flex flex-column mt-1'>
      {results.map((result: TransactionSCResultType, i) => {
        const highlightTx = formattedHash === result.hash;
        return (
          <div
            key={i}
            id={result.hash}
            className={`detailed-item d-flex border-start border-bottom ms-3 py-3 ${
              highlightTx ? 'highlighted' : ''
            }`}
            {...(highlightTx ? { ref: ref } : {})}
          >
            <div className='transaction-icon'>
              <FontAwesomeIcon icon={faExchange} />
            </div>

            <div className='detailed-item-content'>
              {result.hash && (
                <div className='row mb-3 d-flex flex-column flex-sm-row'>
                  <div className='col-sm-2 col-left'>Hash</div>
                  <div className='col-sm-10 d-flex align-items-center'>
                    <Trim text={result.hash} />
                    <CopyButton
                      text={result.hash}
                      className='side-action ms-2'
                    />
                    <NetworkLink
                      to={`${transactionsRoutes.transactions}/${result.originalTxHash}#${result.hash}/${decodeMethod}`}
                      className='side-action'
                    >
                      <FontAwesomeIcon icon={faSearch} />
                    </NetworkLink>
                  </div>
                </div>
              )}

              {result?.miniBlockHash && (
                <div className='row mb-3 d-flex flex-column flex-sm-row'>
                  <div className='col-sm-2 col-left'>Miniblock Hash</div>
                  <div className='col-sm-10 d-flex align-items-center'>
                    <NetworkLink
                      to={urlBuilder.miniblockDetails(result.miniBlockHash)}
                      className='trim-wrapper'
                    >
                      <Trim text={result.miniBlockHash} />
                    </NetworkLink>
                    <CopyButton
                      text={result.miniBlockHash}
                      className='side-action ms-2'
                    />
                  </div>
                </div>
              )}

              {result.sender && (
                <div className='row mb-3 d-flex flex-column flex-sm-row'>
                  <div className='col-sm-2 col-left'>From</div>
                  <div className='col-sm-10 d-flex align-items-center'>
                    <AccountLink
                      address={result.sender}
                      assets={result.senderAssets}
                    />
                    <CopyButton
                      text={result.sender}
                      className='side-action ms-2'
                    />
                  </div>
                </div>
              )}

              {result.receiver && (
                <div className='row mb-3 d-flex flex-column flex-sm-row'>
                  <div className='col-sm-2 col-left'>To</div>
                  <div className='col-sm-10 d-flex align-items-center'>
                    <AccountLink
                      address={result.receiver}
                      assets={result.receiverAssets}
                    />
                    <CopyButton
                      text={result.receiver}
                      className='side-action ms-2'
                    />
                  </div>
                </div>
              )}

              {result.value !== undefined && (
                <div className='row mb-3 d-flex flex-column flex-sm-row'>
                  <div className='col-sm-2 col-left'>Value</div>
                  <div className='col-sm-10 text-wrap text-neutral-100'>
                    <Denominate value={result.value} showLastNonZeroDecimal />
                  </div>
                </div>
              )}

              {result.data && (
                <div className='row d-flex flex-column flex-sm-row'>
                  <div className='col-sm-2 col-left'>Data</div>
                  <div className='col-sm-10'>
                    <DataDecode
                      value={result.data ? decodeData(result.data) : 'N/A'}
                      {...(highlightTx
                        ? { initialDecodeMethod, setDecodeMethod }
                        : {})}
                    />
                  </div>
                </div>
              )}

              {result.returnMessage && (
                <div className='row mt-3 d-flex flex-column flex-sm-row'>
                  <div className='col-sm-2 col-left'>Response</div>
                  <div className='col-sm-10 text-break-all'>
                    {result.returnMessage}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
