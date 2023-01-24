import { useSelector, useDispatch } from 'react-redux';
import { interfaceSelector } from 'redux/selectors';
import {
  addNotification as addStateNotification,
  removeNotification as removeStateNotification
} from 'redux/slices/interface';
import { NotificationType } from 'types/interface.types';

interface AddNotificationType {
  id: NotificationType['id'];
  text: NotificationType['text'];
  priority: NotificationType['priority'];
  bgClassName?: NotificationType['bgClassName'];
  dismissable?: NotificationType['dismissable'];
}

export const useNotifications = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector(interfaceSelector);

  const addNotification = ({
    id,
    text,
    priority,
    bgClassName = '',
    dismissable = true
  }: AddNotificationType) => {
    const exists = notifications.find((item) => item.id === id);

    if (!exists) {
      dispatch(
        addStateNotification({
          id,
          text,
          bgClassName,
          priority,
          dismissable
        })
      );
    }
  };

  const removeNotification = (id: string) => {
    dispatch(removeStateNotification(id));
  };

  return { addNotification, removeNotification };
};
