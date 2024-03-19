import { useParams } from 'react-router-dom';
import { Tabs } from 'components/Tabs';
import { urlBuilder } from 'helpers';

export const ProviderTabs = () => {
  const { hash: address } = useParams() as any;

  const tabs = [
    {
      tabLabel: 'Nodes',
      tabTo: urlBuilder.providerDetails(address)
    },
    {
      tabTo: urlBuilder.providerDetailsTransactions(address),
      tabLabel: 'Transactions'
    }
  ];

  return (
    <div className='card-header-item provider-tabs'>
      <Tabs tabs={tabs} />
    </div>
  );
};
