import { ValidatorType } from 'context/validators';

const getPeerType = (peerType: ValidatorType['peerType']) => {
  switch (true) {
    case peerType.includes('jailed'):
      return 'jailed';
    case peerType.includes('observer'):
      return 'observer';
    case peerType.includes('waiting'):
      return 'waiting';
    case peerType.includes('eligible'):
      return 'eligible';
    default:
      return 'new';
  }
};

export default getPeerType;
