import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { Tabs } from 'components/Tabs';
import { urlBuilder, getNftText } from 'helpers';
import { collectionSelector } from 'redux/selectors';
import { collectionRoutes } from 'routes';
import { NftTypeEnum } from 'types';

export const CollectionTabs = () => {
  const { collectionState } = useSelector(collectionSelector);
  const { collection, roles, type } = collectionState;
  const { pathname } = useLocation();

  const tabs = [
    {
      show: type && type !== NftTypeEnum.MetaESDT,
      tabTo: urlBuilder.collectionDetails(collection),
      tabLabel: `${getNftText(type)}s`,
      activationRoutes: [collectionRoutes.collectionDetails]
    },
    {
      show: Boolean(roles),
      tabTo: urlBuilder.collectionDetailsRoles(collection),
      tabLabel: 'Roles',
      activationRoutes: [
        collectionRoutes.collectionDetailsRoles,
        type === NftTypeEnum.MetaESDT ? pathname : ''
      ]
    }
  ];

  return <Tabs tabs={tabs} />;
};
