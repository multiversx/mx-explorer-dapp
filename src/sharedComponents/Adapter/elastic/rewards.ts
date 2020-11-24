import axios from 'axios';

export default async function rewards({
  proxyUrl,
  address,
  timeout,
}: {
  proxyUrl: string;
  address: string;
  timeout: number;
}) {
  try {
    const {
      data: {
        claimableRewards,
        userActiveStake,
        userDeferredPaymentStake,
        userUnstakedStake,
        userWaitingStake,
        userWithdrawOnlyStake,
      },
    } = await axios.get(`${proxyUrl}/accounts/${address}/delegation`, { timeout });

    return {
      claimableRewards,
      userActiveStake,
      userDeferredPaymentStake,
      userUnstakedStake,
      userWaitingStake,
      userWithdrawOnlyStake,
    };
  } catch (error) {
    console.error('rewards error', error);
    throw new Error(error);
  }
}
