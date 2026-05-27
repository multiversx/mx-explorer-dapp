import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Converter } from './components/Converter';
import { useCategories } from './hooks/useCategories';

export const Converters = () => {
  const { categories } = useCategories();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.replace('#', ''));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hash]);

  return (
    <div className='converters page-content container'>
      <h1 className='mb-4'>Converters</h1>

      {categories.map((category) => (
        <section
          key={category.identifier}
          id={category.identifier}
          className='mb-5'
        >
          <h4 className='mb-3'>{category.name}</h4>
          <div className='row g-3'>
            {category.converters.map((converter) => (
              <div key={converter.identifier} className='col-12 col-lg-6'>
                <Converter {...converter} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
