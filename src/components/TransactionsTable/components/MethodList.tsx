import { useSearchParams } from 'react-router-dom';

export const MethodList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { function: method } = Object.fromEntries(searchParams);

  const setMethod = (method: string) => {
    const { page, size, ...rest } = Object.fromEntries(searchParams);

    if (method === '' && rest?.function) {
      delete rest.function;
    }
    const nextUrlParams = {
      ...rest,
      ...(method ? { function: method } : {})
    };

    setSearchParams(nextUrlParams);
  };

  if (!method) {
    return null;
  }

  return (
    <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
      <ul className='list-inline m-0 d-flex flex-wrap gap-2'>
        {method && (
          <li className='list-inline-item'>
            <div className='badge badge-outline badge-outline-green text-capitalize d-flex align-items-center justify-content-center pe-0'>
              {method}
              <div
                onClick={() => {
                  setMethod('');
                }}
                className='text-green px-2 cursor-pointer'
              >
                ×
              </div>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};
