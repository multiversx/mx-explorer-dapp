import { useSelector } from 'react-redux';

import { Tabs } from 'components/Tabs';
import { urlBuilder, getNftText } from 'helpers';
import { collectionSelector } from 'redux/selectors';
import { collectionRoutes, tokensRoutes } from 'routes';
import { NftTypeEnum } from 'types';

export const CollectionTabs = () => {
  const { collectionState } = useSelector(collectionSelector);
  const { collection, roles, type } = collectionState;

  const isMetaESDT = type && type === NftTypeEnum.MetaESDT;

  const tabs = [
    {
      show: !isMetaESDT,
      tabTo: urlBuilder.collectionDetails(collection),
      tabLabel: `${getNftText(type)}s`,
      activationRoutes: [collectionRoutes.collectionDetails]
    },
    {
      tabTo: isMetaESDT
        ? urlBuilder.tokenMetaEsdtDetails(collection)
        : urlBuilder.collectionDetailsTransactions(collection),
      tabLabel: 'Transactions',
      activationRoutes: [
        collectionRoutes.collectionDetailsTransactions,
        tokensRoutes.tokensMetaEsdtDetails
      ]
    },
    {
      show: Boolean(roles),
      tabTo: isMetaESDT
        ? urlBuilder.tokenMetaEsdtDetailsRoles(collection)
        : urlBuilder.collectionDetailsRoles(collection),
      tabLabel: 'Roles',
      activationRoutes: [
        collectionRoutes.collectionDetailsRoles,
        tokensRoutes.tokensMetaEsdtDetailsRoles
      ]
    }
  ];

  return <Tabs tabs={tabs} />;
};
