import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ProvidersTable, Loader, PageState } from 'components';
import { useAdapter } from 'hooks';
import { faCode } from 'icons/regular';
import { NodesTabs } from 'layouts/NodesLayout/NodesTabs';
import { activeNetworkSelector } from 'redux/selectors';
import { IdentityType, ProviderType } from 'types';

export const Providers = () => {
  const ref = useRef(null);
  const { getProviders, getIdentities } = useAdapter();
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [providers, setProviders] = useState<ProviderType[]>([]);

  const fetchProviders = () => {
    setDataReady(undefined);

    getProviders({
      fields: [
        'identity',
        'provider',
        'stake',
        'numNodes',
        'apr',
        'serviceFee',
        'delegationCap'
      ].join(',')
    }).then((providersData) => {
      if (ref.current !== null) {
        if (providersData.success) {
          const newProvidersData: ProviderType[] = providersData.data;

          const identities = newProvidersData
            .filter((item) => item.identity)
            .map((item) => item.identity)
            .join(',');

          if (identities) {
            getIdentities(identities).then((identitiesData) => {
              if (ref.current !== null) {
                if (identitiesData.success) {
                  newProvidersData.forEach((provider) => {
                    if (provider.identity) {
                      const identityDetails = identitiesData.data.find(
                        (identity: IdentityType) =>
                          identity.identity === provider.identity
                      );

                      if (identityDetails) {
                        provider.identityDetails = identityDetails;
                      }
                    }
                  });
                }

                setProviders(newProvidersData);
                setDataReady(providersData.success);
              }
            });
          } else {
            setProviders(providersData.data);
            setDataReady(providersData.success);
          }
        } else {
          setDataReady(providersData.success);
        }
      }
    });
  };

  useEffect(fetchProviders, [activeNetworkId, searchParams]);

  return (
    <div className='card' ref={ref}>
      <div className='card-header'>
        <NodesTabs />
      </div>

      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState
          icon={faCode}
          title='Unable to load providers'
          className='py-spacer my-auto'
          dataTestId='errorScreenProviders'
        />
      )}

      {dataReady === true && (
        <div className='card-body'>
          <ProvidersTable providers={providers} />
        </div>
      )}
    </div>
  );
};
