import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { PROVIDERS_FIELDS } from 'appConstants';
import { ProvidersTable, Loader, PageState } from 'components';
import { useAdapter } from 'hooks';
import { faCode } from 'icons/regular';
import { NodesTabs } from 'layouts/NodesLayout/NodesTabs';
import { activeNetworkSelector } from 'redux/selectors';
import { ProviderType } from 'types';

export const Providers = () => {
  const ref = useRef(null);
  const { getProviders } = useAdapter();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [providers, setProviders] = useState<ProviderType[]>([]);

  const fetchProviders = () => {
    setDataReady(undefined);
    getProviders({
      fields: PROVIDERS_FIELDS.join(','),
      withIdentityInfo: true
    }).then((providersData) => {
      if (providersData.success) {
        setProviders(providersData.data);
        setDataReady(providersData.success);
      } else {
        setDataReady(providersData.success);
      }
    });
  };

  // no need to refetch on searchParams change as no sorting is supported on api
  useEffect(fetchProviders, [activeNetworkId]);

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
          data-testid='errorScreenProviders'
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
