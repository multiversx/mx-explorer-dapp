import { useSearchParams } from 'react-router-dom';

import { Tabs } from 'components/Tabs';
import { UsersCountRangeEnum } from 'types';

export const ApplicationsTimelineFilterTabs = () => {
  const [searchParams] = useSearchParams();
  const { usersCountRange } = Object.fromEntries(searchParams);

  const tabs = [
    {
      filterName: 'usersCountRange',
      filterValue: UsersCountRangeEnum._24h as string,
      tabLabel: '24h'
    },
    {
      filterName: 'usersCountRange',
      filterValue: UsersCountRangeEnum._7d as string,
      tabLabel: '7d'
    },
    {
      filterName: 'usersCountRange',
      filterValue: UsersCountRangeEnum._30d as string,
      tabLabel: '30d',
      defaultActive: !usersCountRange
    },
    {
      filterName: 'usersCountRange',
      filterValue: UsersCountRangeEnum._allTime as string,
      tabLabel: 'All'
    }
  ];

  return <Tabs tabs={tabs} />;
};
