import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { UITransactionType } from 'helpers/types';
import { getTransactionFunction } from 'helpers';

const TrasactionFunction = ({ transaction }: { transaction: UITransactionType }) => {
  return transaction.action?.description ? (
    <OverlayTrigger
      placement="top"
      delay={{ show: 0, hide: 400 }}
      overlay={(props: any) => (
        <Tooltip {...props} show={props.show.toString()}>
          {transaction.action?.description}
        </Tooltip>
      )}
    >
      <span>{getTransactionFunction(transaction)}</span>
    </OverlayTrigger>
  ) : (
    <div>{getTransactionFunction(transaction)}</div>
  );
};

export default TrasactionFunction;
