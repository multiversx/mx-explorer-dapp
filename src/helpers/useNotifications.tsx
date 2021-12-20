import { useGlobalState, useGlobalDispatch } from 'context';
import { NotificationType } from 'context/state';

interface AddNotificationType {
  id: NotificationType['id'];
  text: NotificationType['text'];
  priority: NotificationType['priority'];
  bgClassName?: NotificationType['bgClassName'];
  dismissable?: NotificationType['dismissable'];
}

export default function useNotifications() {
  const dispatch = useGlobalDispatch();
  const { notifications } = useGlobalState();

  const addNotification = ({
    id,
    text,
    priority,
    bgClassName = '',
    dismissable = true,
  }: AddNotificationType) => {
    const exists = notifications.find((item) => item.id === id);

    if (!exists) {
      dispatch({
        type: 'addNotification',
        notification: {
          id,
          text,
          bgClassName,
          priority,
          dismissable,
        },
      });
    }
  };

  const removeNotification = (id: string) => {
    dispatch({
      type: 'removeNotification',
      id,
    });
  };

  return { addNotification, removeNotification };
}
