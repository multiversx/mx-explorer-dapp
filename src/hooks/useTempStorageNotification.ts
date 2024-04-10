import { useSelector } from 'react-redux';

import { TEMP_LOCAL_NOTIFICATION_DISMISSED } from 'appConstants';
import { storage } from 'helpers';
import { useNotifications, useIsMainnet } from 'hooks';
import { interfaceSelector } from 'redux/selectors';

export const useTempStorageNotification = () => {
  const { notifications } = useSelector(interfaceSelector);
  const { addNotification } = useNotifications();
  const isMainnet = useIsMainnet();

  if (isMainnet) {
    const isStorageNotificationDismissed = storage.getFromLocal(
      TEMP_LOCAL_NOTIFICATION_DISMISSED
    );

    if (!isStorageNotificationDismissed) {
      const exists = notifications.find(
        (item) => item.id === TEMP_LOCAL_NOTIFICATION_DISMISSED
      );
      if (!exists) {
        addNotification({
          id: TEMP_LOCAL_NOTIFICATION_DISMISSED,
          text: 'MultiversX Governance Vote is LIVE | Vote Now For The Vega (Staking V4) upgrade.',
          dismissable: true,
          priority: 2
        });
      }
    }
  }
};
