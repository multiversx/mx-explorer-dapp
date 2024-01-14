import { useSelector } from 'react-redux';

import { Tabs } from 'components/Tabs';
import { urlBuilder } from 'helpers';
import { nftSelector } from 'redux/selectors';
import { nftRoutes } from 'routes';
import { NftTypeEnum } from 'types';

export const NftTabs = () => {
  const { nftState } = useSelector(nftSelector);
  const { identifier, type, metadata, rarities } = nftState;

  const showOverview = Boolean(
    type &&
      type !== NftTypeEnum.MetaESDT &&
      (metadata?.attributes || (rarities && Object.keys(rarities).length > 0))
  );

  const tabs = [
    {
      show: showOverview,
      tabTo: urlBuilder.nftDetails(identifier),
      tabLabel: 'Overview',
      activationRoutes: [nftRoutes.nftDetails]
    },
    {
      show: type && type !== NftTypeEnum.MetaESDT,
      tabTo: urlBuilder.nftDetailsTransactions(identifier),
      tabLabel: 'Transactions',
      activationRoutes: [nftRoutes.nftDetailsTransactions]
    },
    {
      show: type && type === NftTypeEnum.SemiFungibleESDT,
      tabTo: urlBuilder.nftDetailsAccounts(identifier),
      tabLabel: 'Owners',
      activationRoutes: [nftRoutes.nftDetailsAccounts]
    }
  ];

  return <Tabs tabs={tabs} />;
};
