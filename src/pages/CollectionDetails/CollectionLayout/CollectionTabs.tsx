import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { urlBuilder, nftText } from 'helpers';
import { collectionSelector } from 'redux/selectors';
import { collectionRoutes } from 'routes';
import { NftEnumType } from 'types';
import { Tabs } from 'components/Tabs';

export const CollectionTabs = () => {
  const { collectionState } = useSelector(collectionSelector);
  const { collection, roles, type } = collectionState;
  const { pathname } = useLocation();

  const tabs = [
    {
      show: type && type !== NftEnumType.MetaESDT,
      tabTo: urlBuilder.collectionDetails(collection),
      tabLabel: `${nftText(type)}s`,
      activationRoutes: [collectionRoutes.collectionDetails]
    },
    {
      show: Boolean(roles),
      tabTo: urlBuilder.collectionDetailsRoles(collection),
      tabLabel: 'Roles',
      activationRoutes: [
        collectionRoutes.collectionDetailsRoles,
        type === NftEnumType.MetaESDT ? pathname : ''
      ]
    }
  ];

  return <Tabs tabs={tabs} />;
};
