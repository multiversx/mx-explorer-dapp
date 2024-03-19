import BigNumber from 'bignumber.js';

import { NetworkLink } from 'components';
import { urlBuilder } from 'helpers';
import { tokensRoutes } from 'routes';
import { MostUsedTokensType } from 'types/growthWidgets';

export const MostUsedTokens = ({ data }: { data: MostUsedTokensType[] }) => {
  return (
    <div className='card card-black h-100'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap'>
          <h5 className='table-title text-capitalize'>
            Most transacted Tokens{'  '}
            <span className='text-neutral-500 ms-1'>(daily)</span>
          </h5>
          <NetworkLink to={tokensRoutes.tokens} className='btn btn-sm btn-dark'>
            Dashboard
          </NetworkLink>
        </div>
      </div>

      <div className='card-body'>
        <div className='table-wrapper animated-list'>
          <table className='table trim-size mb-0'>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Token</th>
                <th className='text-end'>Total Txn</th>
              </tr>
            </thead>
            <tbody data-testid='tokensTable'>
              {data.map((token) => (
                <tr key={token.rank} className='text-lh-24'>
                  <td>{token.rank}</td>
                  <td>
                    <NetworkLink
                      to={urlBuilder.tokenDetails(token.key)}
                      className={`d-flex text-truncate text-primary-200 ${
                        token.extraInfo?.assets?.svgUrl ? 'side-link' : ''
                      }`}
                    >
                      <div className='d-flex align-items-center symbol trim text-truncate'>
                        {token.extraInfo ? (
                          <>
                            {token.extraInfo?.assets?.svgUrl && (
                              <img
                                src={token.extraInfo?.assets.svgUrl}
                                alt={token.extraInfo?.name ?? token.key}
                                className='side-icon me-1'
                              />
                            )}
                            <div className='text-truncate'>
                              {token.extraInfo?.name ? (
                                <>
                                  {token.extraInfo.name} (
                                  {token.extraInfo.ticker})
                                </>
                              ) : (
                                <>{token.key}</>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className='text-truncate'>{token.key}</div>
                        )}
                      </div>
                    </NetworkLink>
                  </td>
                  <td className='text-neutral-300 text-end fw-600 pe-2'>
                    {new BigNumber(token.value).toFormat()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
