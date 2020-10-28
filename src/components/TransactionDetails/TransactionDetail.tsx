import * as React from 'react';

interface TransactionDetailType {
  children: React.ReactNode;
  label: string;
  hideDelimiter?: boolean;
  disabled?: boolean;
}

const TransactionDetail = ({
  children,
  label,
  hideDelimiter = false,
  disabled = false,
}: TransactionDetailType) => (
  <>
    <div className={`row py-3 ${hideDelimiter ? '' : 'border-bottom'}`}>
      <div className="col-lg-2 text-secondary text-lg-right">{label}</div>
      <div className="col">
        {disabled ? <span className="text-muted">N/A</span> : <>{children}</>}
      </div>
    </div>
  </>
);

export default TransactionDetail;
