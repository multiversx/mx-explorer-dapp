import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { MAX_DISPLAY_TX_DATA_LENGTH } from 'appConstants';
import {
  FormatAmount,
  CopyButton,
  Trim,
  NetworkLink,
  DataDecode,
  DecodeMethodEnum,
  AccountLink
} from 'components';
import { urlBuilder, truncate } from 'helpers';
import {
  useActiveRoute,
  useScrollToTransactionSection,
  useGetTransactionUrlHashParams
} from 'hooks';
import { faExchange, faSearch } from 'icons/regular';
import { transactionsRoutes } from 'routes';
import { TransactionSCResultType } from 'types';

export const ScResultsList = ({
  results
}: {
  results: TransactionSCResultType[];
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const activeRoute = useActiveRoute();
  const { hashId, hashDecodeMethod } = useGetTransactionUrlHashParams();
  const [decodeMethod, setDecodeMethod] =
    useState<DecodeMethodEnum>(hashDecodeMethod);

  useScrollToTransactionSection(ref);

  return (
    <div className='sc-results-list item-list d-flex flex-column mt-1'>
      {results.map((result: TransactionSCResultType, i) => {
        const isResultHighlighted =
          hashId === result.hash &&
          activeRoute(transactionsRoutes.transactionDetails) &&
          !activeRoute(transactionsRoutes.transactionDetailsLogs);

        const resultLink = `${transactionsRoutes.transactions}/${result.originalTxHash}#${result.hash}/${decodeMethod}`;

        const decodedData = result.data
          ? truncate(
              Buffer.from(result.data, 'base64').toString(),
              MAX_DISPLAY_TX_DATA_LENGTH
            )
          : 'N/A';

        return (
          <div
            key={i}
            id={result.hash}
            className={classNames(
              'detailed-item d-flex border-start border-bottom ms-3 py-3',
              { highlighted: isResultHighlighted }
            )}
            {...(isResultHighlighted ? { ref: ref } : {})}
          >
            <NetworkLink to={resultLink} className='detailed-item-icon'>
              <FontAwesomeIcon icon={faSearch} className='hover-icon' />
              <FontAwesomeIcon icon={faExchange} className='default-icon' />
            </NetworkLink>

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
                    <NetworkLink to={resultLink} className='side-action'>
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
                      hasHighlight
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
                      hasHighlight
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
                    <FormatAmount value={result.value} showLastNonZeroDecimal />
                  </div>
                </div>
              )}

              {result.data && (
                <div className='row d-flex flex-column flex-sm-row'>
                  <div className='col-sm-2 col-left'>Data</div>
                  <div className='col-sm-10'>
                    <DataDecode
                      value={decodedData}
                      setDecodeMethod={setDecodeMethod}
                      {...(isResultHighlighted
                        ? { initialDecodeMethod: hashDecodeMethod }
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
