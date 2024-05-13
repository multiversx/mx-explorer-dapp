import { multiversxApps, SHARE_PREFIX } from 'config';
import { capitalize } from 'helpers';

export const EcosystemMenu = () => {
  const sharePrefix = SHARE_PREFIX ? `${capitalize(SHARE_PREFIX)} ` : '';
  return (
    <menu
      id='ecosystem-menu'
      className='ecosystem-menu navbar-nav'
      role='menu'
      aria-labelledby='ecosystem-menu-button'
    >
      {multiversxApps.map((menuEntry) => {
        return (
          <li key={menuEntry.id} role='presentation'>
            {menuEntry.id === 'explorer' ? (
              <span className='ecosystem-menu-item active' role='menuitem'>
                {menuEntry.custom ? sharePrefix : ''}
                {menuEntry.name}
              </span>
            ) : (
              <a
                href={menuEntry.url}
                target={`${menuEntry.id === 'explorer' ? '' : '_blank'}`}
                rel='noopener noreferrer'
                className='ecosystem-menu-item nav-link'
                role='menuitem'
              >
                {menuEntry.custom ? sharePrefix : ''}
                {menuEntry.name}
              </a>
            )}
          </li>
        );
      })}
    </menu>
  );
};
