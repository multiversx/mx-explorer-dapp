import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

import {
  Loader,
  NetworkLink,
  AccountLink,
  Pager,
  PageSize,
  ColSpanWrapper,
  PageState,
  Trim
} from 'components';
import { urlBuilder } from 'helpers';
import {
  useAdapter,
  useGetPage,
  useHasProofsEndpoint,
  useNetworkRoute
} from 'hooks';
import { faPalette } from 'icons/regular';
import { ProofType } from 'types';

export const Proofs = () => {
  const [searchParams] = useSearchParams();

  const hasProofsEndpoint = useHasProofsEndpoint();
  const networkRoute = useNetworkRoute();
  const { getProofs, getProofsCount } = useAdapter();
  const { page, size } = useGetPage();
  const { hash } = Object.fromEntries(searchParams);

  const [proofs, setProofs] = useState<ProofType[]>([]);
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [totalProofs, setTotalProofs] = useState<number | '...'>('...');

  const fetchProofs = () => {
    if (!hasProofsEndpoint) {
      return;
    }

    Promise.all([
      getProofs({ page, size, hash }),
      getProofsCount({ hash })
    ]).then(([proofsData, count]) => {
      if (proofsData.success) {
        setProofs(proofsData.data);
        setTotalProofs(count.data);
      }
      setDataReady(proofsData.success && count.success);
    });
  };

  useEffect(fetchProofs, [searchParams, hasProofsEndpoint]);

  if (!hasProofsEndpoint) {
    return <Navigate replace to={networkRoute('/not-found')} />;
  }

  if (dataReady === undefined) {
    return <Loader />;
  }

  if (dataReady === false) {
    return <PageState icon={faPalette} title='Unable to load Proofs' isError />;
  }

  return (
    <div className='proofs container page-content'>
      <div className='row'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-header'>
              <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
                <h5>Proofs</h5>
                <Pager
                  total={totalProofs}
                  show={proofs.length > 0}
                  className='d-flex ms-auto me-auto me-sm-0'
                />
              </div>
            </div>

            <div className='card-body'>
              <div className='table-wrapper animated-list'>
                <table className='table mb-0'>
                  <thead>
                    <tr>
                      <th>Identifier</th>
                      <th>Name</th>
                      <th>Hash</th>
                      <th>Collection</th>
                      <th>Creator Account</th>
                    </tr>
                  </thead>
                  <tbody data-testid='proofsTable'>
                    {proofs.length === 0 && (
                      <ColSpanWrapper colSpan={4}>
                        <PageState
                          icon={faPalette}
                          title='No Proofs'
                          className='py-spacer my-auto'
                        />
                      </ColSpanWrapper>
                    )}
                    {proofs.map((proof, i) => (
                      <tr key={`${proof.hash}-${proof.identifier}`}>
                        <td>
                          <div className='d-flex align-items-center'>
                            <NetworkLink
                              to={urlBuilder.proofDetails(proof.identifier)}
                              data-testid={`proofsLink${i}`}
                              className={`d-flex text-truncate ${
                                proof?.assets?.svgUrl ? 'side-link' : ''
                              }`}
                            >
                              <div className='d-flex align-items-center'>
                                {proof?.assets?.svgUrl && (
                                  <img
                                    src={proof.assets.svgUrl}
                                    className='side-icon me-1'
                                    alt=''
                                    role='presentation'
                                  />
                                )}
                                <div>{proof.identifier}</div>
                              </div>
                            </NetworkLink>
                          </div>
                        </td>
                        <td>
                          {proof.name ? (
                            proof.name
                          ) : (
                            <span className='text-neutral-400'>N/A</span>
                          )}
                        </td>
                        <td>
                          {proof.hash ? (
                            <div className='d-flex align-items-center trim-size-xl'>
                              <NetworkLink
                                to={urlBuilder.proofDetails(proof.identifier)}
                                className='trim-wrapper'
                              >
                                <Trim text={proof.hash} />
                              </NetworkLink>
                            </div>
                          ) : (
                            <span className='text-neutral-400'>N/A</span>
                          )}
                        </td>
                        <td>
                          {proof.collectionId ? (
                            proof.collectionId
                          ) : (
                            <span className='text-neutral-400'>N/A</span>
                          )}
                        </td>
                        <td>
                          {proof.creator ? (
                            <div className='d-flex trim-size-xl'>
                              <AccountLink
                                address={proof.creator}
                                hasHighlight
                              />
                            </div>
                          ) : (
                            <span className='text-neutral-400'>N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='card-footer table-footer'>
              <PageSize />
              <Pager total={totalProofs} show={proofs.length > 0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
