import * as React from 'react';
import { ScResultType } from 'types';
import { ScResultRow } from './ScResultRow';
import { Pager } from '../Pager';

interface ScResultsTableType {
  scResults: ScResultType[];
  address?: string;
  totalScResults: number | '...';
  size: number;
  title?: React.ReactNode;
}

export const ScResultsTable = ({
  scResults,
  address,
  totalScResults,
  size,
  title = (
    <>
      <h5 data-testid='title' className='table-title d-flex align-items-center'>
        SC Results
      </h5>
    </>
  )
}: ScResultsTableType) => {
  const paginationTotalResults =
    totalScResults !== '...' ? Math.min(totalScResults, 10000) : totalScResults;

  return (
    <div className='transactions-table'>
      <div className='card'>
        <div className='card-header'>
          <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
            <div>{title}</div>
            <Pager
              itemsPerPage={25}
              page={String(size)}
              total={paginationTotalResults}
              show={scResults.length > 0}
              hasTestId={false}
              className='d-flex ms-auto me-auto me-sm-0'
            />
          </div>
        </div>

        <div className='card-body'>
          <div className='table-wrapper animated-list'>
            <table className='table trim-size-sm' data-testid='scResultsTable'>
              <thead>
                <tr>
                  <th scope='col'>Hash</th>
                  <th scope='col'>Age</th>
                  <th scope='col'>From</th>
                  <th scope='col'>To</th>
                  <th scope='col'>Value</th>
                </tr>
              </thead>
              <tbody>
                {scResults.map((scResult) => (
                  <ScResultRow
                    scResult={scResult}
                    key={scResult.hash}
                    address={address}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='card-footer d-flex justify-content-center justify-content-sm-end'>
          <Pager
            itemsPerPage={25}
            page={String(size)}
            total={paginationTotalResults}
            show={scResults.length > 0}
          />
        </div>
      </div>
    </div>
  );
};
