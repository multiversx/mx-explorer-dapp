import { useSelector } from 'react-redux';

import { Loader } from 'components';
import { proofSelector } from 'redux/selectors';

export const ProofDetails = () => {
  const { proofState } = useSelector(proofSelector);
  const { properties, tags } = proofState;

  const hasProperties = properties && Object.keys(properties).length > 0;

  if (!hasProperties) {
    return null;
  }

  return (
    <div className='card proof-details'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap'>
          <h5>Proof Details</h5>
        </div>
      </div>
      {proofState ? (
        <>
          <div className='card-body d-flex flex-column gap-spacer'>
            <div>
              <h5 className='card card-sm bg-table-header p-3 mb-3'>
                Properties
              </h5>
              <div className='attributes-holder'>
                {Object.entries(properties).map(([key, value], i) => {
                  return (
                    <div className='attribute' key={i}>
                      <p className='trait' title={key}>
                        {key}
                      </p>
                      <p className='value' title={value}>
                        {value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            {tags !== undefined && tags.length > 0 && (
              <div>
                <h5 className='card card-sm bg-table-header p-3 mb-3'>Tags</h5>
                <div className='d-flex flex-wrap gap-2'>
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className='badge badge-outline badge-outline-grey gap-2'
                    >
                      #{tag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <Loader data-testid='proofDetailsLoader' />
      )}
    </div>
  );
};
