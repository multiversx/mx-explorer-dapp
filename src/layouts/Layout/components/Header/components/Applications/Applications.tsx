import { multiversxApps } from 'config';
import { capitalize } from 'helpers';

export const Applications = () => {
  const customLinkPrefix = process.env.VITE_APP_SHARE_PREFIX
    ? `${capitalize(
        String(process.env.VITE_APP_SHARE_PREFIX).replace('-', ' ')
      )}`
    : '';

  return (
    <div className='applications'>
      {multiversxApps.map((application) => {
        return application.id === 'explorer' ? (
          <span key={application.id} className='application active'>
            {application?.custom ? customLinkPrefix : ''}
            {application.name}
          </span>
        ) : (
          <a
            key={application.id}
            href={application.url}
            target={`${application.id === 'explorer' ? '' : '_blank'}`}
            rel='noopener noreferrer'
            className='application'
          >
            {application?.custom ? customLinkPrefix : ''}
            {application.name}
          </a>
        );
      })}
    </div>
  );
};
