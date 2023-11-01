import { useSelector } from 'react-redux';

import { TEMP_LOCAL_NOTIFICATION_DISMISSED } from 'appConstants';
import { storage } from 'helpers';
import { useNotifications, useIsDevnet } from 'hooks';
import { interfaceSelector } from 'redux/selectors';

export const useTempStorageNotification = () => {
  const { notifications } = useSelector(interfaceSelector);
  const { addNotification } = useNotifications();
  const isDevnet = useIsDevnet();

  if (isDevnet) {
    const isStorageNotificationDismissed: string | undefined =
      storage.getFromLocal(TEMP_LOCAL_NOTIFICATION_DISMISSED);

    if (!isStorageNotificationDismissed) {
      const exists = notifications.find(
        (item) => item.id === TEMP_LOCAL_NOTIFICATION_DISMISSED
      );
      if (!exists) {
        addNotification({
          id: TEMP_LOCAL_NOTIFICATION_DISMISSED,
          text: 'This is a new devnet (formerly known as &apos;devnet2apos; ). The original devnet was reset on November 1st 2023',
          dismissable: true,
          priority: 2
        });
      }
    }
  }
};
