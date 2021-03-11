import React from 'react';

const AccountDetailsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="d-flex">
      <div className="flex-fill vh-100">
        Account Details Layout
        <div className="page-container" data-testid="mainPageContent">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsLayout;
