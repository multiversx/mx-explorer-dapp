import { MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { CategoriesNavType } from './types';
import { scrollToAnchor } from '../../helpers';

export const CategoriesNav = ({ categories, activeId }: CategoriesNavType) => {
  const navigate = useNavigate();
  const { hash } = useLocation();

  const onAnchorClick =
    (anchorId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();

      if (hash === `#${anchorId}`) {
        scrollToAnchor(anchorId);

        return;
      }

      navigate({ hash: `#${anchorId}` }, { replace: true });
    };

  return (
    <nav className='converters-nav' aria-label='Converter categories'>
      <menu className='navbar-nav flex-row flex-wrap tabs mt-0 converters-nav-list'>
        {categories.map((category) => {
          const isCategoryActive = category.converters.some(
            (converter) => converter.identifier === activeId
          );

          return (
            <li
              key={category.identifier}
              className='converters-nav-item d-flex flex-column'
            >
              <a
                href={`#${category.identifier}`}
                onClick={onAnchorClick(category.identifier)}
                className={`nav-item tab converters-nav-link ${
                  isCategoryActive ? 'active' : ''
                }`}
              >
                {category.name}
              </a>

              <ul className='converters-nav-sublist'>
                {category.converters.map((converter) => (
                  <li key={converter.identifier}>
                    <a
                      href={`#${converter.identifier}`}
                      onClick={onAnchorClick(converter.identifier)}
                      className={`converters-nav-sublink ${
                        converter.identifier === activeId ? 'active' : ''
                      }`}
                    >
                      {converter.name}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </menu>
    </nav>
  );
};
