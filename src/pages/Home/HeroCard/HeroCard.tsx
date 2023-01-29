import React from 'react';

import { Search, Particles } from 'components';
import { multiversxApps } from 'config';
import { useFetchGrowthHero, useIsMainnet } from 'hooks';
import {
  AccountsStatsCard,
  BlockHeightStatsCard,
  TransactionsStatsCard,
  ValidatorsStatusCard
} from 'widgets';

export const HeroCard = () => {
  const isMainnet = useIsMainnet();

  const explorerApp = multiversxApps.find((app) => app.id === 'explorer');
  const explorerTitle = explorerApp ? explorerApp.name : 'Explorer';

  useFetchGrowthHero();

  return (
    <div className='hero-card card card-lg card-black'>
      <Particles />
      <div className='card-body d-flex flex-column justify-content-between'>
        <div className='row'>
          <div className='col-lg-6 pt-lg-4 ps-lg-4'>
            <h1 className='h2 mb-4'>MultiversX Blockchain {explorerTitle}</h1>
            <Search />
          </div>
        </div>

        <div className='d-flex flex-column gap-3'>
          <div className='row'>
            <div className='col-lg-8'>
              <div className='d-flex flex-row flex-wrap w-100 gap-3'>
                <BlockHeightStatsCard neutralColors />
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-8'>
              <div className='d-flex flex-row gap-3'>
                <div className='d-flex flex-row flex-wrap w-100 gap-3'>
                  <AccountsStatsCard />
                  <TransactionsStatsCard />
                  {isMainnet && <ValidatorsStatusCard isSmall />}
                </div>
              </div>
            </div>
            <div className='col-lg-4'></div>
          </div>
        </div>
      </div>
    </div>
  );
};
