import * as React from 'react';
import { useGlobalState } from 'context';
import { NotificationType } from 'context/state';
import { useNotifications } from 'helpers';
import { faTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NotificationsBar = () => {
  const { notifications } = useGlobalState();
  const { removeNotification } = useNotifications();

  const sortedByPriorityAsc = notifications
    .sort((a: any, b: any) => a.priority - b.priority)
    .map((v: any) => v);

  const notification: NotificationType =
    sortedByPriorityAsc.length > 0 ? sortedByPriorityAsc[0] : undefined;

  return (
    <>
      {notification !== undefined ? (
        <div
          className={`${
            notification.bgClassName !== '' ? notification.bgClassName : 'bg-warning'
          } notification-bar d-flex flex-row align-items-center justify-content-center alert fade show m-0`}
          role="alert"
          data-testid="notificationBar"
        >
          <div className="container d-flex flex-row align-items-center justify-content-between">
            <div className="w-100">{notification.text}</div>
            {notification.dismissable && (
              <a
                href="/#"
                onClick={(event) => {
                  event.preventDefault();
                  removeNotification(notification.id);
                }}
                className="d-flex"
              >
                <FontAwesomeIcon icon={faTimes} className="close-icon" />
              </a>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default NotificationsBar;
