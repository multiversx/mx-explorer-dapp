import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';

import { MAX_DISPLAY_TX_DATA_LENGTH } from 'appConstants';
import {
  CopyButton,
  DataDecode,
  AccountLink,
  NetworkLink,
  DetailItem,
  FormatAmount,
  Trim
} from 'components';
import { addressIsBech32, truncate, urlBuilder, isContract } from 'helpers';
import {
  useActiveRoute,
  useGetTransactionUrlHashParams,
  useScrollToTransactionSection
} from 'hooks';
import { faExchange, faSearch } from 'icons/regular';
import { DecodeMethodEnum } from 'lib';
import { transactionsRoutes } from 'routes';
import { TransactionInnerType } from 'types';

interface InnerTransactionUIType {
  innerTransaction: TransactionInnerType;
  index: number;
  txHash: string;
}

export const InnerTransaction = ({
  innerTransaction,
  index,
  txHash
}: InnerTransactionUIType) => {
  const ref = useRef<HTMLDivElement>(null);
  const activeRoute = useActiveRoute();
  const [searchParams] = useSearchParams();
  const { dataDecode: paramDataDecode } = Object.fromEntries(searchParams);

  const { order, dataDecode } = useGetTransactionUrlHashParams();

  const isTxHighlighted =
    index === Number(order) &&
    paramDataDecode &&
    activeRoute(transactionsRoutes.transactionDetailsInnerTransactions);

  const [dataDecodeMethod, setDataDecodeMethod] = useState<DecodeMethodEnum>(
    isTxHighlighted ? dataDecode : DecodeMethodEnum.raw
  );

  const decodedData = innerTransaction.data
    ? truncate(
        Buffer.from(innerTransaction.data, 'base64').toString(),
        MAX_DISPLAY_TX_DATA_LENGTH
      )
    : 'N/A';

  const innerTransactionLink = urlBuilder.transactionDetailsInnerTransactions(
    txHash,
    {
      hash: innerTransaction.hash,
      order: index,
      dataDecode: dataDecodeMethod
    }
  );

  useScrollToTransactionSection(ref);

  if (!innerTransaction) {
    return null;
  }

  return (
    <div
      className={classNames(
        'detailed-item d-flex border-start border-bottom ms-3 py-3',
        { highlighted: isTxHighlighted }
      )}
      {...(isTxHighlighted ? { ref: ref } : {})}
    >
      <NetworkLink to={innerTransactionLink} className='detailed-item-icon'>
        <FontAwesomeIcon icon={faSearch} className='hover-icon' />
        <FontAwesomeIcon icon={faExchange} className='default-icon' />
      </NetworkLink>

      <div className='detailed-item-content'>
        {innerTransaction.hash && (
          <DetailItem title='Hash' noBorder>
            <div className='d-flex align-items-center'>
              <Trim text={innerTransaction.hash} />
              <CopyButton
                text={innerTransaction.hash}
                className='side-action ms-2'
              />
              <NetworkLink to={innerTransactionLink} className='side-action'>
                <FontAwesomeIcon icon={faSearch} />
              </NetworkLink>
            </div>
          </DetailItem>
        )}
        {innerTransaction.relayer && (
          <DetailItem title='Relayer' noBorder>
            <div className='d-flex align-items-center'>
              <AccountLink address={innerTransaction.relayer} hasHighlight />
              <CopyButton className='me-2' text={innerTransaction.relayer} />
            </div>
          </DetailItem>
        )}
        {addressIsBech32(innerTransaction.sender) && (
          <DetailItem title='From' noBorder>
            <div className='d-flex align-items-center'>
              <AccountLink
                address={innerTransaction.sender}
                username={innerTransaction.senderUsername}
                hasHighlight
              />
              <CopyButton className='me-2' text={innerTransaction.sender} />
            </div>
          </DetailItem>
        )}
        <DetailItem title='To' noBorder>
          <div className='d-flex flex-column'>
            <div className='d-flex align-items-center'>
              {isContract(innerTransaction.receiver) && (
                <span className='me-2 text-neutral-400'>Contract</span>
              )}
              <AccountLink
                address={innerTransaction.receiver}
                username={innerTransaction.receiverUsername}
                hasHighlight
              />
              <CopyButton className='me-2' text={innerTransaction.receiver} />
            </div>
          </div>
        </DetailItem>
        <DetailItem title='Value' className='text-neutral-100' noBorder>
          <FormatAmount
            value={innerTransaction.value.toString()}
            showUsdValue={false}
            showLastNonZeroDecimal
          />
        </DetailItem>
        <DetailItem title='Nonce' noBorder>
          <span className='text-neutral-100'>{innerTransaction.nonce}</span>
        </DetailItem>

        {innerTransaction.data !== undefined && (
          <DetailItem title='Data' noBorder>
            <DataDecode
              value={decodedData}
              setDecodeMethod={setDataDecodeMethod}
              initialDecodeMethod={dataDecodeMethod}
            />
          </DetailItem>
        )}
      </div>
    </div>
  );
};
