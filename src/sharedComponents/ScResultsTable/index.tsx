import * as React from 'react';
import ScResultRow from './ScResultRow';
import Pager from '../Pager';
import { ScResultType } from 'helpers/types';

interface ScResultsTableType {
  scResults: ScResultType[];
  address?: string;
  totalScResults: number | '...';
  size: number;
  title?: React.ReactNode;
}

const ScResultsTable = ({
  scResults,
  address,
  totalScResults,
  size,
  title = (
    <>
      <h6 data-testid="title">SC Results</h6>
    </>
  ),
}: ScResultsTableType) => {
  return (
    <div className="transactions-table">
      <div className="card">
        <div className="card-header">
          <div className="card-header-item d-flex justify-content-between align-items-center">
            <div>{title}</div>
            <div className="d-none d-sm-flex">
              <Pager
                itemsPerPage={25}
                page={String(size)}
                total={totalScResults !== '...' ? Math.min(totalScResults, 10000) : totalScResults}
                show={scResults.length > 0}
                hasTestId={false}
              />
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-wrapper animated-list">
            <table className="table trim-size-sm" data-testid="scResultsTable">
              <thead>
                <tr>
                  <th scope="col">Hash</th>
                  <th scope="col">Age</th>
                  <th scope="col">From</th>
                  <th scope="col">To</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                {scResults.map((scResult) => (
                  <ScResultRow scResult={scResult} key={scResult.hash} address={address} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer d-flex justify-content-end">
          <Pager
            itemsPerPage={25}
            page={String(size)}
            total={totalScResults !== '...' ? Math.min(totalScResults, 10000) : totalScResults}
            show={scResults.length > 0}
          />
        </div>
      </div>
    </div>
  );
};

export default ScResultsTable;
