import * as React from 'react';

const BrandInformation = () => {
  return (
    <div data-testid="brandContainer">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-2 card-label">Public Key</div>
            {/* <div className="col-lg-10">
              <div className="d-flex align-items-center">
                <div className="mr-3">
                  <img
                    className={brand.avatar ? 'avatar' : 'avatar gray'}
                    src={brand.avatar ? brand.avatar : '/validators/default-avatar.svg'}
                    alt={brand.name}
                    height="42"
                  />
                </div>
                {brand.name ? brand.name : 'N/A'}
              </div>
            </div> */}
          </div>
          <hr className="hr-space" />
        </div>
      </div>
    </div>
  );
};

export default BrandInformation;
