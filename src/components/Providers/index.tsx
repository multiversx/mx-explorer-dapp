import React from 'react';
import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { adapter, ProvidersTable, Loader, PageState } from 'sharedComponents';
import { useGlobalState } from 'context';
import NodesTabs from 'components/Nodes/NodesLayout/NodesTabs';
import { types } from 'helpers';

const Providers = () => {
  const ref = React.useRef(null);
  const { getProviders } = adapter();
  const {
    activeNetwork: { delegationApi, id },
  } = useGlobalState();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [providers, setProviders] = React.useState<types.ProviderType[]>([]);

  const fetchProviders = () => {
    setDataReady(undefined);

    getProviders({
      baseUrl: delegationApi || '',
      props: {
        fields: [
          'identity',
          'contract',
          'totalActiveStake',
          'numNodes',
          'apr',
          'serviceFee',
          'maxDelegationCap',
        ].join(','),
      },
    }).then((providersData) => {
      if (ref.current !== null) {
        if (providersData.success) {
          setProviders(providersData.data);
        }
        setDataReady(providersData.success);
      }
    });
  };

  React.useEffect(fetchProviders, [id]);

  return (
    <div className="card" ref={ref}>
      <div className="card-header">
        <NodesTabs />
      </div>

      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState
          icon={faCode}
          title="Unable to load providers"
          className="py-spacer my-auto"
          dataTestId="errorScreenProviders"
        />
      )}

      {dataReady === true && (
        <div className="card-body p-0">
          <ProvidersTable providers={providers} />
        </div>
      )}
    </div>
  );
};

export default Providers;
