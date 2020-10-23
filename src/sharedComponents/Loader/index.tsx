import React from 'react';

const Dots = () => (
  <div className="lds-ellipsis mx-auto mt-5 mb-5">
    <div />
    <div />
    <div />
    <div />
  </div>
);

export default class Loader extends React.Component {
  static Dots = Dots;
  render() {
    return (
      <div className="card" data-testid="loader">
        <div className="card-body card-details">
          <div className="row h-100 justify-content-center align-items-center">
            <div className="col-12 text-center">
              <Dots />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
