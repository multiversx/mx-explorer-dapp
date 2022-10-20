import * as React from 'react';
import { faQuestionCircle } from '@fortawesome/pro-regular-svg-icons/faQuestionCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TransactionType } from 'helpers/types';
import { Overlay } from 'sharedComponents';

enum ErrorDescriptionEnum {
  nonPayableContract = 'sending value to non payable contract',
  protectedKey = 'not allowed to write under protected key',
}

const getErrorDescription = ({
  message,
  transaction,
}: {
  message: string;
  transaction: TransactionType;
}) => {
  switch (true) {
    case message === ErrorDescriptionEnum.nonPayableContract:
      return `Error is received when calling an endpoint that requires ESDT transfers, indicates the fact that the endpoint call wasn't performed for some reason (most likely due to something being invalid in the field, either stray spaces/newlines, invalid values like -1 in this example), so the contract has interpreted this only as an ESDT transfer without endpoint calls. Due to the fact that the contract is non-payable by default, it denied the transfer.`;
    case message === ErrorDescriptionEnum.protectedKey:
      return `The SC you're calling tries to create keys in the account state which are prefixed with protected keywords, like elrond.`;
    default:
      return '';
  }
};

const TransactionErrorDescription = ({
  message,
  transaction,
}: {
  message: string;
  transaction: TransactionType;
}) => {
  const description = getErrorDescription({ message, transaction });

  if (!description) {
    return null;
  }

  return (
    <div className="ml-1">
      <Overlay title={description} className="d-flex" tooltipClassName="vm-error-display">
        <FontAwesomeIcon icon={faQuestionCircle} className="small text-secondary ml-1" />
      </Overlay>
    </div>
  );
};

export default TransactionErrorDescription;
