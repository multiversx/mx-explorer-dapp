import React from 'react';
import { useGlobalState } from 'context';
import { adapter } from 'sharedComponents';
import { IdentityType, ProviderType } from 'helpers/types';

const ELROND_NODES_IDENTITY = 'elrondcom';

const useFetchProvidersDetails = () => {
  const { getProviders, getIdentities } = adapter();
  const {
    activeNetwork: { id },
  } = useGlobalState();

  const [dataReady, setDataReady] = React.useState<boolean>(false);
  const [providers, setProviders] = React.useState<ProviderType[]>([]);
  const [elrondNodes, setElrondNodes] = React.useState<ProviderType>();

  const fetchProviders = () => {
    setDataReady(false);

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
      if (providersData.success) {
        let newProvidersData: ProviderType[] = providersData.data;

        const providerIdentitiesList = newProvidersData
          .filter((item) => item.identity)
          .map((item) => item.identity);

        if (!providerIdentitiesList.includes(ELROND_NODES_IDENTITY)) {
          providerIdentitiesList.push(ELROND_NODES_IDENTITY);
        }

        const identities = providerIdentitiesList.join(',');

        if (identities) {
          getIdentities(identities).then((identitiesData) => {
            if (identitiesData.success) {
              newProvidersData.forEach((provider) => {
                if (provider.identity) {
                  const identityDetails = identitiesData.data.find(
                    (identity: IdentityType) => identity.identity === provider.identity
                  );

                  const elrondNodes = identitiesData.data.filter((identity: IdentityType) => {
                    return identity.identity === ELROND_NODES_IDENTITY;
                  });
                  if (elrondNodes.length > 0) {
                    setElrondNodes(elrondNodes[0]);
                  }
                  if (identityDetails) {
                    provider.identityDetails = identityDetails;
                  }
                }
              });
            }

            setProviders(newProvidersData);
            setDataReady(providersData.success);
          });
        } else {
          setProviders(providersData.data);
          setDataReady(providersData.success);
        }
      } else {
        setDataReady(providersData.success);
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchProviders, [id]);

  return { providers, elrondNodes, dataReady };
};

export default useFetchProvidersDetails;
