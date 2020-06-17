import * as React from 'react';

interface TransactionDetailType {
  children: React.ReactNode;
  label: string;
  hideDelimiter?: boolean;
}

const TransactionDetail = ({ children, label, hideDelimiter = false }: TransactionDetailType) => (
  <>
    {!hideDelimiter && <hr className="hr-space" />}
    <div className="row">
      <div className="col-lg-2 card-label">{label}</div>
      <div className="col-lg-10">{children}</div>
    </div>
  </>
);

export default TransactionDetail;
