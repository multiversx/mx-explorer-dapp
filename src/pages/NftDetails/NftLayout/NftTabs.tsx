import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { Tabs } from 'components/Tabs';
import { urlBuilder } from 'helpers';
import { nftSelector } from 'redux/selectors';
import { nftRoutes } from 'routes';
import { NftTypeEnum } from 'types';

export const NftTabs = () => {
  const { nftState } = useSelector(nftSelector);
  const { identifier, type } = nftState;
  const { pathname } = useLocation();

  const tabs = [
    {
      show: type && type !== NftTypeEnum.MetaESDT,
      tabTo: urlBuilder.nftDetails(identifier),
      tabLabel: 'Transactions',
      activationRoutes: [nftRoutes.nftDetails]
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
