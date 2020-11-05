import React from 'react';
import Tabs from 'components/Validators/Tabs';

const NodesLayout = ({
  children,
  headerItem,
}: {
  children: React.ReactNode;
  headerItem?: React.ReactNode;
}) => {
  return (
    <div className="container py-spacer">
      <div className="row page-header mb-spacer">
        <div className="col-12">
          <h3 className="page-title">
            <span data-testid="title">Nodes</span>
          </h3>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="card-header-item pb-0 px-0 border-0">
                <Tabs />
              </div>
              {headerItem}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodesLayout;
