import { CardItem } from 'components';
import { faCheck, faTimes } from 'icons/solid';
import { NodeType } from 'types';

export const ValidatorDetails = ({ nodeData }: { nodeData: NodeType }) => {
  const {
    leaderSuccess,
    leaderFailure,
    validatorSuccess,
    validatorFailure,
    validatorIgnoredSignatures
  } = nodeData;

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-header-item'>
          <h5 data-testid='title' className='mb-0 d-flex align-items-center'>
            Validator Statistics
          </h5>
        </div>
      </div>
      <div className='card-body card-item-container my-n2 mx-spacing'>
        <CardItem title='Ignored Signature' icon={faTimes}>
          {validatorIgnoredSignatures ? validatorIgnoredSignatures : <>N/A</>}
        </CardItem>
        <CardItem title='Leader Success' icon={faCheck}>
          {leaderSuccess ? leaderSuccess : <>N/A</>}
        </CardItem>
        <CardItem title='Leader Failure' icon={faTimes}>
          {leaderFailure ? leaderFailure : <>N/A</>}
        </CardItem>
        <CardItem title='Validator Success' icon={faCheck}>
          {validatorSuccess ? validatorSuccess : <>N/A</>}
        </CardItem>
        <CardItem title='Validator Failure' icon={faTimes}>
          {validatorFailure ? validatorFailure : <>N/A</>}
        </CardItem>
      </div>
    </div>
  );
};
