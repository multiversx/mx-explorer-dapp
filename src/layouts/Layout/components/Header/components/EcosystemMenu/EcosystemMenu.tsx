import { multiversxApps, SHARE_PREFIX } from 'config';
import { capitalize } from 'helpers';

export const EcosystemMenu = () => {
  const sharePrefix = SHARE_PREFIX ? `${capitalize(SHARE_PREFIX)} ` : '';
  return (
    <div className='ecosystem-menu'>
      {multiversxApps.map((menuEntry) => {
        return menuEntry.id === 'explorer' ? (
          <span key={menuEntry.id} className='ecosystem-menu-item active'>
            {menuEntry.custom ? sharePrefix : ''}
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
            {menuEntry.custom ? sharePrefix : ''}
            {menuEntry.name}
          </a>
        );
      })}
    </div>
  );
};
