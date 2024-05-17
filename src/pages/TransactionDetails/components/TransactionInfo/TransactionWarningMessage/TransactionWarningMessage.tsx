import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';

import { useAdapter } from 'hooks';
import { faAngleDown } from 'icons/regular';
import {
  TransactionType,
  TransactionApiStatusEnum,
  TransactionInPoolTypeEnum
} from 'types';

export interface TransactionWarningMessageUIType {
  transaction: TransactionWarningMessageBaseTransactionType;
  isPoolTransaction?: boolean;
}
export interface TransactionWarningMessageBaseTransactionType {
  txHash: TransactionType['txHash'];
  sender: TransactionType['sender'];
  receiver: TransactionType['receiver'];
  nonce: TransactionType['nonce'];
  status?: TransactionType['status'];
  pendingResults?: TransactionType['pendingResults'];
  guardianSignature?: TransactionType['guardianSignature'];
  type?: TransactionInPoolTypeEnum;
}

export const TransactionWarningMessage = ({
  transaction,
  isPoolTransaction
}: TransactionWarningMessageUIType) => {
  const { getAccount, getScResult, getTransaction } = useAdapter();
  const {
    txHash,
    sender: senderAddress,
    nonce: transactionNonce,
    guardianSignature,
    status
  } = transaction;
  const [isDataReady, setIsDataReady] = useState<boolean>(false);
  const [hasUnsyncedNonce, setHasUnsyncedNonce] = useState<boolean>(false);
  const [hasMissingGuardianSignature, setHasMissingGuardianSignature] =
    useState<boolean>(false);

  const isTxPending =
    (status && status.toLowerCase() === TransactionApiStatusEnum.pending) ||
    transaction.pendingResults;

  const getAccountDetails = async () => {
    const { data, success } = await getAccount({
      address: senderAddress,
      withGuardianInfo: true,
      fields: ['nonce', 'isGuarded'].join(',')
    });
    if (data && success) {
      const { nonce: accountNonce, isGuarded } = data;
      if (new BigNumber(transactionNonce).isGreaterThan(accountNonce)) {
        setHasUnsyncedNonce(true);
      }
      if (isGuarded && !guardianSignature) {
        if (isPoolTransaction) {
          let apiTxHash = txHash;
          if (
            transaction.type === TransactionInPoolTypeEnum.SmartContractResult
          ) {
            const {
              data: processedScResultData,
              success: processedScResultSuccess
            } = await getScResult(txHash);
            if (
              processedScResultSuccess &&
              processedScResultData?.originalTxHash
            ) {
              apiTxHash = processedScResultData.originalTxHash;
            }
          }

          const { data: processedTxData, success: processedTxSuccess } =
            await getTransaction(apiTxHash);

          if (processedTxData && processedTxSuccess) {
            setHasMissingGuardianSignature(!processedTxData?.guardianSignature);
          }
        } else {
          setHasMissingGuardianSignature(true);
        }
      }
    }

    setIsDataReady(success);
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (senderAddress && (isTxPending || isTxPending === undefined)) {
        await getAccountDetails();
      }
    }, 1000 * 30); // 30 seconds

    return () => clearTimeout(timer);
  }, [senderAddress, isTxPending]);

  if (!isDataReady) {
    return null;
  }

  return (
    <div className='d-flex flex-column'>
      {hasUnsyncedNonce && (
        <div className='d-flex  text-break-all'>
          <FontAwesomeIcon
            icon={faAngleDown}
            className='text-neutral-400'
            style={{ marginTop: '2px' }}
            transform={{ rotate: 45 }}
          />
          &nbsp;
          <small className='text-warning ms-1'>
            {' '}
            Probable Higher nonce in Transaction
          </small>
        </div>
      )}
      {hasMissingGuardianSignature && (
        <div className='d-flex text-break-all'>
          <FontAwesomeIcon
            icon={faAngleDown}
            className='text-neutral-400'
            style={{ marginTop: '2px' }}
            transform={{ rotate: 45 }}
          />
          &nbsp;
          <small className='text-warning ms-1'>
            {' '}
            Probable Missing Guardian Signature
          </small>
        </div>
      )}
    </div>
  );
};
