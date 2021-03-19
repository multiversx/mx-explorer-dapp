import React from 'react';
import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { adapter, ProvidersTable, Loader, PageState } from 'sharedComponents';
import { useGlobalState } from 'context';
import NodesTabs from 'components/Nodes/NodesLayout/NodesTabs';
import { types } from 'helpers';

const Providers = () => {
  const ref = React.useRef(null);
  const { getProviders } = adapter();
  const { activeNetworkId } = useGlobalState();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [providers, setProviders] = React.useState<types.ProviderType[]>([]);

  const fetchProviders = () => {
    setDataReady(undefined);

    getProviders({
      fields: [
        'identity',
        'contract',
        'totalActiveStake',
        'numNodes',
        'apr',
        'serviceFee',
        'maxDelegationCap',
      ].join(','),
    }).then((providersData) => {
      if (ref.current !== null) {
        if (providersData.success) {
          setProviders(providersData.data);
        }
        setDataReady(providersData.success);

        // setProviders([
        //   {
        //     contract: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqplllst77y4l',
        //     serviceFee: '12',
        //     withDelegationCap: true,
        //     maxDelegationCap: '100',
        //     apr: '29',
        //     totalActiveStake: '2250000000000000000000000',
        //     numUsers: 4,
        //     numNodes: 20,
        //     identity: {
        //       name: 'Just Mining',
        //       avatar:
        //         'https://s3.amazonaws.com/keybase_processed_uploads/b011b27c59f42344b38b476da9d85105_360_360.jpg',
        //       identity: 'thomasjustmining',
        //       website: 'https://elrond.com',
        //       validators: 1454,
        //       score: 174480,
        //       stake: 3635000,
        //       stakePercent: 67.04,
        //     },
        //   },
        //   {
        //     contract: 'erd195fe57d7fm5h33585sc7wl8trqhrmy85z3dg6f6mqd0724ymljxq3zjemc',
        //     serviceFee: '5',
        //     withDelegationCap: true,
        //     maxDelegationCap: '200',
        //     apr: '34',
        //     totalActiveStake: '1250000000000000000000000',
        //     numUsers: 1,
        //     numNodes: 1,
        //     identity: {
        //       avatar:
        //         'https://s3.amazonaws.com/keybase_processed_uploads/b011b27c59f42344b38b476da9d85105_360_360.jpg',
        //       identity: 'thomasjustmining',
        //       website: 'https://elrond.com',
        //       name: 'Just Mining',
        //       validators: 1454,
        //       score: 174480,
        //       stake: 3635000,
        //       stakePercent: 67.04,
        //     },
        //   },
        //   {
        //     contract: 'erd1qqqqqqqqqqqqqpgqxwakt2g7u9atsnr03gqcgmhcv38pt7mkd94q6shuwt',
        //     serviceFee: '25',
        //     maxDelegationCap: '0',
        //     apr: '55',
        //     totalActiveStake: '9250000000000000000000000',
        //     numUsers: 14,
        //     numNodes: 200,
        //   },
        // ]);
        // setDataReady(true);
      }
    });
  };

  React.useEffect(fetchProviders, [activeNetworkId]);

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
