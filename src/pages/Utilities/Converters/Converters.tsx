import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router';

import { CategoriesNav } from './components/CategoriesNav';
import { Converter } from './components/Converter';
import { GeneralConverter } from './components/GeneralConverter';
import { scrollToAnchor } from './helpers';
import { useActiveAnchor } from './hooks/useActiveAnchor';
import { useCategories } from './hooks/useCategories';

export const Converters = () => {
  const { categories } = useCategories();
  const { hash } = useLocation();

  const anchorIds = useMemo(
    () =>
      categories.flatMap((category) =>
        category.converters.map((converter) => converter.identifier)
      ),
    [categories]
  );

  const { activeId } = useActiveAnchor({ anchorIds });

  useEffect(() => {
    if (hash) {
      scrollToAnchor(hash.replace('#', ''));
    }
  }, [hash]);

  return (
    <div className='converters page-content container'>
      <div className='page-hero card card-lg card-black mb-3'>
        <div className='card-header'>
          <h2 className='title mb-0 text-capitalize'>Converters</h2>
        </div>
        <div className='card-body'>
          <GeneralConverter />
        </div>
      </div>

      <div className='row'>
        <div className='col-12 col-lg-3 categories-navigation-column'>
          <div className='card card-black categories-navigation'>
            <div className='card-body'>
              <CategoriesNav categories={categories} activeId={activeId} />
            </div>
          </div>
        </div>

        <div className='col-12 col-lg-9 d-flex flex-column gap-5'>
          {categories.map((category) => (
            <section key={category.identifier} id={category.identifier}>
              <h4 className='mb-3'>{category.name}</h4>
              <div className='row g-3'>
                {category.converters.map((converter) => (
                  <div key={converter.identifier} className='col-12'>
                    <Converter {...converter} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
