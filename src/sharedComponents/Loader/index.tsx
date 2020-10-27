import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons/faSpinnerThird';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { PageState } from 'sharedComponents';

const Dots = () => (
  <div className="lds-ellipsis mx-auto mt-5 mb-5">
    <div />
    <div />
    <div />
    <div />
  </div>
);

export default class Loader extends React.Component<{ hideCard?: boolean; dataTestId?: string }> {
  static Dots = Dots;
  render() {
    const hideCard = this.props.hideCard;
    const Wrapper = ({ children }: { children: React.ReactNode }) =>
      hideCard ? (
        <>{children}</>
      ) : (
        <div className="card">
          <div className="card-body">{children}</div>
        </div>
      );

    return (
      <Wrapper>
        <PageState
          title="Loading..."
          symbol={
            <FontAwesomeIcon
              icon={faSpinnerThird}
              size="5x"
              className="text-primary fa-spin fast-spin"
            />
          }
          dataTestId={this.props.dataTestId}
          className="py-spacer d-flex h-100 align-items-center justify-content-center"
        />
      </Wrapper>
    );
  }
}
