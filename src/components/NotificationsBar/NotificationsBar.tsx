import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import {
  TEMP_LOCAL_NOTIFICATION_DISMISSED,
  NEW_VERSION_NOTIFICATION
} from 'appConstants';
import { useNotifications } from 'hooks';
import { faTimes } from 'icons/light';
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

  const bgClassName = Boolean(notification?.bgClassName)
    ? notification.bgClassName
    : 'bg-warning';

  return (
    <>
      {notification !== undefined ? (
        <div
          className={classNames(
            'notification-bar d-flex flex-row align-items-center justify-content-center alert fade show',
            bgClassName
          )}
          role='alert'
          data-testid='notificationBar'
        >
          <div className='container'>
            <div className='col-12 notification d-flex flex-row align-items-center justify-content-between'>
              {notification.id === NEW_VERSION_NOTIFICATION && (
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
              )}
              {notification.id === TEMP_LOCAL_NOTIFICATION_DISMISSED && (
                <div className='w-100'>
                  <a
                    href='https://governance.multiversx.com/proposal/erd1qqqqqqqqqqqqqpgqfn2mu8l0dte34eqh6qtgmpjpxpkhunccrl4sy2sp07/1'
                    target='_blank'
                    rel='noreferrer nofollow noopener'
                    className='text-black'
                  >
                    <u>
                      Governance Vote LIVE: Andromeda Protocol Upgrade. Vote
                      now!
                    </u>
                  </a>
                </div>
              )}
              {![
                TEMP_LOCAL_NOTIFICATION_DISMISSED,
                NEW_VERSION_NOTIFICATION
              ].includes(notification.id) && (
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
        </div>
      ) : null}
    </>
  );
};
