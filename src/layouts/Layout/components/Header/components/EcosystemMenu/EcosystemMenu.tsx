import { multiversxApps } from 'config';
import { capitalize } from 'helpers';

export const EcosystemMenu = () => {
  const customLinkPrefix = process.env.VITE_APP_SHARE_PREFIX
    ? `${capitalize(
        String(process.env.VITE_APP_SHARE_PREFIX).replace('-', ' ')
      )}`
    : '';

  return (
    <div className='ecosystem-menu'>
      {multiversxApps.map((menuEntry) => {
        return menuEntry.id === 'explorer' ? (
          <span key={menuEntry.id} className='ecosystem-menu-item active'>
            {menuEntry?.custom ? customLinkPrefix : ''}
            {menuEntry.name}
          </span>
        ) : (
          <a
            key={menuEntry.id}
            href={menuEntry.url}
            target={`${menuEntry.id === 'explorer' ? '' : '_blank'}`}
            rel='noopener noreferrer'
            className='ecosystem-menu-item'
          >
            {menuEntry?.custom ? customLinkPrefix : ''}
            {menuEntry.name}
          </a>
        );
      })}
    </div>
  );
};
