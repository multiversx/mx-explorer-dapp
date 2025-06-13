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
          text: 'Governance Vote LIVE: Barnard Protocol Upgrade. Vote now!',
          dismissable: true,
          bgClassName: 'bg-centered-primary',
          priority: 2
        });
      }
    }
  }
};
