import axios from 'axios';

interface ParamsType {
  nodeUrl: string;
  timeout: number;
}

export async function getValidatorsData({ nodeUrl, timeout }: ParamsType) {
  try {
    const {
      data: { message },
    } = await axios.get(`${nodeUrl}/node/heartbeatstatus`, { timeout });

    if (Array.isArray(message)) {
      return {
        data: message,
        success: message.length >= 1,
      };
    }
    return {
      data: [],
      success: false,
    };
  } catch {
    return {
      data: [],
      success: false,
    };
  }
}

export async function getValidatorStatistics({ nodeUrl, timeout }: ParamsType) {
  try {
    const {
      data: { statistics },
    } = await axios.get(`${nodeUrl}/validator/statistics`, { timeout });
    return {
      statistics,
      success: true,
    };
  } catch {
    // const statistics = {
    //   statistics: {
    //     '00a2affc6e125bc7d9ee503880eb93f9395f4775f98f0cb3684f8a326f3aa04216fdf11af4e6a10568f12977abf75641a8f51b4a3eba320e240ea366c8d43aec3bb54fbb901863ed2d8fd0441f5703d2d7d0b14b017552bc2c9731293021038188dc0a2869d6350757a649af8d91ff05935d1f35d99b42bcb45540895e4108f2': {
    //       nrLeaderSuccess: 3,
    //       nrLeaderFailure: 7,
    //       nrValidatorSuccess: 7,
    //       nrValidatorFailure: 3,
    //     },
    //     '00f42355c71c0e642ed3eeaa6f2cdc228ef34d5e6bfc2cd09836a76ff04e95bf5277ed2d677c7ead81fd2dc0c64646e4965a318a208b9d6f71558b43359f26a06648752b047b51159b7280b217f1804741068a4ab7d0ec860ce8c8f24044538b8247fae5f642a2b1c54865cf034d9918bbe50d10f8e5eff55dc69ae157153902': {
    //       nrLeaderSuccess: 3,
    //       nrLeaderFailure: 1,
    //       nrValidatorSuccess: 10,
    //       nrValidatorFailure: 4,
    //     },
    //     '063f98ad838fea5177bbe5c0f2b2dab4fecaebd4724f54b58d46d50ef79599c11e173190886b4a2048b7b4329c17fed41733c5a334b8a5fd2a4e9bafbb1801b17301ea55aabc8014366d0eae2ecbb1c4f47a13403060b02f8f6b50e9e7deac787c5e507edcf9d8631b9053d1f81ac212c33fa258d1b66b6d5ce6251f9e3757f1': {
    //       nrLeaderSuccess: 12,
    //       nrLeaderFailure: 0,
    //       nrValidatorSuccess: 3,
    //       nrValidatorFailure: 0,
    //     },
    //     '38efdc86256bfea81ff7cf48273d09e78c80c70d318f0343ae2cfd37ad033823572f8f0cabb490694ee5b885282fde5c883aa66408c922560d7e56efc3debfb66eb134cb547fdbad21eb465644a9660ff971dfd2150e659449d0008d373375cb3a3a9667bf02c40e81d71e14121cea6504723f21eea0be891c0f7b274e34c40d': {
    //       nrLeaderSuccess: 3,
    //       nrLeaderFailure: 0,
    //       nrValidatorSuccess: 12,
    //       nrValidatorFailure: 0,
    //     },
    //     '4639b4d11444da31b239032674957897aae3c3a33fd95cadef0fdc0a01c4fc8e6cc629aab8a1625b43d07536f30427f380102533130e0aff7ca35bdc5cca71b01d3372752d1e9a1aca1400902705025239a9ffae95fe192cf8e06ff5e38d9ad962da9f5dbe4e452fe97939d933ee8bae945c91e02f3dbb61f95ca25736118beb': {
    //       nrLeaderSuccess: 9,
    //       nrLeaderFailure: 0,
    //       nrValidatorSuccess: 6,
    //       nrValidatorFailure: 0,
    //     },
    //     '7d1eaa0c39bcf92160daf67172c005712c33eeef784dd5fadbdf72f5db68879c2b6fd6218af2c9c3056f3627ea975657643ce07cb69f699e355e0586869870d530c2862d2270dd535db6762413abe84cb0b89fb741ced511c1d0550aa6dfa08618ba62c570fec26b166ebfd345cfbf4593e30ee884611994701b5251b0fa948f': {
    //       nrLeaderSuccess: 6,
    //       nrLeaderFailure: 0,
    //       nrValidatorSuccess: 9,
    //       nrValidatorFailure: 0,
    //     },
    //     '8818b5400b58c590fbd2d79472751d5379fccd49bc7dbdd845e59f7b04b59bfa6fbaba696cda670c391fc857d745abef19df505d6492adda55505aef48ea37fc66e0fd43f11b26698b201e25985b91228fe9bc3f5701ac78db0f714409d88aa82b4e62c7833d594e73a1b21d687abec6fd8d4b912677ac4543e7068592ccef29': {
    //       nrLeaderSuccess: 10,
    //       nrLeaderFailure: 0,
    //       nrValidatorSuccess: 7,
    //       nrValidatorFailure: 0,
    //     },
    //   },
    // };
    return {
      // statistics: statistics.statistics,
      statistics: {},
      success: false,
    };
  }
}
