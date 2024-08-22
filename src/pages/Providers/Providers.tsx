import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { PROVIDERS_FIELDS } from 'appConstants';
import { ProvidersTable, Loader, PageState, ExpandRow } from 'components';
import {
  sortProviders,
  SortProviderFieldEnum
} from 'components/ProvidersTable/helpers';
import { partitionBy } from 'helpers';
import { useAdapter } from 'hooks';
import { faCode } from 'icons/regular';
import { NodesTabs } from 'layouts/NodesLayout/NodesTabs';
import { activeNetworkSelector } from 'redux/selectors';
import { ProviderType, SortOrderEnum } from 'types';

export const Providers = () => {
  const ref = useRef(null);
  const { getProviders } = useAdapter();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [displayProviders, setDisplayProviders] = useState<ProviderType[]>([]);
  const [displayInactiveProviders, setDisplayInactiveProviders] = useState<
    ProviderType[]
  >([]);

  const fetchProviders = () => {
    setDataReady(undefined);
    getProviders({
      fields: PROVIDERS_FIELDS.join(','),
      withIdentityInfo: true
    }).then((providersData) => {
      if (providersData.success) {
        if (providersData.data.length > 0) {
          const [activeProviders, inactiveProviders] = partitionBy(
            providersData.data,
            (provider) => provider.numNodes > 0 && provider.locked > 0
          );

          const sortedProviders = sortProviders({
            field: SortProviderFieldEnum.numNodes,
            order: SortOrderEnum.desc,
            sortArray: [...activeProviders]
          });
          const rankedProviders = sortedProviders.map((provider, index) => {
            return { ...provider, rank: index + 1 };
          });
          const rankedInactiveProviders = (
            inactiveProviders as ProviderType[]
          ).map((provider, index) => {
            return { ...provider, rank: index + 1 };
          });

          setDisplayProviders(rankedProviders);
          setDisplayInactiveProviders(rankedInactiveProviders);
        } else {
          setDisplayProviders(providersData.data);
        }
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
          <ProvidersTable providers={displayProviders} />
          {displayInactiveProviders.length > 0 && (
            <>
              <h3 className='mt-5 mb-3'>Inactive Providers</h3>
              <ProvidersTable
                providers={displayInactiveProviders}
                hideFilters
                hasExpand
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
