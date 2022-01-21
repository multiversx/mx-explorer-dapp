import React from 'react';
import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { adapter, ProvidersTable, Loader, PageState } from 'sharedComponents';
import { useGlobalState } from 'context';
import { IdentityType } from 'context/state';
import NodesTabs from 'components/Nodes/NodesLayout/NodesTabs';
import { types } from 'helpers';

const Providers = () => {
  const ref = React.useRef(null);
  const { getProviders, getIdentities } = adapter();
  const {
    activeNetwork: { id },
  } = useGlobalState();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [providers, setProviders] = React.useState<types.ProviderType[]>([]);

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
        'delegationCap',
      ].join(','),
    }).then((providersData) => {
      if (ref.current !== null) {
        if (providersData.success) {
          let newProvidersData: types.ProviderType[] = providersData.data;

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
                        (identity: IdentityType) => identity.identity === provider.identity
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
