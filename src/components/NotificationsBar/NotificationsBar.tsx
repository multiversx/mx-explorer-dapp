import React from 'react';

import { faTimes } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useSelector } from 'react-redux';
import { useNotifications } from 'hooks';
import { interfaceSelector } from 'redux/selectors';
import { NotificationType } from 'types';

export const NotificationsBar = () => {
  const { removeNotification } = useNotifications();
  const { notifications } = useSelector(interfaceSelector);

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
            notification.bgClassName !== ''
              ? notification.bgClassName
              : 'bg-warning'
          } notification-bar d-flex flex-row align-items-center justify-content-center alert fade show m-0`}
          role='alert'
          data-testid='notificationBar'
        >
          <div className='container d-flex flex-row align-items-center justify-content-between'>
            {notification.id === 'newExplorerVersion' ? (
              <div className='d-flex justify-content-between align-items-center w-100'>
                A new version of the Explorer is available.
                <a
                  href='/#'
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    window.location.reload();
                  }}
                  className='ms-1 text-black'
                >
                  <u>Reload</u>
                </a>
              </div>
            ) : (
              <div className='w-100'>{notification.text}</div>
            )}
            {notification.dismissable && (
              <a
                href='/#'
                onClick={(event) => {
                  event.preventDefault();
                  removeNotification(notification.id);
                }}
                className='d-flex'
              >
                <FontAwesomeIcon icon={faTimes} className='close-icon' />
              </a>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};
